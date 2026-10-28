/**
 * 钉钉机器人推送
 *
 * 旧版 dingPush 没有 return promise，外层 await / try-catch 完全捕获不到失败，
 * 错误被静默吞掉。这里补上 return，并去掉自带依赖 ding-bot-sdk，按官方加签协议自己实现。
 */

const crypto = require('crypto');

const { ding_token, ding_sign } = require('./config');
const { request } = require('./http');

const HOST = 'https://oapi.dingtalk.com/robot/send';

const dingPush = async (content) => {
  if (!ding_token) throw new Error('未配置 DING_TOKEN');

  const params = new URLSearchParams();
  params.set('access_token', ding_token);

  if (ding_sign) {
    const timestamp = Date.now();
    const sign = crypto
      .createHmac('sha256', ding_sign)
      .update(`${timestamp}\n${ding_sign}`)
      .digest('base64');
    params.set('timestamp', String(timestamp));
    params.set('sign', encodeURIComponent(sign));
  }

  const res = await request(`${HOST}?${params.toString()}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ msgtype: 'text', text: { content } }),
    timeout: 20000
  });

  if (res.errcode !== 0) {
    throw new Error(`钉钉返回异常：${res.errmsg || JSON.stringify(res)}`);
  }

  return true;
};

module.exports = dingPush;
