const sign_in = require('./src/signIn');
const draw = require('./src/draw');
const dipLucky = require('./src/dipLucky');
const sendMail = require('./src/sendMail');
const getPoint = require('./src/getPoint');
const wxPush = require('./src/wxPush')
const activity = require('./src/activity')
const collectionBug  = require('./src/collectionBug')

const { autoGame } = require('./src/game/autoGame');

(async () => {
  // 上次分数
  const yesterday_score = await getPoint();

  console.log(`昨日矿石：${yesterday_score}`);

  let sign_res = '';

  try {
    sign_res = await sign_in();
  } catch (error) {
    sign_res = error;
  }

  console.log(sign_res);

  let draw_res = '';
  try {
    draw_res = await draw();
  } catch (error) {
    draw_res = error;
  }

  console.log(draw_res);

  let game_res = '挖矿成功！';
  try {
    await autoGame();
  } catch (error) {
    game_res = '挖矿失败！';
  }

  // 当前分数
  const now_score = await getPoint();

  console.log(`当前矿石：${now_score}`);

  let dip_res;
  try {
    dip_res = await dipLucky();
  } catch (error) {
    dip_res = error;
  }

  console.log(dip_res);

  try{
    activity_res = await activity();
  }catch(error){
    activity_res = '评论失败'
  }

  console.log(activity_res);

  try{
    collection_bug_res = await collectionBug()
  }catch(error){
    collection_bug_res = '收集bug失败'
  }

  try {
    const data = `
      沾喜气结果：${dip_res} \n
      当前矿石：${now_score} \n
      较昨日增长：${now_score - yesterday_score} \n
      签到结果：${sign_res} \n
      抽奖结果：${draw_res} \n
      游戏结果：${game_res} \n
      评论结果：${activity_res} \n
      收集bug结果：${collection_bug_res}
    `;
    await wxPush(data);
    console.log('微信推送成功');
    // console.log(html);

    // await sendMail({ from: '掘金', subject: '定时任务', html });

    // console.log('邮件发送成功！');
  } catch (error) {
    console.error(error);
  }
})();
