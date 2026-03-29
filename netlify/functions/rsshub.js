const express = require('express');
const { createServer } = require('http');
const app = require('../../app.js');

// 适配 Netlify Function 运行时
module.exports.handler = async (event, context) => {
  // 确保不重复初始化
  if (!app._router) {
    await require('../../lib/init')();
  }

  // 把 Netlify 请求转成 Express 处理
  return new Promise((resolve) => {
    const server = createServer(app);

    // 模拟 HTTP 请求
    server.emit('request', {
      method: event.httpMethod,
      url: event.path,
      headers: event.headers,
      query: event.queryStringParameters,
      body: event.body,
    }, {
      statusCode: 200,
      setHeader: (name, value) => {
        context.res.setHeader(name, value);
      },
      end: (body) => {
        resolve({
          statusCode: context.res.statusCode,
          headers: context.res.headers,
          body,
        });
        server.close();
      },
    });
  });
};
