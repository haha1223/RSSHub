// 必须用 import，不能用 require
import app from '../../app.js';
import init from '../../lib/init.js';

export const handler = async (event, context) => {
  try {
    // 初始化 RSSHub
    if (!app._router) {
      await init();
    }

    return new Promise((resolve) => {
      app(
        {
          method: event.httpMethod,
          path: event.path,
          headers: event.headers,
          query: event.queryStringParameters,
          body: event.body,
        },
        {
          send: (body) => {
            resolve({
              statusCode: 200,
              headers: {
                'Content-Type': 'application/xml; charset=utf-8',
              },
              body,
            });
          },
        }
      );
    });
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};
