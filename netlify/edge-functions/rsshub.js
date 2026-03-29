// 官方标准 RSSHub Netlify 适配器
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const rsshub = require('../../app.js');

export default async (req, context) => {
  return new Promise((resolve) => {
    const res = {
      writeHead: (status, headers) => {
        res.status = status;
        res.headers = headers;
      },
      end: (body) => {
        resolve(new Response(body, {
          status: res.status || 200,
          headers: res.headers || {}
        }));
      }
    };

    rsshub(req, res);
  });
};

export const config = {
  path: "/*"
};
