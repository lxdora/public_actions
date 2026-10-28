/**
 * 掘金每日签到主流程
 *
 * 相比原版的改动：
 * 1. 移除已失效的功能：沾喜气（dip_lucky 路由已下线）、收集 Bug（bugfix 路由已下线）、
 *    挖矿游戏（juejin-game.bytedance.com 已 404）。留着只会打印一堆"失败"。
 * 2. 真正调用 sendMail —— 原版 require 了却从未调用，README 承诺的邮件通知是死代码。
 * 3. 关键步骤失败时以非 0 退出码结束，让 GitHub Actions 显示红色 ✗。
 *    原版所有环节都被 try/catch 吞掉，退出码永远是 0，跑挂了也是绿色的成功。
 */

const sign_in = require('./src/signIn');
const draw = require('./src/draw');
const getPoint = require('./src/getPoint');
const sendMail = require('./src/sendMail');
const wxPush = require('./src/wxPush');
const dingPush = require('./src/dingTalk');
const { cookie, user, pass, to, push_plus_token, ding_token } = require('./src/config');

const results = [];

const record = (name, critical, ok, detail) => {
  results.push({ name, critical, ok, detail });
  console.log(`  ${ok ? '[ok]  ' : '[FAIL]'} ${name}：${detail}`);
};

const run = async (name, critical, fn) => {
  try {
    record(name, critical, true, await fn());
    return true;
  } catch (e) {
    record(name, critical, false, (e && e.message) || String(e));
    return false;
  }
};

const getToday = () =>
  new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    dateStyle: 'medium'
  }).format(new Date());

(async () => {
  console.log(`== 掘金签到 ${getToday()} ==`);

  if (!cookie) {
    console.error('[FATAL] 未配置 COOKIE：请在仓库 Settings -> Secrets 中设置 COOKIE');
    process.exit(2);
  }

  const before = await getPoint();
  console.log(`签到前矿石：${before}`);

  await run('签到', true, sign_in);
  await run('免费抽奖', false, draw);

  const after = await getPoint();
  const delta = after - before;
  console.log(`签到后矿石：${after}（本次变动 ${delta >= 0 ? '+' : ''}${delta}）`);

  const criticalFailed = results.some((r) => r.critical && !r.ok);
  const allFailed = results.some((r) => !r.ok);
  const title = criticalFailed ? `掘金签到失败 ${getToday()}` : `掘金签到成功 ${getToday()}`;
  const body = [
    `日期：${getToday()}`,
    `当前矿石：${after}（变动 ${delta >= 0 ? '+' : ''}${delta}）`,
    '',
    ...results.map((r) => `${r.ok ? '✓' : '✗'} ${r.name}：${r.detail}`)
  ].join('\n');

  console.log('== 结果通知 ==');

  // 通知渠道未配置时跳过，不算失败
  if (user && pass && to) {
    await run('邮件通知', false, () => sendMail({ subject: title, text: body }));
  } else {
    record('邮件通知', false, true, '未配置 USER/PASS/TO，已跳过');
  }

  if (push_plus_token) {
    await run('pushplus 推送', false, () => wxPush(title, body));
  } else {
    record('pushplus 推送', false, true, '未配置 PUSH_PLUS_TOKEN，已跳过');
  }

  if (ding_token) {
    await run('钉钉推送', false, () => dingPush(body));
  } else {
    record('钉钉推送', false, true, '未配置 DING_TOKEN，已跳过');
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n== 汇总：共 ${results.length} 项，失败 ${failed.length} 项 ==`);

  if (criticalFailed) {
    console.error('关键步骤失败，任务以失败状态结束');
    process.exit(1);
  }
  if (failed.length) {
    console.warn('非关键步骤失败，不影响签到结果');
  }
  process.exit(allFailed ? 3 : 0);
})();
