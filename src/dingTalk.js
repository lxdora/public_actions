const { ding_token, ding_sign} = require('./config');

const Bot = require('ding-bot-sdk')

// Webhook地址: https://oapi.dingtalk.com/robot/send?access_token=xxx
const bot = new Bot({
  base_url: 'https://oapi.dingtalk.com/robot/send', // 可选 不填默认 https://oapi.dingtalk.com/robot/send
  access_token: ding_token, // Webhook地址后的access_token // 必填
  secret: ding_sign // 安全设置：加签的secret 必填
}) 

const dingPush = (msg)=>{
  bot.send({
    "msgtype": "text",
    "text": {
        "content": msg
    },
  }).then(res=>{
    console.log('res',res)
  }).catch(error=>{
    console.log('error',error)
  })
}

module.exports = dingPush;