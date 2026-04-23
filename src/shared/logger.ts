const logger = {
  info: (message: string) => {
    console.log(`[INFO] ℹ️  ${new Date().toLocaleString()}: ${message}`);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ❌ ${new Date().toLocaleString()}: ${message}`, error || '');
  },
  warn: (message: string) => {
    console.warn(`[WARN] ⚠️  ${new Date().toLocaleString()}: ${message}`);
  },
};

export default logger;