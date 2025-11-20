# CDN Integration Guide

## Overview

Content Delivery Network (CDN) integration for FruitfulPlanet to deliver static assets globally with low latency.

## Supported CDN Providers

### CloudFlare

**Recommended for**: Global coverage, DDoS protection, free tier

**Setup:**
1. Sign up at [CloudFlare](https://cloudflare.com)
2. Add your domain
3. Update nameservers
4. Configure caching rules

**Configuration:**
```javascript
// Cache rules
{
  "rules": [
    {
      "match": "*.js",
      "cache_ttl": 604800,  // 7 days
      "browser_ttl": 604800
    },
    {
      "match": "*.css",
      "cache_ttl": 604800,
      "browser_ttl": 604800
    },
    {
      "match": "*.png|*.jpg|*.jpeg|*.gif|*.svg",
      "cache_ttl": 2592000,  // 30 days
      "browser_ttl": 2592000
    }
  ]
}
```

### AWS CloudFront

**Recommended for**: AWS infrastructure, advanced controls

**Setup:**
```bash
# Install AWS CLI
aws cloudfront create-distribution \
  --origin-domain-name app.example.com \
  --default-root-object index.html
```

**Configuration:**
```yaml
Distribution:
  Origins:
    - DomainName: app.example.com
      Id: AppOrigin
      CustomOriginConfig:
        HTTPPort: 80
        HTTPSPort: 443
        OriginProtocolPolicy: https-only
  DefaultCacheBehavior:
    TargetOriginId: AppOrigin
    ViewerProtocolPolicy: redirect-to-https
    CachePolicyId: 658327ea-f89d-4fab-a63d-7e88639e58f6  # Managed-CachingOptimized
```

### Cloudinary

**Recommended for**: Image optimization and transformation

**Setup:**
```javascript
// Install Cloudinary SDK
npm install cloudinary

// Configuration
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
```

## Cache Control Headers

### Application Configuration

```typescript
// server/middleware/cache-control.ts
import { Request, Response, NextFunction } from 'express';

export function cacheControlMiddleware(req: Request, res: Response, next: NextFunction) {
  const path = req.path;

  if (path.match(/\.(js|css)$/)) {
    // JavaScript and CSS files - cache for 7 days
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
  } else if (path.match(/\.(jpg|jpeg|png|gif|svg|ico|webp)$/)) {
    // Images - cache for 30 days
    res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
  } else if (path.match(/\.(woff|woff2|ttf|eot)$/)) {
    // Fonts - cache for 1 year
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (path.startsWith('/api/')) {
    // API responses - no cache by default
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  } else {
    // HTML pages - cache for 1 hour
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }

  next();
}
```

## Asset Optimization

### Build Configuration

Update Vite configuration for optimal asset handling:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
        },
      },
    },
    // Asset file names
    assetFileNames: 'assets/[name].[hash].[ext]',
    chunkFileNames: 'chunks/[name].[hash].js',
    entryFileNames: 'entries/[name].[hash].js',
  },
});
```

### Image Optimization

Use responsive images and modern formats:

```typescript
// Image optimization utility
export function getOptimizedImageUrl(
  src: string,
  options: {
    width?: number;
    height?: number;
    format?: 'webp' | 'avif' | 'jpg';
    quality?: number;
  }
): string {
  // CloudFlare images
  const params = new URLSearchParams({
    width: options.width?.toString() || 'auto',
    format: options.format || 'auto',
    quality: options.quality?.toString() || '85',
  });
  
  return `https://imagecdn.example.com/cdn-cgi/image/${params}/${src}`;
}
```

## CDN Deployment Workflow

### 1. Build Assets

```bash
npm run build
```

### 2. Upload to CDN

**Using AWS S3 + CloudFront:**
```bash
# Upload to S3
aws s3 sync dist/ s3://fruitfulplanet-assets/ \
  --exclude "*.html" \
  --cache-control "max-age=31536000,public,immutable"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id EDFDVBD6EXAMPLE \
  --paths "/*"
```

**Using CloudFlare:**
```bash
# Upload via API
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

## Cache Invalidation

### Manual Invalidation

```bash
# CloudFlare
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {token}" \
  --data '{"files":["https://example.com/styles.css"]}'

# AWS CloudFront
aws cloudfront create-invalidation \
  --distribution-id EDFDVBD6EXAMPLE \
  --paths "/styles.css" "/scripts/*.js"
```

### Automatic Invalidation

Integrate cache invalidation into CI/CD:

```yaml
# .github/workflows/deploy.yml
- name: Invalidate CDN Cache
  run: |
    curl -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CF_ZONE_ID }}/purge_cache" \
      -H "Authorization: Bearer ${{ secrets.CF_API_TOKEN }}" \
      --data '{"purge_everything":true}'
```

## Performance Monitoring

### Monitor CDN Performance

```javascript
// Add CDN performance tracking
if (performance.getEntriesByType) {
  const resources = performance.getEntriesByType('resource');
  resources.forEach((resource) => {
    if (resource.name.includes('cdn.example.com')) {
      console.log('CDN Asset:', {
        name: resource.name,
        duration: resource.duration,
        transferSize: resource.transferSize,
      });
    }
  });
}
```

### CDN Cache Hit Rates

Monitor cache hit rates in CDN dashboard:
- **Cache Hit Rate**: Should be > 80%
- **Bandwidth Saved**: Track savings
- **Response Time**: P50, P95, P99

## Security

### Secure CDN Configuration

1. **Enable HTTPS Only**
   ```javascript
   {
     "ssl": "full",
     "always_use_https": true,
     "min_tls_version": "1.2"
   }
   ```

2. **Hotlink Protection**
   ```javascript
   {
     "hotlink_protection": true,
     "allowed_referers": ["example.com", "*.example.com"]
   }
   ```

3. **Rate Limiting**
   ```javascript
   {
     "rate_limiting": {
       "requests_per_minute": 300,
       "burst": 100
     }
   }
   ```

## Best Practices

1. **Version Static Assets**: Use content hashing in filenames
2. **Compress Assets**: Gzip/Brotli compression
3. **Use HTTP/2**: Enable HTTP/2 push for critical resources
4. **Implement CSP**: Content Security Policy headers
5. **Monitor Performance**: Regular performance audits
6. **Set Appropriate TTLs**: Balance freshness vs. cache hits
7. **Use CDN for All Static Assets**: Including fonts, images, JS, CSS
8. **Implement Purge Strategy**: Clear cache on deployments

## Troubleshooting

### Cache Not Working

1. Check cache headers: `curl -I https://example.com/asset.js`
2. Verify CDN configuration
3. Check for `no-cache` headers

### Stale Content

1. Purge CDN cache
2. Check TTL settings
3. Verify versioning strategy

### Performance Issues

1. Check cache hit rate
2. Monitor origin requests
3. Optimize asset sizes
4. Enable compression

## Cost Optimization

1. **Minimize Origin Requests**: High cache hit rates
2. **Optimize Asset Sizes**: Compression and minification
3. **Use Appropriate TTLs**: Longer TTLs = fewer requests
4. **Monitor Bandwidth**: Track and optimize high-usage assets
5. **Use Free Tiers**: CloudFlare offers generous free tier

## Resources

- [CloudFlare Documentation](https://developers.cloudflare.com/)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Web Performance Best Practices](https://web.dev/fast/)
