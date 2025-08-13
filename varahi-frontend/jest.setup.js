// jest.setup.js
require('@testing-library/jest-dom');
import { TextEncoder, TextDecoder } from "util";
import 'whatwg-fetch';
// Fix: polyfill for Node environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;