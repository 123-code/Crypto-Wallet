import 'react-native-get-random-values';
import { Buffer } from 'buffer';

// Make Buffer globally available
global.Buffer = Buffer;

// Add stream polyfills before anything else
const Stream = require('stream-browserify');
global.stream = Stream;

// Add events polyfill
const EventEmitter = require('events');
global.events = EventEmitter;

// Add process polyfill
if (typeof global.process === 'undefined') {
  global.process = { 
    env: {},
    nextTick: (fn) => setTimeout(fn, 0),
    version: 'v16.0.0',
    platform: 'browser',
    browser: true,
  };
}

// Add global polyfill if it doesn't exist
if (typeof global.global === 'undefined') {
  global.global = global;
}

// Add TextEncoder/TextDecoder polyfills if they don't exist
if (typeof global.TextEncoder === 'undefined') {
  try {
    const { TextEncoder, TextDecoder } = require('util');
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
  } catch (e) {
    // Fallback for older React Native versions
    global.TextEncoder = class TextEncoder {
      encode(str) {
        const utf8 = [];
        for (let i = 0; i < str.length; i++) {
          let charcode = str.charCodeAt(i);
          if (charcode < 0x80) utf8.push(charcode);
          else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
          } else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
          } else {
            i++;
            charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
          }
        }
        return new Uint8Array(utf8);
      }
    };
  }
}

// Add crypto.getRandomValues if it doesn't exist
if (typeof global.crypto === 'undefined') {
  global.crypto = {};
}

if (typeof global.crypto.getRandomValues === 'undefined') {
  global.crypto.getRandomValues = (array) => {
    const bytes = require('react-native-get-random-values').getRandomValues(array);
    return bytes;
  };
}

// Add module polyfills to global scope
global.require = global.require || require; 