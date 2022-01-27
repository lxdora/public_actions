const { push_plus_token} = require('./config');
const fetch = require('node-fetch');

const PUSH_URL = 'http://www.pushplus.plus/send' // pushplus 推送api

const wxPush = async(data)=>{
  if(!push_plus_token){
    return Promise.reject('未配置推送token！！！');
  }
  const body ={
    token: `${push_plus_token}`,
    title: `签到结果`,
    content: `${data}`,
    template: 'txt'
  }
  const res = await fetch(PUSH_URL, {
    method: 'POST',
    body: JSON.stringify(body)
  })
  console.log(res.body);
}

module.exports = wxPush;