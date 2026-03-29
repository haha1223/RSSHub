import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// 加载 RSSHub 主程序
const app = require('../../app.js');

// 纯原生适配 Netlify Function，不依赖任何包
export const handler = async (event, context) => {
    return new Promise((resolve, reject) => {
        const req = {
            method: event.httpMethod,
            url: event.path,
            headers: event.headers,
            query: event.queryStringParameters,
            body: event.body,
        };

        const res = {
            statusCode: 200,
            headers: {},
            end: (body) => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: body,
                });
            },
            setHeader: (name, value) => {
                res.headers[name] = value;
            },
            send: (body) => res.end(body),
            json: (obj) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(obj));
            },
        };

        try {
            app(req, res);
        } catch (err) {
            resolve({
                statusCode: 500,
                body: 'RSSHub 启动失败：' + err.message,
            });
        }
    });
};
