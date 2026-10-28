/**
 * 邮件通知（新版）
 *
 * 旧版的调用方式是 `sendMail({from, subject, text})`，并且 index.js 里压根没调用它，
 * 属于死代码。这里改成 sendMail({ subject, text })，由 index.js 真正调用。
 * 另外把非标准的 `secureConnection` 换成 nodemailer 标准的 `secure`。
 */

const nodemailer = require('nodemailer');

const { user, pass, to } = require('./config');

const EmailReg = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const sendMail = async ({ subject, text }) => {
  if (!user || !pass) throw new Error('邮件通知未配置（缺少 USER / PASS）');
  if (!EmailReg.test(user)) throw new Error(`发件邮箱格式不正确：${user}`);
  if (!EmailReg.test(to)) throw new Error(`收件邮箱格式不正确或未配置 TO：${to}`);

  const [, domain] = user.split('@');
  const host = `smtp.${domain}`;

  const transporter = nodemailer.createTransport({
    host,
    port: 465,
    secure: true,
    auth: { user, pass },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000
  });

  const info = await transporter.sendMail({
    from: `"JueJin Helper" <${user}>`,
    to,
    subject,
    text
  });

  return info.messageId;
};

module.exports = sendMail;
