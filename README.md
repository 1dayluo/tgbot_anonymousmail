<!--
 * @Author: 1dayluo
 * @Date: 2023-11-26 15:39:18
 * @LastEditTime: 2023-11-26 19:22:48
-->
## 介绍

利用mailslurp(app.mailslurp.com) 提供的api做的匿名邮件收取bot.默认收取最新的邮件,后续考虑支持自定义邮件接受设置.      
bot本地debug采用polling模式,webhooke则部署在cf worker上(参考&感谢提供的思路和解决方案:https://github.com/Tsuk1ko/cfworker-middleware-telegraf )

## cf worker使用
使用webpack打包: `npx webpack -c webpack.config.js`
你可以直接用我webpack打包后的文件:`dist/worker.js`

**.env配置示范**
本地部署参考
```
{
    
    TGTOKEN={your-tg-bot-token}
    MAILKEY=key1,key2
    DOMAIN={cf-worker-domain}
    UUID={your-uuid-path}
    environment={DEV-or-PRODUCTION}
}
```
cf worker则参考以上,设定"環境變數":
DOMAIN,MAILKEY,TGTOKEN,UUID


**tg 机器人命令**:
- `/address`: 查看全部api key下的inbox地址
- `/get`: 获取最新的邮件(不限用户)
- `/get {account_id}`: 获取指定用户邮件
- `/create {account_id}`: 创建免费匿名随机邮箱,注意免费用户有上限



其他:    

本地测试/debug请用`src/bot.js.` 


![](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFjdx9jkbSl2GgtwjLgtdFh0docG5V_WZHcg34Xa9zSrkc4AsmLR5lyE-FHoZUNRqyvzM&usqp=CAU)    
