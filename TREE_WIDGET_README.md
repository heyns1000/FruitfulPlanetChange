# Tree Counter Widget Integration - Quick Reference

This README provides a quick overview of the tree counter widget integration files and how to use them.

## 📁 Files Created

### 1. Static HTML Implementation

**File:** `tree-widget.html`  
**Purpose:** Standalone HTML page with iframe embed  
**Best for:** Static websites, WordPress, basic HTML sites

### 2. JavaScript Dynamic Loader

**File:** `tree-widget-dynamic.html`  
**Purpose:** Dynamic iframe creation with JavaScript  
**Best for:** SPAs, dynamic loading scenarios, programmatic control

### 3. React Component

**File:** `components/TreeCounter.jsx`  
**Purpose:** Reusable React component  
**Best for:** React applications, TypeScript projects, modern frameworks

### 4. Example Integration Page

**File:** `client/src/pages/environmental-impact.tsx`  
**Purpose:** Full-page example showing React component usage  
**Best for:** Reference implementation, integration testing

### 5. Complete Setup Documentation

**File:** `docs/TREE_WIDGET_SETUP.md`  
**Purpose:** Comprehensive setup guide  
**Contains:** Step-by-step instructions, troubleshooting, best practices

## 🚀 Quick Start

### For Static Sites

1. Open `tree-widget.html`
2. Replace `YOUR_WIDGET_URL` with your actual widget URL
3. Upload to your web server or use the iframe code directly

```html
<iframe
  src="https://www.plant-for-the-planet.org/treecounter/YOUR_PROFILE_NAME"
  width="100%"
  height="300"
  style="border: none;"
></iframe>
```

### For React Projects

1. Copy `components/TreeCounter.jsx` to your components directory
2. Import and use in your page:

```jsx
import TreeCounter from './components/TreeCounter';

function MyPage() {
  return (
    <TreeCounter
      widgetUrl="https://www.plant-for-the-planet.org/treecounter/YOUR_PROFILE_NAME"
      width={400}
      height={300}
    />
  );
}
```

### For Dynamic JavaScript

1. Open `tree-widget-dynamic.html`
2. Update the `TREE_WIDGET_CONFIG` object:

```javascript
const TREE_WIDGET_CONFIG = {
  widgetUrl: 'https://www.plant-for-the-planet.org/treecounter/YOUR_PROFILE_NAME',
  // ... other options
};
```

## 📖 Getting Your Widget URL

1. Visit [widgets.plant-for-the-planet.org](https://widgets.plant-for-the-planet.org)
2. Sign up or log in
3. Go to **Settings** → **Create Widget**
4. Select **Tree Counter** widget type
5. Enter your profile URL and customize
6. Copy the generated iframe URL

**Format:** `https://www.plant-for-the-planet.org/treecounter/YOUR_PROFILE_NAME`

## 🔧 Configuration Options

### React Component Props

| Prop           | Type    | Default             | Description               |
| -------------- | ------- | ------------------- | ------------------------- |
| `widgetUrl`    | string  | `'YOUR_WIDGET_URL'` | Your widget URL           |
| `width`        | number  | `400`               | Container width in pixels |
| `height`       | number  | `300`               | Iframe height in pixels   |
| `borderRadius` | string  | `'8px'`             | Border radius             |
| `className`    | string  | `''`                | Custom CSS class          |
| `showInfo`     | boolean | `true`              | Show info section         |

### JavaScript Config Object

```javascript
const TREE_WIDGET_CONFIG = {
  widgetUrl: 'YOUR_WIDGET_URL', // Required
  containerId: 'tree-counter', // Container div ID
  width: '100%', // Width
  height: '300px', // Height
  borderRadius: '8px', // Border radius
  scrolling: 'no', // Scrolling
  loading: 'lazy', // Loading strategy
  // Note: Border styling applied via CSS (border: 'none')
};
```

## ✅ Implementation Checklist

Before deploying, verify:

- [ ] Widget URL replaced (not `YOUR_WIDGET_URL`)
- [ ] Dimensions set appropriately for your design
- [ ] Tested on mobile devices
- [ ] Cross-browser compatibility verified (Chrome, Firefox, Safari, Edge)
- [ ] Page load time impact assessed
- [ ] Fallback messaging in place for errors
- [ ] Accessibility tested (screen readers, keyboard navigation)
- [ ] Analytics tracking configured (if needed)

## 🎨 Styling Customization

### HTML/CSS Approach

```css
.widget-wrapper {
  max-width: 400px; /* Adjust width */
  height: 300px; /* Adjust height */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Shadow */
}
```

### React Inline Styles

```jsx
<TreeCounter widgetUrl={url} width={500} height={350} borderRadius="12px" />
```

### JavaScript Dynamic Styling

```javascript
iframe.style.width = '100%';
iframe.style.height = '300px';
iframe.style.borderRadius = '8px';
```

## 🐛 Troubleshooting

### Widget Not Loading

1. **Check the URL:** Ensure it's correct and starts with `https://`
2. **Check CSP:** Add Plant-for-the-Planet domains to Content Security Policy
3. **Disable ad blockers:** Test in incognito/private mode
4. **Check console:** Look for errors in browser DevTools

### Widget Appears Broken

1. **Check container dimensions:** Ensure parent has defined width
2. **Verify iframe responsive:** Use `width: 100%`
3. **Inspect element:** Use browser DevTools to check styles

### Shows Placeholder Text

- You haven't replaced `YOUR_WIDGET_URL` with your actual URL
- See setup documentation for how to get your widget URL

## 🌍 Integration Across HSOMNI9000 Ecosystem

The tree counter can be integrated into all ecosystem apps:

- **SamFox** (Creative Studio) - Portfolio showcase
- **Banimal** (Charitable Toys) - Product impact tracking
- **VaultMesh** (Trading) - Corporate responsibility
- **HotStack** (Code Hosting) - Developer resources
- **SecureSign** (Legal) - Sustainability reports
- **OmniGrid/FAA.Zone** (Infrastructure) - System monitoring
- **BuildNest** (Construction) - Green building initiatives

## 📚 Documentation

For complete setup instructions, troubleshooting, and best practices, see:

- **[TREE_WIDGET_SETUP.md](docs/TREE_WIDGET_SETUP.md)** - Comprehensive guide

## 🔗 Resources

- **Widget Creation:** [widgets.plant-for-the-planet.org](https://widgets.plant-for-the-planet.org)
- **Plant-for-the-Planet:** [plant-for-the-planet.org](https://www.plant-for-the-planet.org)
- **Support:** [support@plant-for-the-planet.org](mailto:support@plant-for-the-planet.org)

## 📝 Notes

- Widget auto-updates every 3-5 minutes
- Data cached for 2 minutes by Plant-for-the-Planet
- HTTPS required for security
- Lazy loading recommended for performance
- Mobile-responsive by default

## 🤝 Contributing

To improve the widget integration:

1. Test on different devices and browsers
2. Report issues or bugs
3. Suggest improvements to documentation
4. Share integration examples

## 📄 License

Widget provided by Plant-for-the-Planet Foundation.
Integration code is part of the Fruitful Global Planet project (MIT License).

---

**Last Updated:** December 9, 2024  
**Version:** 1.0.0

For questions or support, contact the Fruitful Global Planet development team.
