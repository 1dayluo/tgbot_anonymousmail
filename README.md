## 介绍
利用mailslurp(app.mailslurp.com) 提供的api做的匿名邮件收取bot.支持多个匿名邮箱的邮件收取      
友情提示:bot支持serverless部署,例如laf/cf云函数

**.env配置示范**
```
TGTOKEN={tg-token} #tg bot的token
MAILKEY={mail-key1,mail-key2} #放置mailslurp的api key.用","分隔
```

**tg 机器人命令**:
- `/address`: 查看全部api key下的inbox地址
- `/get`: 获取最新的邮件(不限用户)
- `/get {account_id}`: 获取指定用户邮件
- `/create {account_id}`: 创建免费匿名随机邮箱,注意免费用户有上限



其他:    
没什么,我就想配个图

![](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFjdx9jkbSl2GgtwjLgtdFh0docG5V_WZHcg34Xa9zSrkc4AsmLR5lyE-FHoZUNRqyvzM&usqp=CAU)    
