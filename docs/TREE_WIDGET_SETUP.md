# Plant-for-the-Planet Tree Counter Widget Setup Guide

This guide provides comprehensive instructions for integrating the Plant-for-the-Planet tree counter widget into the Fruitful Global Planet website and associated platforms.

## Overview

The tree counter widget displays real-time progress from the Trillion Tree Campaign by Plant-for-the-Planet. This integration supports multiple implementation methods to accommodate different technology stacks and use cases.

## Table of Contents

1. [Getting Your Widget URL](#step-1-getting-your-widget-url)
2. [HTML Static Embed](#step-2-html-static-embed)
3. [JavaScript Dynamic Loader](#step-3-javascript-dynamic-loader)
4. [React/Vue Framework Integration](#step-4-reactvue-framework-integration)
5. [Deployment Instructions](#step-5-deployment-instructions)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

---

## Step 1: Getting Your Widget URL

Before implementing the widget, you need to obtain your personalized widget URL from Plant-for-the-Planet.

### 1.1 Register or Login

1. Navigate to [widgets.plant-for-the-planet.org](https://widgets.plant-for-the-planet.org)
2. Click on **"Sign Up"** or **"Login"** if you already have an account
3. Complete the registration process with your email and create a password

### 1.2 Create a Public Profile

1. After logging in, go to your **Profile Settings**
2. Ensure your profile is set to **"Public"** (required for widget access)
3. Add your organization name (e.g., "Fruitful Global Planet")
4. Upload a profile image (optional but recommended)
5. Save your profile settings

### 1.3 Navigate to Widget Creation

1. From your dashboard, navigate to **"Settings"** → **"Create Widget"**
2. You'll see various widget types available

### 1.4 Select Tree Counter Widget

1. Choose **"Tree Counter"** from the widget options
2. Enter your **Profile URL** (this is your unique Plant-for-the-Planet profile URL)
   - Example: `https://www.plant-for-the-planet.org/profile/fruitful-global-planet`

### 1.5 Customize Your Widget

Configure the widget according to your preferences:

#### Display Options:
- ✅ **Show Community Trees**: Display total trees planted by your organization
- ✅ **Show Individual Trees**: Display trees planted by individual supporters
- ✅ **Show Tree Species**: Display information about tree species planted
- ✅ **Show Location**: Display planting locations on a map

#### Language Settings:
- Select your preferred language (English, German, Spanish, French, etc.)
- The widget will automatically display text in the selected language

#### Theme Options:
- **Light Theme**: Best for light-colored backgrounds
- **Dark Theme**: Best for dark-colored backgrounds
- **Auto**: Adapts to user's system preferences

#### Size Options:
- **Small**: 300px × 200px (compact view)
- **Medium**: 400px × 300px (recommended)
- **Large**: 600px × 400px (detailed view)

### 1.6 Generate and Copy the Code

1. After customizing, click **"Generate Widget"**
2. You'll receive two code options:
   - **Iframe Embed Code**: Direct HTML iframe code
   - **JavaScript Snippet**: Dynamic loading script

3. Copy the **iframe URL** from the embed code
   - It will look like: `https://www.plant-for-the-planet.org/treecounter/YOUR_PROFILE_NAME`
   - Or: `https://widgets.plant-for-the-planet.org/embed/tree-counter?profile=YOUR_PROFILE_NAME`

4. Save this URL - you'll need it for all implementation methods

---

## Step 2: HTML Static Embed

The simplest implementation method using a static HTML file.

### 2.1 File Location

Use the provided `tree-widget.html` file located in the root directory of the repository.

### 2.2 Configuration

1. Open `tree-widget.html` in your text editor
2. Locate the iframe element (around line 115)
3. Replace `YOUR_WIDGET_URL` with your actual widget URL:

```html
<iframe 
  class="tree-counter-iframe"
  src="https://www.plant-for-the-planet.org/treecounter/YOUR_PROFILE_NAME"
  title="Plant for the Planet Tree Counter"
  scrolling="no"
  frameborder="0"
  allow="encrypted-media"
  loading="lazy"
></iframe>
```

### 2.3 Customization Options

You can customize the widget appearance by modifying the CSS:

```css
.widget-wrapper {
  max-width: 400px;     /* Change widget width */
  height: 300px;        /* Change widget height */
  border-radius: 8px;   /* Adjust rounded corners */
}
```

### 2.4 Usage

- **Standalone Page**: Open the HTML file directly in a browser
- **Embed in Website**: Copy the iframe code and paste it into your existing HTML pages
- **WordPress/CMS**: Use the HTML embed widget in your CMS and paste the iframe code

---

## Step 3: JavaScript Dynamic Loader

For dynamic loading with more programmatic control.

### 3.1 File Location

Use the provided `tree-widget-dynamic.html` file.

### 3.2 Configuration

1. Open `tree-widget-dynamic.html`
2. Locate the `TREE_WIDGET_CONFIG` object (around line 165)
3. Update the `widgetUrl` property:

```javascript
const TREE_WIDGET_CONFIG = {
  widgetUrl: 'https://www.plant-for-the-planet.org/treecounter/YOUR_PROFILE_NAME',
  containerId: 'tree-counter',
  width: '100%',
  height: '300px',
  borderRadius: '8px',
  frameBorder: '0',
  scrolling: 'no',
  loading: 'lazy'
};
```

### 3.3 Advanced Usage

The dynamic loader provides additional functionality:

#### Manual Reload
```javascript
// Reload the widget from browser console
window.reloadTreeWidget();
```

#### Conditional Loading
```javascript
// Load widget based on user action
document.getElementById('load-button').addEventListener('click', () => {
  loadTreeWidget();
});
```

#### Integration with Analytics
```javascript
// Track widget loads
async function loadTreeWidget() {
  // ... existing code ...
  
  // Add analytics tracking
  if (typeof gtag !== 'undefined') {
    gtag('event', 'widget_load', {
      'event_category': 'Tree Counter',
      'event_label': 'Widget Loaded'
    });
  }
}
```

---

## Step 4: React/Vue Framework Integration

### 4.1 React Integration

#### File Location
Use the provided `components/TreeCounter.jsx` file.

#### Basic Usage

```jsx
import TreeCounter from './components/TreeCounter';

function App() {
  return (
    <div>
      <TreeCounter 
        widgetUrl="https://www.plant-for-the-planet.org/treecounter/YOUR_PROFILE_NAME"
        width={400}
        height={300}
        borderRadius="8px"
      />
    </div>
  );
}
```

#### Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `widgetUrl` | string | `'YOUR_WIDGET_URL'` | Your widget URL from Plant-for-the-Planet |
| `width` | number | `400` | Width of the widget container in pixels |
| `height` | number | `300` | Height of the widget iframe in pixels |
| `borderRadius` | string | `'8px'` | Border radius for rounded corners |
| `className` | string | `''` | Optional custom CSS class name |
| `showInfo` | boolean | `true` | Show/hide the information section |

#### Advanced React Example

```jsx
import { useState } from 'react';
import TreeCounter from './components/TreeCounter';

function TreeCounterPage() {
  const [showWidget, setShowWidget] = useState(true);
  
  return (
    <div className="container">
      <button onClick={() => setShowWidget(!showWidget)}>
        Toggle Widget
      </button>
      
      {showWidget && (
        <TreeCounter 
          widgetUrl="https://www.plant-for-the-planet.org/treecounter/fruitful-global-planet"
          width={500}
          height={350}
          className="my-custom-class"
          showInfo={true}
        />
      )}
    </div>
  );
}
```

#### TypeScript Usage

For TypeScript projects, rename the file to `TreeCounter.tsx` and use:

```tsx
import TreeCounter from './components/TreeCounter';

interface PageProps {
  profileName: string;
}

const TreePage: React.FC<PageProps> = ({ profileName }) => {
  const widgetUrl = `https://www.plant-for-the-planet.org/treecounter/${profileName}`;
  
  return (
    <TreeCounter 
      widgetUrl={widgetUrl}
      width={400}
      height={300}
    />
  );
};
```

### 4.2 Vue Integration

For Vue.js applications:

```vue
<template>
  <div class="tree-counter-wrapper">
    <div :style="containerStyle">
      <h2>🌳 Tree Counter Widget</h2>
      <div :style="widgetStyle">
        <iframe
          :src="widgetUrl"
          title="Plant for the Planet Tree Counter"
          width="100%"
          :height="height"
          frameborder="0"
          scrolling="no"
          loading="lazy"
          allow="encrypted-media"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeCounter',
  props: {
    widgetUrl: {
      type: String,
      default: 'YOUR_WIDGET_URL'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 300
    },
    borderRadius: {
      type: String,
      default: '8px'
    }
  },
  computed: {
    containerStyle() {
      return {
        maxWidth: `${this.width}px`,
        margin: '0 auto'
      };
    },
    widgetStyle() {
      return {
        width: '100%',
        height: `${this.height}px`,
        borderRadius: this.borderRadius,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      };
    }
  }
};
</script>
```

---

## Step 5: Deployment Instructions

### 5.1 Fruitful Global Planet Main Site

1. **Choose Implementation Method**:
   - For static pages: Use HTML embed
   - For React components: Use TreeCounter.jsx
   - For dynamic pages: Use JavaScript loader

2. **Add to Navigation**:
   - Update site navigation to include "Tree Counter" link
   - Add to footer environmental initiatives section
   - Include in "About Us" or "Sustainability" pages

3. **Integration Points**:
   ```
   Recommended pages:
   - Homepage (hero section or footer)
   - /sustainability
   - /about
   - /impact
   - /environmental-initiatives
   ```

### 5.2 Associated HSOMNI9000 Ecosystem Sites

The tree counter can be integrated across all ecosystem sites:

#### SamFox (Creative Studio)
- Add to portfolio page showcasing environmental work
- Include in "Values" or "Mission" section

#### Banimal (Charitable Toys)
- Display on product pages to show environmental impact
- Add to checkout page to show trees planted per purchase

#### VaultMesh (Trading Platform)
- Include in corporate responsibility section
- Add to user dashboard for transparency

#### HotStack (Code Hosting)
- Display on landing page
- Add to developer resources section

#### SecureSign (Legal Platform)
- Include in about/mission pages
- Add to sustainability reports

#### OmniGrid/FAA.Zone (Infrastructure)
- Display in system status dashboard
- Add to environmental monitoring section

#### BuildNest (Construction)
- Feature prominently on homepage
- Include in project showcase pages

### 5.3 Deployment Checklist

- [ ] Widget URL configured and tested
- [ ] Responsive design verified on mobile devices
- [ ] Cross-browser compatibility tested (Chrome, Firefox, Safari, Edge)
- [ ] Page load time impact assessed
- [ ] Analytics tracking configured (optional)
- [ ] Fallback messaging implemented for failed loads
- [ ] Security headers verified (CSP, iframe policies)
- [ ] Accessibility features tested (screen readers, keyboard navigation)
- [ ] SEO impact reviewed
- [ ] Documentation updated for team members

---

## Troubleshooting

### Issue: Widget Not Loading

**Possible Causes & Solutions:**

1. **Incorrect URL**
   - Verify the widget URL is correct
   - Ensure there are no typos
   - Check that the URL starts with `https://`

2. **Network Issues**
   - Check internet connectivity
   - Verify firewall settings allow iframe embeds
   - Test in incognito/private mode

3. **Content Security Policy (CSP)**
   - Add Plant-for-the-Planet domains to CSP:
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="frame-src 'self' https://www.plant-for-the-planet.org https://widgets.plant-for-the-planet.org;">
   ```

4. **Browser Extensions**
   - Disable ad blockers temporarily
   - Test in different browser
   - Clear browser cache and cookies

### Issue: Widget Appears Broken or Misaligned

**Solutions:**

1. **Check Container Dimensions**
   ```css
   .widget-wrapper {
     width: 100%;
     max-width: 400px;
     height: 300px;
     overflow: hidden;
   }
   ```

2. **Ensure Iframe Responsive**
   ```html
   <iframe 
     style="width: 100%; height: 100%; border: none;"
     ...
   />
   ```

3. **Verify Parent Container**
   - Parent must have defined width
   - Check for CSS conflicts
   - Inspect element in browser DevTools

### Issue: Widget Shows Old Data

**Solutions:**

1. **Force Refresh**
   - The widget auto-updates every few minutes
   - Force browser refresh (Ctrl+F5 or Cmd+Shift+R)
   - Clear browser cache

2. **Check Widget URL**
   - Ensure URL is pointing to correct profile
   - Verify profile has recent tree planting data

### Issue: Placeholder "YOUR_WIDGET_URL" Still Visible

**Solution:**
- You haven't replaced the placeholder URL
- Follow Step 1 to get your actual widget URL
- Replace all instances of `YOUR_WIDGET_URL` with your real URL

---

## Best Practices

### Performance Optimization

1. **Lazy Loading**
   ```html
   <iframe loading="lazy" .../>
   ```
   - Delays loading until widget is near viewport
   - Improves initial page load time

2. **Async Script Loading**
   ```javascript
   // For dynamic loader
   async function loadTreeWidget() {
     // Widget loads asynchronously
   }
   ```

3. **Caching**
   - Widget content is cached by Plant-for-the-Planet
   - No additional caching needed on your end

### Security Best Practices

1. **Use HTTPS**
   - Always use `https://` URLs
   - Ensures encrypted data transmission

2. **Minimal Iframe Permissions**
   - All implementations use `allow="encrypted-media"` only
   - This is the minimal permission set required for the tree counter widget
   - Unnecessary permissions removed: autoplay, clipboard-write, accelerometer, gyroscope, picture-in-picture
   - Reduces security attack surface while maintaining full functionality
   ```html
   <iframe 
     allow="encrypted-media"
     ...
   />
   ```

3. **Iframe Sandbox** (Optional)
   ```html
   <iframe 
     sandbox="allow-scripts allow-same-origin"
     ...
   />
   ```

4. **Referrer Policy**
   ```html
   <iframe 
     referrerpolicy="no-referrer-when-downgrade"
     ...
   />
   ```

### Accessibility

1. **Provide Alt Context**
   ```html
   <iframe 
     title="Plant for the Planet Tree Counter showing current tree planting progress"
     ...
   />
   ```

2. **Keyboard Navigation**
   - Ensure iframe is keyboard accessible
   - Test with Tab key navigation

3. **Screen Reader Support**
   ```html
   <div role="region" aria-label="Tree Counter Widget">
     <iframe .../>
   </div>
   ```

### Responsive Design

1. **Mobile-First Approach**
   ```css
   /* Mobile styles */
   .widget-wrapper {
     max-width: 100%;
     padding: 10px;
   }
   
   /* Desktop styles */
   @media (min-width: 768px) {
     .widget-wrapper {
       max-width: 400px;
       padding: 20px;
     }
   }
   ```

2. **Flexible Heights**
   ```css
   .widget-wrapper {
     height: auto;
     min-height: 300px;
   }
   ```

3. **Touch-Friendly**
   - Ensure adequate spacing around widget
   - Test on mobile devices
   - Verify pinch-to-zoom functionality

### Monitoring & Analytics

1. **Track Widget Performance**
   ```javascript
   // Track load time
   const startTime = performance.now();
   await loadTreeWidget();
   const loadTime = performance.now() - startTime;
   console.log(`Widget loaded in ${loadTime}ms`);
   ```

2. **Error Tracking**
   ```javascript
   window.addEventListener('error', (e) => {
     if (e.target.tagName === 'IFRAME') {
       console.error('Widget iframe error:', e);
       // Send to error tracking service
     }
   });
   ```

3. **User Engagement**
   ```javascript
   // Track user interactions
   iframe.addEventListener('load', () => {
     analytics.track('Widget Viewed', {
       page: window.location.pathname,
       timestamp: new Date().toISOString()
     });
   });
   ```

---

## Additional Resources

### Official Links

- **Widget Creation**: [widgets.plant-for-the-planet.org](https://widgets.plant-for-the-planet.org)
- **Main Website**: [plant-for-the-planet.org](https://www.plant-for-the-planet.org)
- **Documentation**: [plant-for-the-planet.org/docs](https://www.plant-for-the-planet.org/docs)
- **Support**: [support@plant-for-the-planet.org](mailto:support@plant-for-the-planet.org)

### Fruitful Global Planet Resources

- **Main Site**: [fruitfulglobalplanet.com](https://fruitfulglobalplanet.com)
- **GitHub Repository**: [github.com/Fruitful-Global-Planet](https://github.com/Fruitful-Global-Planet)
- **Internal Documentation**: See `/docs` directory
- **Support**: [support@fruitfulplanet.com](mailto:support@fruitfulplanet.com)

### Notes on Real-Time Updates

The widget automatically refreshes tree count data:
- **Update Frequency**: Every 3-5 minutes
- **Data Source**: Plant-for-the-Planet global database
- **Accuracy**: Updates may have slight delays during high traffic
- **Cache Duration**: Widget content cached for 2 minutes

### Integration with Planetary Health Tracking

The tree counter integrates with Fruitful Global Planet's broader environmental monitoring:

1. **ScrollBinder Protocol Compatibility**
   - Widget updates align with 3-second sync intervals
   - Data feeds into global sync indicator
   - Supports real-time planetary health dashboard

2. **Cross-Platform Synchronization**
   - Tree count data available via API
   - Syncs with all HSOMNI9000 ecosystem apps
   - Supports "water the seed 24/7" mission

3. **Seedwave Integration**
   - Tree counter data included in Seedwave reports
   - Environmental impact metrics aggregated
   - Supports continuous data seeding paradigm

---

## Conclusion

This comprehensive guide provides everything needed to integrate the Plant-for-the-Planet tree counter widget into Fruitful Global Planet sites. Choose the implementation method that best suits your technical stack and follow the step-by-step instructions.

For additional support or questions, contact the development team or reach out to Plant-for-the-Planet support.

**Remember**: Replace `YOUR_WIDGET_URL` with your actual widget URL before deployment!

---

## Version History

- **v1.0.0** (2024-12-09): Initial documentation
  - HTML static embed implementation
  - JavaScript dynamic loader
  - React component with TypeScript support
  - Comprehensive deployment instructions
  - Troubleshooting guide
  - Best practices and security guidelines

---

## License

This documentation is part of the Fruitful Global Planet project.
Widget provided by Plant-for-the-Planet Foundation.

For questions or contributions, please open an issue in the GitHub repository.
