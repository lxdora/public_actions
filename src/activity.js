//掘金活跃

 const fetch = require('node-fetch');
 const { headers } = require('./config');
 
 async function activity() {
   //获取沸点
   const feidians = await fetch('https://api.juejin.cn/recommend_api/v1/short_msg/recommend', {
     headers,
     method: 'post',
     credentials: 'include',
     body: JSON.stringify({cursor: "0", limit: 30, id_type: 4, sort_type: 300})
   }).then(res=>res.json())
   //取随机的一条沸点
   const randomNum = Math.round(Math.random()*30);
   const chooseFeiDian = feidians.data[randomNum];
  const poem = await fetch('https://v1.jinrishici.com/all.json').then(res=>res.json());
   //发送评论
   await fetch(`https://api.juejin.cn/interact_api/v1/comment/publish?aid=2608&uuid=6974222589633086990`, {
     headers,
     method: 'post',
     credentials: 'include',
     body: JSON.stringify({
       client_type: 2608,
       comment_content: `别想那么多，跟我吟一句诗吧：${poem.content}`,
       comment_pics: [],
       item_id: chooseFeiDian.msg_id,
       item_type: 4})
   })
  return poem.content;
 }
 
 module.exports = activity;
 