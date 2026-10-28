/*
 * 查询当前矿石数
 */

const { headers } = require('./config');
const { request } = require('./http');

const URL = 'https://api.juejin.cn/growth_api/v1/get_cur_point';

async function get_cur_point() {
  try {
    const res = await request(URL, { headers, method: 'GET' });
    return res.err_no === 0 ? Number(res.data) || 0 : 0;
  } catch (e) {
    return 0;
  }
}

module.exports = get_cur_point;
