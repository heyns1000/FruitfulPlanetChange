import JSZip from 'jszip';
import type { Brand } from '@shared/schema';

// Tier-specific theme configurations for noodle_nexus "glimpse of hope" styling
const TIER_THEMES = {
  sovereign: {
    primary: '#9333ea',
    secondary: '#fbbf24',
    accent: '#f59e0b',
    gradient: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 50%, #6b21a8 100%)',
    glow: '0 0 20px rgba(147, 51, 234, 0.6)',
  },
  dynastic: {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#059669',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
    glow: '0 0 20px rgba(59, 130, 246, 0.6)',
  },
  operational: {
    primary: '#10b981',
    secondary: '#fbbf24',
    accent: '#f59e0b',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
    glow: '0 0 20px rgba(16, 185, 129, 0.6)',
  },
  market: {
    primary: '#6b7280',
    secondary: '#14b8a6',
    accent: '#0d9488',
    gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 50%, #374151 100%)',
    glow: '0 0 20px rgba(107, 114, 128, 0.6)',
  },
};

export class PackageGenerator {
  /**
   * Generate a complete downloadable package for a brand
   */
  async generatePackage(brand: Brand): Promise<Buffer> {
    const zip = new JSZip();
    const tier = this.determineTier(brand);
    const theme = TIER_THEMES[tier];
    const packageName = this.sanitizePackageName(brand.name);

    // Create package.json
    const packageJson = this.generatePackageJson(brand, packageName);
    zip.file('package.json', JSON.stringify(packageJson, null, 2));

    // Create README.md
    const readme = this.generateReadme(brand, tier, theme);
    zip.file('README.md', readme);

    // Create install script
    const installScript = this.generateInstallScript(packageName);
    zip.file('install-script.js', installScript);

    // Create tailwind config with tier-specific theme
    const tailwindConfig = this.generateTailwindConfig(tier, theme);
    zip.file('tailwind.config.js', tailwindConfig);

    // Create src directory with components
    const srcFolder = zip.folder('src');
    if (srcFolder) {
      srcFolder.file('index.jsx', this.generateIndexFile(brand, theme));
      
      const componentsFolder = srcFolder.folder('components');
      if (componentsFolder) {
        componentsFolder.file('GlimpseCard.jsx', this.generateGlimpseCard(theme));
      }

      const stylesFolder = srcFolder.folder('styles');
      if (stylesFolder) {
        stylesFolder.file('index.css', this.generateCSS(theme));
      }
    }

    // Create public directory
    const publicFolder = zip.folder('public');
    if (publicFolder) {
      publicFolder.file('index.html', this.generateIndexHtml(brand));
      publicFolder.file('manifest.json', this.generateManifest(brand, packageName));
    }

    // Create .env.example
    zip.file('.env.example', this.generateEnvExample());

    // Generate and return the ZIP buffer
    return await zip.generateAsync({ type: 'nodebuffer' });
  }

  /**
   * Determine tier from brand metadata
   */
  private determineTier(brand: Brand): keyof typeof TIER_THEMES {
    if (brand.metadata && typeof brand.metadata === 'object') {
      const tier = (brand.metadata as any).tier?.toLowerCase();
      if (tier && tier in TIER_THEMES) {
        return tier as keyof typeof TIER_THEMES;
      }
    }
    return 'market'; // default tier
  }

  /**
   * Sanitize brand name for package naming
   */
  private sanitizePackageName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Generate package.json
   */
  private generatePackageJson(brand: Brand, packageName: string) {
    return {
      name: `@fruitfulplanet/${packageName}`,
      version: '1.0.0',
      description: brand.description || `${brand.name} - Powered by FruitfulPlanet Global Marketplace`,
      main: 'src/index.jsx',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
        install: 'node install-script.js',
      },
      dependencies: {
        react: '^18.3.1',
        'react-dom': '^18.3.1',
        'framer-motion': '^11.18.2',
        tailwindcss: '^4.1.13',
      },
      devDependencies: {
        '@vitejs/plugin-react': '^5.0.3',
        vite: '^7.1.7',
      },
      keywords: [
        'fruitfulplanet',
        brand.name.toLowerCase(),
        'noodle-nexus',
        'glimpse-of-hope',
        'global-marketplace',
      ],
      author: 'FruitfulPlanet Global',
      license: 'MIT',
    };
  }

  /**
   * Generate README.md with brand info and "glimpse of hope" aesthetic
   */
  private generateReadme(brand: Brand, tier: string, theme: any): string {
    return `# ${brand.name}

> 🌟 **Glimpse of Hope** - Powered by FruitfulPlanet Global Marketplace

## Overview

${brand.description || `${brand.name} brings innovation and excellence to the ${brand.integration} ecosystem.`}

**Tier**: ${tier.charAt(0).toUpperCase() + tier.slice(1)}  
**Integration**: ${brand.integration}  
**Status**: ${brand.status}

## ✨ Noodle Nexus "Glimpse of Hope" Features

This package comes with the signature **noodle_nexus** aesthetic:

- 🌈 **Glimpse Glow Effects** - Ethereal shadow effects with tier-specific colors
- 💫 **Fade-in Animations** - Smooth entry animations for all components
- 🎨 **Pulsing Glimpse** - Gentle 3s infinite pulse animation
- 🌊 **Gradient Backgrounds** - Beautiful tier-specific gradients
- ⚡ **Framer Motion Transitions** - Smooth, professional animations

### Theme Colors

- **Primary**: ${theme.primary}
- **Secondary**: ${theme.secondary}
- **Accent**: ${theme.accent}
- **Gradient**: ${theme.gradient}

## 🚀 Installation

\`\`\`bash
npm install
# or
yarn install
\`\`\`

The install script will automatically configure your environment.

## 📦 Usage

\`\`\`bash
npm run dev
\`\`\`

Visit \`http://localhost:5173\` to see your brand in action!

## 🛠️ Build for Production

\`\`\`bash
npm run build
\`\`\`

## 🌐 App Store Deployment

This package is compatible with:

- ✅ Apple App Store
- ✅ Google Play Store
- ✅ Microsoft Store
- ✅ Progressive Web Apps (PWA)

## 📄 License

MIT - FruitfulPlanet Global

---

**Generated by FruitfulPlanet Global Marketplace Package System**  
*Noodle Nexus "Glimpse of Hope" Edition*
`;
  }

  /**
   * Generate auto-installation script
   */
  private generateInstallScript(packageName: string): string {
    return `#!/usr/bin/env node

console.log('\\n🌟 FruitfulPlanet Package Installation\\n');
console.log('📦 Installing ${packageName}...');
console.log('✨ Configuring Noodle Nexus "Glimpse of Hope" theme...\\n');

// Auto-setup logic
const fs = require('fs');
const path = require('path');

// Create .env from .env.example if not exists
if (!fs.existsSync('.env') && fs.existsSync('.env.example')) {
  fs.copyFileSync('.env.example', '.env');
  console.log('✅ Created .env file from template');
}

console.log('\\n🎉 Installation complete!');
console.log('\\n📝 Next steps:');
console.log('   npm run dev    - Start development server');
console.log('   npm run build  - Build for production\\n');
`;
  }

  /**
   * Generate Tailwind config with tier-specific theme
   */
  private generateTailwindConfig(tier: string, theme: any): string {
    return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glimpse: {
          primary: '${theme.primary}',
          secondary: '${theme.secondary}',
          accent: '${theme.accent}',
        },
      },
      boxShadow: {
        'glimpse': '${theme.glow}',
        'glimpse-lg': '0 0 30px ${theme.primary}',
      },
      animation: {
        'glimpse-pulse': 'glimpse-pulse 3s ease-in-out infinite',
        'glimpse-fade-in': 'glimpse-fade-in 0.6s ease-out',
      },
      keyframes: {
        'glimpse-pulse': {
          '0%, 100%': { 
            opacity: '1',
            boxShadow: '${theme.glow}',
          },
          '50%': { 
            opacity: '0.8',
            boxShadow: '${theme.glow.replace('20px', '30px')}',
          },
        },
        'glimpse-fade-in': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}
`;
  }

  /**
   * Generate main index.jsx file
   */
  private generateIndexFile(brand: Brand, theme: any): string {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import { motion } from 'framer-motion';
import GlimpseCard from './components/GlimpseCard';
import './styles/index.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-5xl font-bold text-white mb-4 animate-glimpse-fade-in">
          ${brand.name}
        </h1>
        <p className="text-gray-300 mb-8 text-lg">
          ${brand.description || 'Powered by FruitfulPlanet Global Marketplace'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlimpseCard 
            title="Integration"
            content="${brand.integration}"
          />
          <GlimpseCard 
            title="Status"
            content="${brand.status}"
          />
          <GlimpseCard 
            title="Glimpse of Hope"
            content="Noodle Nexus powered design system"
          />
          <GlimpseCard 
            title="Global Ready"
            content="App Store compatible"
          />
        </div>
      </motion.div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
  }

  /**
   * Generate GlimpseCard component with animations
   */
  private generateGlimpseCard(theme: any): string {
    return `import React from 'react';
import { motion } from 'framer-motion';

export default function GlimpseCard({ title, content }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-glimpse hover:shadow-glimpse-lg transition-all duration-300 animate-glimpse-pulse"
      style={{
        background: '${theme.gradient}',
        backgroundBlendMode: 'overlay',
      }}
    >
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{content}</p>
    </motion.div>
  );
}
`;
  }

  /**
   * Generate CSS with glimpse animations
   */
  private generateCSS(theme: any): string {
    return `@import 'tailwindcss';

/* Noodle Nexus "Glimpse of Hope" Global Styles */

:root {
  --glimpse-primary: ${theme.primary};
  --glimpse-secondary: ${theme.secondary};
  --glimpse-accent: ${theme.accent};
  --glimpse-glow: ${theme.glow};
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Glimpse animations */
@keyframes glimpse-pulse {
  0%, 100% {
    opacity: 1;
    box-shadow: var(--glimpse-glow);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 30px var(--glimpse-primary);
  }
}

@keyframes glimpse-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-glimpse-pulse {
  animation: glimpse-pulse 3s ease-in-out infinite;
}

.animate-glimpse-fade-in {
  animation: glimpse-fade-in 0.6s ease-out;
}
`;
  }

  /**
   * Generate index.html
   */
  private generateIndexHtml(brand: Brand): string {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${brand.description || brand.name}" />
    <meta name="theme-color" content="#000000" />
    <link rel="manifest" href="/manifest.json" />
    <title>${brand.name} - FruitfulPlanet</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>
`;
  }

  /**
   * Generate PWA manifest for app stores
   */
  private generateManifest(brand: Brand, packageName: string): string {
    return JSON.stringify({
      name: brand.name,
      short_name: brand.name,
      description: brand.description || `${brand.name} - FruitfulPlanet`,
      start_url: '/',
      display: 'standalone',
      background_color: '#000000',
      theme_color: '#9333ea',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    }, null, 2);
  }

  /**
   * Generate .env.example
   */
  private generateEnvExample(): string {
    return `# FruitfulPlanet Package Environment Variables

# API Configuration
VITE_API_URL=http://localhost:5000
VITE_BRAND_ID=

# Feature Flags
VITE_ENABLE_GLIMPSE=true
VITE_ENABLE_ANALYTICS=false

# App Store Configuration
VITE_APPLE_STORE_ID=
VITE_GOOGLE_STORE_ID=
VITE_MICROSOFT_STORE_ID=
`;
  }
}
