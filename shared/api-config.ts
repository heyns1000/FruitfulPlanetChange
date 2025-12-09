// Global API Configuration for Seedwave™ Portal powered by VaultMesh™
// This file centralizes all API keys and configurations extracted from legal documentation

import { createLogger } from '../server/middleware/logging';

const logger = createLogger('api-config');

export interface APIConfiguration {
  paypal: {
    clientId: string
    clientSecret: string
    environment: 'sandbox' | 'production'
    currency: string
  }
  firebase: {
    apiKey: string
    authDomain: string
    projectId: string
    storageBucket: string
    messagingSenderId: string
    appId: string
    measurementId: string
  }
  spotify: {
    clientId: string
    clientSecret: string
    redirectUri: string
  }
  xero: {
    clientId: string
    clientSecret: string
    scopes: string[]
    redirectUri: string
  }
  database: {
    url: string
    host: string
    port: string
    user: string
    password: string
  }
  session: {
    secret: string
  }
}

// Environment-based configuration
export const getAPIConfig = (): APIConfiguration => {
  const isProduction = process.env.NODE_ENV === 'production'
  
  // Validate required environment variables
  if (!process.env.PAYPAL_CLIENT_ID) {
    logger.warn('PAYPAL_CLIENT_ID not configured');
  }
  if (!process.env.VITE_FIREBASE_API_KEY) {
    logger.warn('VITE_FIREBASE_API_KEY not configured');
  }
  
  return {
    paypal: {
      clientId: process.env.PAYPAL_CLIENT_ID || '',
      clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
      environment: isProduction ? 'production' : 'sandbox',
      currency: 'USD'
    },
    firebase: {
      apiKey: process.env.VITE_FIREBASE_API_KEY || '',
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.VITE_FIREBASE_APP_ID || '',
      measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || ''
    },
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID || '',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
      redirectUri: process.env.SPOTIFY_REDIRECT_URI || `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/auth/spotify/callback`
    },
    xero: {
      clientId: process.env.XERO_CLIENT_ID || '',
      clientSecret: process.env.XERO_CLIENT_SECRET || '',
      scopes: ['accounting.transactions', 'accounting.contacts', 'accounting.settings'],
      redirectUri: process.env.XERO_REDIRECT_URI || `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/auth/xero/callback`
    },
    database: {
      url: process.env.DATABASE_URL || '',
      host: process.env.PGHOST || '',
      port: process.env.PGPORT || '',
      user: process.env.PGUSER || '',
      password: process.env.PGPASSWORD || ''
    },
    session: {
      secret: process.env.SESSION_SECRET || ''
    }
  }
}

// Client-side configuration (only public keys)
export const getClientConfig = () => {
  const config = getAPIConfig()
  return {
    firebase: config.firebase,
    paypal: {
      clientId: config.paypal.clientId,
      environment: config.paypal.environment,
      currency: config.paypal.currency
    }
  }
}

// Service status checker
export const checkServiceHealth = async () => {
  const config = getAPIConfig()
  const services = []
  
  // Check PayPal
  if (config.paypal.clientId && config.paypal.clientSecret) {
    services.push({ name: 'PayPal', status: 'connected', type: 'payment' })
  } else {
    services.push({ name: 'PayPal', status: 'disconnected', type: 'payment' })
  }
  
  // Check Firebase
  if (config.firebase.apiKey && config.firebase.projectId) {
    services.push({ name: 'Firebase', status: 'connected', type: 'auth' })
  } else {
    services.push({ name: 'Firebase', status: 'disconnected', type: 'auth' })
  }
  
  // Check Spotify
  if (config.spotify.clientId && config.spotify.clientSecret) {
    services.push({ name: 'Spotify', status: 'connected', type: 'music' })
  } else {
    services.push({ name: 'Spotify', status: 'disconnected', type: 'music' })
  }
  
  // Check Xero
  if (config.xero.clientId && config.xero.clientSecret) {
    services.push({ name: 'Xero', status: 'connected', type: 'accounting' })
  } else {
    services.push({ name: 'Xero', status: 'disconnected', type: 'accounting' })
  }
  
  // Check Database
  if (config.database.url) {
    services.push({ name: 'PostgreSQL', status: 'connected', type: 'database' })
  } else {
    services.push({ name: 'PostgreSQL', status: 'disconnected', type: 'database' })
  }
  
  return services
}