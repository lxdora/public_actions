/**
 * pushplus 推送
 */

const { push_plus_token } = require('./config');
const { request } = require('./http');

// 原先用 http://，pushplus 现已全面 https，http 会被拒绝或重定向
const PUSH_URL = 'https://www.pushplus.plus/send';

const wxPush = async (title, content) => {
  if (!push_plus_token) throw new Error('未配置 PUSH_PLUS_TOKEN');

  const body = {
    token: push_plus_token,
    title,
    content,
    template: 'txt'
  };

  const res = await request(PUSH_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    timeout: 20000
  });

  if (res.code !== 200) {
    throw new Error(`pushplus 返回异常：${res.msg || JSON.stringify(res)}`);
  }

  return res.data;
};

module.exports = wxPush;
