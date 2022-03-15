/**
 *
 * 收集bug
 *
 *  */

 const fetch = require('node-fetch');
 const { headers } = require('./config');

 async function collection_bug() {
   // 查询是否有未收集的bug
   const res = await fetch('https://api.juejin.cn/user_api/v1/bugfix/not_collect?aid=2608&uuid=6974222589633086990', {
     headers,
     method: 'post',
     credentials: 'include',
     body: JSON.stringify({})
   }).then((res) => res.json());
   const no_collections = res.data
   if(no_collections.length){
     //有未收集的bug
    for(let bug of no_collections){
      await fetch('https://api.juejin.cn/user_api/v1/bugfix/collect?aid=2608&uuid=6974222589633086990', {
        headers,
        method: 'post',
        credentials: 'include',
        body: JSON.stringify({bug_time: bug.bug_time, bug_type: bug.bug_type})
      }).catch(err=>{console.log(err)})
    }
   }
   return `收集了${no_collections.length}条bug！`;
 }
 
 module.exports = collection_bug;
 