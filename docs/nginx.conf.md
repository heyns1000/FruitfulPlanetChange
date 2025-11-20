# NGINX Configuration for FruitfulPlanet

## Load Balancer Configuration

```nginx
upstream fruitfulplanet_backend {
    # Load balancing method: least_conn, ip_hash, or round_robin (default)
    least_conn;
    
    # Backend servers
    server app1.example.com:5000 weight=3 max_fails=3 fail_timeout=30s;
    server app2.example.com:5000 weight=3 max_fails=3 fail_timeout=30s;
    server app3.example.com:5000 weight=3 max_fails=3 fail_timeout=30s;
    
    # Backup server
    server backup.example.com:5000 backup;
    
    # Health check
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name fruitfulplanet.example.com www.fruitfulplanet.example.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name fruitfulplanet.example.com www.fruitfulplanet.example.com;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/fruitfulplanet.crt;
    ssl_certificate_key /etc/ssl/private/fruitfulplanet.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=general_limit:10m rate=50r/s;
    
    # Client body size limit
    client_max_body_size 10M;
    
    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
    
    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://fruitfulplanet_backend;
        proxy_cache_valid 200 7d;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
    
    # API routes with rate limiting
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        
        proxy_pass http://fruitfulplanet_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # WebSocket support
    location /ws {
        proxy_pass http://fruitfulplanet_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }
    
    # All other requests
    location / {
        limit_req zone=general_limit burst=100 nodelay;
        
        proxy_pass http://fruitfulplanet_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Health check endpoint (no rate limit)
    location /api/health {
        proxy_pass http://fruitfulplanet_backend;
        access_log off;
    }
    
    # Metrics endpoint (internal only)
    location /metrics {
        allow 10.0.0.0/8;
        deny all;
        proxy_pass http://fruitfulplanet_backend;
    }
}
```

## Session Affinity (Sticky Sessions)

If you need session affinity, use `ip_hash` or add a custom hash:

```nginx
upstream fruitfulplanet_backend {
    ip_hash;  # Route same IP to same backend
    # ... server configuration
}
```

## Active Health Checks (NGINX Plus)

```nginx
upstream fruitfulplanet_backend {
    zone backend 64k;
    
    server app1.example.com:5000;
    server app2.example.com:5000;
    server app3.example.com:5000;
}

server {
    # ... other configuration
    
    location @healthcheck {
        internal;
        proxy_pass http://fruitfulplanet_backend;
        proxy_connect_timeout 2s;
        proxy_read_timeout 2s;
        health_check interval=10s fails=3 passes=2 uri=/api/health/liveness;
    }
}
```

## Installation

1. Copy this configuration to `/etc/nginx/sites-available/fruitfulplanet`
2. Create symbolic link: `ln -s /etc/nginx/sites-available/fruitfulplanet /etc/nginx/sites-enabled/`
3. Test configuration: `nginx -t`
4. Reload NGINX: `systemctl reload nginx`

## Monitoring

View logs:
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

Monitor connections:
```bash
nginx -V  # Show version and configuration
```
