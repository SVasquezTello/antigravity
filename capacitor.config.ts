import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.antigravity.app',
  appName: 'Antigravity',
  webDir: 'out',
  server: {
    url: 'https://antigravity-ia.com',
    allowNavigation: ['antigravity-ia.com', '*.antigravity-ia.com']
  }
};

export default config;
