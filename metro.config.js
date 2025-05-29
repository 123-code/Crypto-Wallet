const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver aliases for Node.js polyfills
config.resolver.alias = {
  crypto: 'crypto-browserify',
  stream: 'stream-browserify',
  buffer: 'buffer',
  util: 'util',
  url: 'url',
  assert: 'assert',
  events: 'events',
  'readable-stream': 'readable-stream',
  'stream/promises': 'stream-browserify',
};

// Add fallbacks for Node.js modules
config.resolver.fallback = {
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer'),
  util: require.resolve('util'),
  url: require.resolve('url'),
  assert: require.resolve('assert'),
  events: require.resolve('events'),
  'readable-stream': require.resolve('readable-stream'),
  fs: false,
  path: false,
  os: false,
  net: false,
  tls: false,
  child_process: false,
  http: false,
  https: false,
  zlib: false,
};

// Exclude problematic files and WASM
config.resolver.blockList = [
  /.*\.wasm$/,
  /secp256k1\.wasm$/,
];

// Add transformer configuration
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = config; 