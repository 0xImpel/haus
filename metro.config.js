const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add `.cjs` to supported source extensions
defaultConfig.resolver.sourceExts.push('cjs');

// Prevent Firebase export resolution issues
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
