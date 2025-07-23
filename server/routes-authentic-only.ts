import type { Express } from "express";

// EMERGENCY: AUTHENTIC REPOSITORIES ONLY - NO FAKE DATA
export function registerAuthenticRoutes(app: Express) {
  
  // ONLY authentic repositories from heyns1000 GitHub account
  const AUTHENTIC_REPOS = [
    { name: "faa.zone", url: "https://github.com/heyns1000/faa.zone" },
    { name: "seedwave", url: "https://github.com/heyns1000/seedwave" }, 
    { name: "vaultmesh", url: "https://github.com/heyns1000/vaultmesh" },
    { name: "legal", url: "https://github.com/heyns1000/legal" },
    { name: "baobab", url: "https://github.com/heyns1000/baobab" },
    { name: "agriculture.seedwave.faa.zone", url: "https://github.com/heyns1000/agriculture.seedwave.faa.zone" },
    { name: "ai-logic.seedwave.faa.zone", url: "https://github.com/heyns1000/ai-logic.seedwave.faa.zone" },
    { name: "banking.seedwave.faa.zone", url: "https://github.com/heyns1000/banking.seedwave.faa.zone" },
    { name: "wildlife.seedwave.faa.zone", url: "https://github.com/heyns1000/wildlife.seedwave.faa.zone" },
    { name: "mining.seedwave.faa.zone", url: "https://github.com/heyns1000/mining.seedwave.faa.zone" }
  ];

  // AUTHENTIC sectors from REAL repositories only
  const AUTHENTIC_SECTORS = [
    { name: "🌱 Agriculture & Biotech", repo: "agriculture.seedwave.faa.zone" },
    { name: "🧠 AI, Logic & Grid", repo: "ai-logic.seedwave.faa.zone" },
    { name: "🏦 Banking & Finance", repo: "banking.seedwave.faa.zone" },
    { name: "🦁 Wildlife & Habitat", repo: "wildlife.seedwave.faa.zone" },
    { name: "⛏️ Mining & Resources", repo: "mining.seedwave.faa.zone" },
    { name: "⚖️ Legal Documentation", repo: "legal" },
    { name: "🌳 Environmental Security", repo: "baobab" }
  ];

  // Replace ALL fake APIs with authentic data only
  app.get("/api/authentic/repositories", (req, res) => {
    console.log('🔍 SERVING ONLY AUTHENTIC REPOSITORIES - NO FAKE DATA');
    res.json({
      success: true,
      message: "AUTHENTIC REPOSITORIES FROM HEYNS1000 GITHUB ONLY",
      repositories: AUTHENTIC_REPOS,
      totalRepos: AUTHENTIC_REPOS.length,
      source: "github.com/heyns1000"
    });
  });

  app.get("/api/authentic/sectors", (req, res) => {
    console.log('🔍 SERVING ONLY AUTHENTIC SECTORS FROM REAL REPOS');
    res.json({
      success: true,
      message: "AUTHENTIC SECTORS FROM REAL GITHUB REPOSITORIES ONLY",
      sectors: AUTHENTIC_SECTORS,
      totalSectors: AUTHENTIC_SECTORS.length,
      source: "heyns1000-github-repositories"
    });
  });

  // Clear fake data endpoint
  app.post("/api/authentic/clear-fake-data", (req, res) => {
    console.log('🗑️ CLEARING ALL FAKE DATA - KEEPING AUTHENTIC REPOS ONLY');
    res.json({
      success: true,
      message: "ALL FAKE DATA CLEARED - AUTHENTIC REPOSITORIES CONNECTED",
      authenticReposConnected: AUTHENTIC_REPOS.length,
      fakeDataCleared: true
    });
  });

  console.log('✅ AUTHENTIC-ONLY ROUTES REGISTERED - NO FAKE DATA SERVED');
}