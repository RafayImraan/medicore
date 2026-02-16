const fs = require('fs');
const path = require('path');
const rootDir = path.resolve(__dirname, '..');
let jsPDF;
try {
  ({ jsPDF } = require('jspdf'));
} catch {
  ({ jsPDF } = require(path.join(rootDir, 'client', 'node_modules', 'jspdf')));
}

const mdPath = path.join(__dirname, 'PROJECT_COMPLETE_DOCUMENTATION.md');
const outPath = path.join(__dirname, 'PROJECT_COMPLETE_DOCUMENTATION.pdf');

const md = fs.readFileSync(mdPath, 'utf8');
const lines = md.split(/\r?\n/);

const doc = new jsPDF({
  unit: 'pt',
  format: 'a4',
  compress: true,
});

const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const margin = 42;
const maxWidth = pageWidth - margin * 2;
let y = margin;

const ensureSpace = (needed) => {
  if (y + needed > pageHeight - margin) {
    doc.addPage();
    y = margin;
  }
};

const addTextBlock = (text, fontSize = 11, isBold = false) => {
  if (!text) {
    y += 8;
    return;
  }
  doc.setFont('helvetica', isBold ? 'bold' : 'normal');
  doc.setFontSize(fontSize);
  const wrapped = doc.splitTextToSize(text, maxWidth);
  const lineHeight = fontSize * 1.35;
  ensureSpace(wrapped.length * lineHeight + 2);
  for (const l of wrapped) {
    doc.text(l, margin, y);
    y += lineHeight;
  }
  y += 2;
};

const addImage = (imgRelPath, altText) => {
  const decodedPath = decodeURIComponent(imgRelPath);
  const imgPath = path.resolve(__dirname, decodedPath);
  if (!fs.existsSync(imgPath)) {
    addTextBlock(`[Missing image: ${imgRelPath}] ${altText || ''}`, 10, false);
    return;
  }

  const ext = path.extname(imgPath).toLowerCase();
  const type = ext === '.png' ? 'PNG' : ext === '.jpg' || ext === '.jpeg' ? 'JPEG' : null;
  if (!type) {
    addTextBlock(`[Unsupported image type: ${imgRelPath}] ${altText || ''}`, 10, false);
    return;
  }

  const data = fs.readFileSync(imgPath).toString('base64');
  const mime = type === 'PNG' ? 'image/png' : 'image/jpeg';
  const dataUrl = `data:${mime};base64,${data}`;
  const props = doc.getImageProperties(dataUrl);

  let w = maxWidth;
  let h = (props.height / props.width) * w;
  const maxH = pageHeight - margin * 2;
  if (h > maxH) {
    h = maxH;
    w = (props.width / props.height) * h;
  }

  ensureSpace(h + 18);
  doc.addImage(dataUrl, type, margin, y, w, h, undefined, 'FAST');
  y += h + 8;
  if (altText) addTextBlock(altText, 9, false);
};

const imageBuffer = [];
const addImageGridFourPerPage = (items) => {
  if (!items.length) return;

  const gapX = 10;
  const gapY = 14;
  const cols = 2;
  const rows = 2;
  const slotW = (maxWidth - gapX) / cols;
  const slotH = (pageHeight - margin * 2 - gapY) / rows;
  const captionPad = 12;

  let index = 0;
  while (index < items.length) {
    // Start a fresh page for each 4-image batch if current page already has content.
    if (y > margin + 5) {
      doc.addPage();
    }
    y = margin;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (index >= items.length) break;
        const item = items[index++];

        const decodedPath = decodeURIComponent(item.src);
        const imgPath = path.resolve(__dirname, decodedPath);
        const x = margin + c * (slotW + gapX);
        const ySlot = margin + r * (slotH + gapY);

        if (!fs.existsSync(imgPath)) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.text(`[Missing] ${item.src}`, x, ySlot + 12);
          continue;
        }

        const ext = path.extname(imgPath).toLowerCase();
        const type = ext === '.png' ? 'PNG' : ext === '.jpg' || ext === '.jpeg' ? 'JPEG' : null;
        if (!type) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.text(`[Unsupported] ${item.src}`, x, ySlot + 12);
          continue;
        }

        const data = fs.readFileSync(imgPath).toString('base64');
        const mime = type === 'PNG' ? 'image/png' : 'image/jpeg';
        const dataUrl = `data:${mime};base64,${data}`;
        const props = doc.getImageProperties(dataUrl);

        const maxImgW = slotW;
        const maxImgH = slotH - captionPad;
        let drawW = maxImgW;
        let drawH = (props.height / props.width) * drawW;
        if (drawH > maxImgH) {
          drawH = maxImgH;
          drawW = (props.width / props.height) * drawH;
        }

        const xImg = x + (slotW - drawW) / 2;
        const yImg = ySlot + (maxImgH - drawH) / 2;
        doc.addImage(dataUrl, type, xImg, yImg, drawW, drawH, undefined, 'FAST');

        if (item.alt) {
          const caption = item.alt.length > 44 ? `${item.alt.slice(0, 44)}...` : item.alt;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.text(caption, x, ySlot + slotH - 2);
        }
      }
    }
  }

  // Move cursor after image pages
  y = margin;
};

const flushImages = () => {
  if (!imageBuffer.length) return;
  const items = imageBuffer.splice(0, imageBuffer.length);
  addImageGridFourPerPage(items);
};

for (const line of lines) {
  const imgMatch = line.match(/^!\[(.*)\]\((.*)\)\s*$/);
  if (imgMatch) {
    imageBuffer.push({ alt: imgMatch[1], src: imgMatch[2] });
    continue;
  }
  flushImages();

  if (/^#{1,6}\s+/.test(line)) {
    const level = line.match(/^#+/)[0].length;
    const text = line.replace(/^#{1,6}\s+/, '').trim();
    const size = level === 1 ? 20 : level === 2 ? 16 : level === 3 ? 13 : 11;
    addTextBlock(text, size, true);
    continue;
  }

  if (line.startsWith('```')) {
    continue;
  }

  if (line.trim().startsWith('- ') || /^\d+\.\s+/.test(line.trim())) {
    addTextBlock(line.trim(), 10, false);
    continue;
  }

  addTextBlock(line, 10.5, false);
}
flushImages();

doc.save(outPath);
console.log(`PDF generated: ${path.relative(rootDir, outPath)}`);
