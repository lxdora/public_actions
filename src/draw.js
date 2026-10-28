/**
 * 自动免费抽奖
 */

const { headers } = require('./config');
const { request, assertOk } = require('./http');

const CONFIG_URL = 'https://api.juejin.cn/growth_api/v1/lottery_config/get';
const DRAW_URL = 'https://api.juejin.cn/growth_api/v1/lottery/draw';

async function draw() {
  const today = assertOk(
    await request(CONFIG_URL, { headers, method: 'GET' }),
    '查询免费抽奖机会'
  );

  if (!today.data || today.data.free_count === 0) {
    return '今日无免费抽奖机会（已抽过或尚未签到）';
  }

  const res = assertOk(await request(DRAW_URL, { headers, method: 'POST' }), '免费抽奖');

  return `抽奖成功，获得：${(res.data && res.data.lottery_name) || '未知奖品'}`;
}

module.exports = draw;
