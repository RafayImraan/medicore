const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const BASE_URL = process.env.SCREENSHOT_BASE_URL || "http://localhost:5173";
const API_URL = process.env.SCREENSHOT_API_URL || "http://localhost:5000";
const OUT_DIR = path.resolve(process.cwd(), process.env.SCREENSHOT_OUT_DIR || "images/auto");
const SCREENSHOT_DELAY_MS = Number(process.env.SCREENSHOT_DELAY_MS || 1200);
const MAX_PAGES = Number(process.env.SCREENSHOT_MAX_PAGES || 100);
const AUTO_REGISTER = String(process.env.SCREENSHOT_AUTO_REGISTER || "true").toLowerCase() === "true";

const PUBLIC_ROUTES = [
  "/",
  "/services",
  "/departments",
  "/doctors",
  "/contact",
  "/emergency",
  "/book-appointment",
  "/pharmacy",
  "/diagnostic",
  "/home-healthcare",
  "/login",
  "/register",
  "/viewdashboard",
];

const ROLE_ROUTES = {
  admin: ["/dashboard/admin"],
  doctor: [
    "/dashboard/doctor",
    "/doctor/patients",
    "/doctor/schedule",
    "/doctor/lab-results",
    "/doctor/chat",
    "/doctor/billing",
  ],
  patient: [
    "/dashboard/patient",
    "/appointment-history",
    "/patient/lab-results",
    "/patient/prescriptions",
    "/patient/billing",
  ],
};

const ROLE_CREDS = {
  admin: {
    email: process.env.SCREENSHOT_ADMIN_EMAIL || "admin@example.com",
    password: process.env.SCREENSHOT_ADMIN_PASSWORD || "password123",
    name: process.env.SCREENSHOT_ADMIN_NAME || "Admin User",
  },
  doctor: {
    email: process.env.SCREENSHOT_DOCTOR_EMAIL || "doctor@example.com",
    password: process.env.SCREENSHOT_DOCTOR_PASSWORD || "doctor123",
    name: process.env.SCREENSHOT_DOCTOR_NAME || "Dr. John Smith",
  },
  patient: {
    email: process.env.SCREENSHOT_PATIENT_EMAIL || "patient@example.com",
    password: process.env.SCREENSHOT_PATIENT_PASSWORD || "patient123",
    name: process.env.SCREENSHOT_PATIENT_NAME || "Patient User",
  },
};

const DISCOVERY_ALLOWLIST = new Set([
  "/managing-chronic-conditions",
  "/family-caregiver-guide",
  "/home-recovery-checklist",
]);

const cleanName = (value) =>
  value
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/[?#].*$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "home";

const normalizeRoute = (route) => {
  if (!route) return "/";
  if (route.startsWith("http://") || route.startsWith("https://")) {
    try {
      const parsed = new URL(route);
      return parsed.pathname + (parsed.search || "");
    } catch {
      return route;
    }
  }
  return route.startsWith("/") ? route : `/${route}`;
};

const toAbsoluteUrl = (route) => new URL(route, BASE_URL).toString();

const isSameOrigin = (url) => {
  try {
    const a = new URL(url, BASE_URL);
    const b = new URL(BASE_URL);
    return a.origin === b.origin;
  } catch {
    return false;
  }
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function collectInternalLinks(page) {
  const links = await page.$$eval("a[href]", (anchors) =>
    anchors.map((a) => a.getAttribute("href")).filter(Boolean)
  );

  return links
    .filter((href) => !href.startsWith("mailto:") && !href.startsWith("tel:") && !href.startsWith("javascript:"))
    .map((href) => href.trim());
}

async function apiLogin(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  return { ok: response.ok, status: response.status, data };
}

async function apiRegister({ name, email, password, role }) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });

  return response.ok;
}

async function setBrowserAuthSession(page, session) {
  await page.goto(toAbsoluteUrl("/login"), { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.evaluate((s) => {
    localStorage.setItem("token", s.token);
    localStorage.setItem("refreshToken", s.refreshToken || "");
    localStorage.setItem("role", s.user.role);
    localStorage.setItem("user", JSON.stringify(s.user));
  }, session);
}

async function clearBrowserAuthSession(page) {
  await page.goto(toAbsoluteUrl("/login"), { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.evaluate(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
  });
}

async function ensureRoleSession(page, role) {
  const creds = ROLE_CREDS[role];
  if (!creds?.email || !creds?.password) return false;

  let login = await apiLogin(creds.email, creds.password);
  if (!login.ok && AUTO_REGISTER) {
    console.log(`[${role}] login failed (${login.status}). Trying auto-register...`);
    await apiRegister({ ...creds, role });
    login = await apiLogin(creds.email, creds.password);
  }

  if (!login.ok || !login.data?.token || !login.data?.user) {
    console.log(`[${role}] auth failed. Skipping protected routes.`);
    return false;
  }

  await setBrowserAuthSession(page, {
    token: login.data.token,
    refreshToken: login.data.refreshToken || "",
    user: login.data.user,
  });
  return true;
}

async function captureRoute(page, route, fileIndex, scope) {
  const targetUrl = toAbsoluteUrl(route);
  const fileName = `${String(fileIndex).padStart(3, "0")}-${scope}-${cleanName(route)}.png`;
  const outPath = path.join(OUT_DIR, fileName);

  try {
    console.log(`Capturing ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 60000 });
    await wait(SCREENSHOT_DELAY_MS);
    await page.screenshot({ path: outPath, fullPage: true });
    return true;
  } catch (error) {
    console.error(`Failed ${targetUrl}: ${error.message}`);
    return false;
  }
}

async function run() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 2200 });

  const pending = new Set(PUBLIC_ROUTES.map(normalizeRoute));
  const visitedPublic = new Set();
  const discovered = new Set();
  let fileIndex = 1;
  let captured = 0;

  console.log(`Base URL: ${BASE_URL}`);
  console.log(`API URL:  ${API_URL}`);
  console.log(`Output:   ${OUT_DIR}`);

  await clearBrowserAuthSession(page);

  // Public crawl pass
  while (pending.size > 0) {
    if (captured >= MAX_PAGES) {
      console.log(`Reached max page limit (${MAX_PAGES}). Stopping.`);
      break;
    }

    const route = pending.values().next().value;
    pending.delete(route);
    if (visitedPublic.has(route)) continue;
    visitedPublic.add(route);

    const ok = await captureRoute(page, route, fileIndex++, "public");
    if (ok) captured += 1;

    const links = await collectInternalLinks(page);
    for (const href of links) {
      const abs = new URL(href, toAbsoluteUrl(route)).toString();
      if (!isSameOrigin(abs)) continue;
      const parsed = new URL(abs);
      const discoveredRoute = parsed.pathname + (parsed.search || "");
      if (!DISCOVERY_ALLOWLIST.has(discoveredRoute)) continue;
      if (!visitedPublic.has(discoveredRoute)) {
        discovered.add(discoveredRoute);
        pending.add(discoveredRoute);
      }
    }
  }

  // Role-specific capture passes
  for (const role of Object.keys(ROLE_ROUTES)) {
    if (captured >= MAX_PAGES) break;

    const loggedIn = await ensureRoleSession(page, role);
    if (!loggedIn) continue;

    for (const route of ROLE_ROUTES[role]) {
      if (captured >= MAX_PAGES) break;
      const ok = await captureRoute(page, route, fileIndex++, role);
      if (ok) captured += 1;
    }

    await clearBrowserAuthSession(page);
  }

  await browser.close();
  console.log(`Done. Captured ${captured} page(s).`);
  console.log(`Discovered internal routes: ${discovered.size}`);
}

run().catch((error) => {
  console.error("Screenshot capture failed:", error);
  process.exit(1);
});
