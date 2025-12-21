
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gtvassessor.ai',
  appName: 'GTV Assessor',
  webDir: 'dist', // 确保这与您的构建输出目录一致
  bundledWebRuntime: false,
  server: {
    // 允许 App 处理来自 https://gtvassessor.com 的深层链接
    allowNavigation: [
      'buy.stripe.com',
      'checkout.stripe.com'
    ],
    // iOS 系统下的点击回弹效果优化
    iosScheme: 'gtvassessor'
  },
  ios: {
    contentInset: 'always',
    allowsLinkPreview: true,
    backgroundColor: '#FDFDFD',
    // 隐藏状态栏文字以获得更纯净的沉浸感
    handleApplicationNotificationsWithPlugins: true
  },
  android: {
    backgroundColor: '#FDFDFD',
    allowMixedContent: true,
    captureInput: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0A0A0A',
      showSpinner: true,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    }
  }
};

export default config;
