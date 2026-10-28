/**
 * 签到
 */

const { headers } = require('./config');
const { request, assertOk } = require('./http');

const STATUS_URL = 'https://api.juejin.cn/growth_api/v1/get_today_status';
const CHECK_IN_URL = 'https://api.juejin.cn/growth_api/v1/check_in';

async function sign_in() {
  const status = assertOk(
    await request(STATUS_URL, { headers, method: 'GET' }),
    '查询今日签到状态'
  );

  if (status.data) return '今日已经签到';

  assertOk(await request(CHECK_IN_URL, { headers, method: 'POST' }), '签到');

  return '签到成功';
}

module.exports = sign_in;
