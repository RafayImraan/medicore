const HomeContent = require('../models/HomeContent');

const isEnabled = (item) => item && item.enabled !== false;

const normalizeRole = (role = '') => {
  const value = String(role).toLowerCase();
  if (value.includes('admin')) return 'admin';
  if (value.includes('doctor')) return 'doctor';
  if (value.includes('patient')) return 'patient';
  return 'guest';
};

const queryTokens = (query = '') =>
  String(query)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter(Boolean);

const computeVariantScore = (variant, role, tokens) => {
  let score = 0;
  if (!isEnabled(variant)) return -1;
  if (variant.role === role) score += 80;
  if (variant.role === 'guest' && role === 'guest') score += 30;
  const keywords = Array.isArray(variant.keywords) ? variant.keywords : [];
  tokens.forEach((token) => {
    if (keywords.some((keyword) => keyword.toLowerCase().includes(token) || token.includes(keyword.toLowerCase()))) {
      score += 25;
    }
  });
  score += variant.priority || 0;
  return score;
};

const computeRecommendationScore = (card, role, tokens) => {
  if (!isEnabled(card)) return -1;
  let score = card.scoreBoost || 0;
  if (card.audience === role) score += 70;
  if (card.audience === 'guest' && role === 'guest') score += 35;
  const keywords = Array.isArray(card.keywords) ? card.keywords : [];
  tokens.forEach((token) => {
    if (keywords.some((keyword) => keyword.toLowerCase().includes(token) || token.includes(keyword.toLowerCase()))) {
      score += 18;
    }
  });
  return score;
};

const getGuidedRoute = (symptomRouter = [], tokens = []) => {
  if (!tokens.length) return null;
  let best = null;
  let bestScore = -1;

  symptomRouter.forEach((route) => {
    const keywords = Array.isArray(route.keywords) ? route.keywords : [];
    let score = 0;
    tokens.forEach((token) => {
      if (keywords.some((keyword) => keyword.toLowerCase().includes(token) || token.includes(keyword.toLowerCase()))) {
        score += 20;
      }
    });
    if (score > bestScore) {
      bestScore = score;
      best = score > 0 ? route : best;
    }
  });

  return best;
};

const getHomeContent = async (req, res) => {
  try {
    const content = await HomeContent.findOne().sort({ createdAt: -1 }).lean();
    if (!content) {
      res.json({});
      return;
    }

    const role = normalizeRole(req.query.role);
    const query = String(req.query.q || '');
    const tokens = queryTokens(query);

    const enabledTrustSignals = (content.trustSignals || []).filter(isEnabled);
    const enabledIntentPaths = (content.intentPaths || []).filter(isEnabled);
    const enabledAudiencePaths = (content.audiencePaths || []).filter(isEnabled);
    const enabledQuickActions = (content.quickActions || []).filter(isEnabled);
    const enabledServices = (content.services || []).filter(isEnabled);
    const enabledCampaigns = (content.featuredCampaigns || []).filter(isEnabled);
    const enabledUrgentActions = (content.urgentActions || []).filter(isEnabled);
    const enabledVariants = (content.heroVariants || []).filter(isEnabled);
    const enabledRecommendations = (content.recommendationCards || []).filter(isEnabled);

    const chosenVariant =
      enabledVariants
        .map((variant) => ({ variant, score: computeVariantScore(variant, role, tokens) }))
        .sort((a, b) => b.score - a.score)[0]?.variant || null;

    const scoredRecommendations = enabledRecommendations
      .map((card) => ({ ...card, score: computeRecommendationScore(card, role, tokens) }))
      .filter((card) => card.score >= 0)
      .sort((a, b) => b.score - a.score);

    const guidedRoute = getGuidedRoute(content.symptomRouter || [], tokens);

    const activeSpotlight =
      enabledCampaigns
        .map((campaign) => {
          const base = 20;
          const title = `${campaign.title || ''} ${campaign.description || ''}`.toLowerCase();
          const score = tokens.reduce((sum, token) => (title.includes(token) ? sum + 15 : sum), base);
          return { campaign, score };
        })
        .sort((a, b) => b.score - a.score)[0]?.campaign || enabledCampaigns[0] || null;

    const resolvedHero = {
      ...(content.hero || {}),
      ...(chosenVariant || {}),
    };

    res.json({
      ...content,
      trustSignals: enabledTrustSignals,
      intentPaths: enabledIntentPaths,
      audiencePaths: enabledAudiencePaths,
      quickActions: enabledQuickActions,
      services: enabledServices,
      featuredCampaigns: enabledCampaigns,
      urgentActions: enabledUrgentActions,
      resolvedHero,
      resolvedRole: role,
      scoredRecommendations,
      activeSpotlight,
      guidedRoute,
      activeHeroVariant: chosenVariant,
      heroMedia: content.heroMedia || {},
    });
  } catch (error) {
    console.error('Error fetching home content:', error);
    res.status(500).json({ error: 'Failed to load home content' });
  }
};

module.exports = { getHomeContent };
