/**
 * 配置读取：优先读环境变量，兼容旧的命令行传参方式
 *
 * 旧写法只认 process.argv，本地调试必须拼一长串参数，而且 workflow 里
 * `node index.js "$COOKIE" ...` 遇到带空格/引号的 Cookie 容易出岔子。
 * 这里改成 env 优先，同时保留 argv 兜底，顺序与旧调用保持一致。
 */

const argv = process.argv.slice(2);

const KEYS = [
  'COOKIE',
  'USER',
  'PASS',
  'TO',
  'PUSH_PLUS_TOKEN',
  'DING_TOKEN',
  'DING_SIGN'
];

const pick = (key, index) => String(process.env[key] || argv[index] || '').trim();

const conf = {};
KEYS.forEach((key, i) => {
  conf[key] = pick(key, i);
});

const cookie = conf.COOKIE;
const user = conf.USER;
const pass = conf.PASS;
const to = conf.TO;
const push_plus_token = conf.PUSH_PLUS_TOKEN;
const ding_token = conf.DING_TOKEN;
const ding_sign = conf.DING_SIGN;

const headers = {
  'content-type': 'application/json; charset=utf-8',
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  accept: 'application/json, text/plain, */*',
  'accept-language': 'zh-CN,zh;q=0.9',
  referer: 'https://juejin.cn/',
  cookie
};

module.exports = {
  headers,
  cookie,
  user,
  pass,
  to,
  push_plus_token,
  ding_token,
  ding_sign
};
