/**
 * 统一的网络请求封装
 *
 * 相比原来直接用 node-fetch，这里补了三件事：
 * 1. 超时控制，避免掘金挂起导致 Action job 卡死
 * 2. 统一的 JSON 解析，接口返回空或非 JSON 时给出可读错误（掘金下线路由时会返回 {"err_no":2} 或空响应）
 * 3. 统一使用 Node 18+ 内置 fetch，去掉 node-fetch 依赖
 */

const DEFAULT_TIMEOUT = 15000;

async function request(url, options = {}) {
  const { timeout = DEFAULT_TIMEOUT, ...rest } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { ...rest, signal: controller.signal });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`.trim());
    }

    const text = await res.text();

    if (!text) {
      throw new Error('接口返回空响应（通常是缺少登录态，或该路由已被下线）');
    }

    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      throw new Error(`接口未返回 JSON：${text.slice(0, 120)}`);
    }

    return json;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`请求超时（${timeout}ms）：${url}`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 掘金接口的通用响应校验，err_no !== 0 时抛出带 err_msg 的错误
 */
function assertOk(res, action) {
  if (res && res.err_no === 0) return res;
  const msg = (res && res.err_msg) || '未知错误';
  if (res && res.err_no === 403) {
    throw new Error(`${action}失败：${msg}，请检查 Secret 里的 COOKIE 是否已过期`);
  }
  throw new Error(`${action}失败：${msg}`);
}

module.exports = { request, assertOk };
