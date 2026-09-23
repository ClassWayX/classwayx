# 飞书机器人消息推送

飞书机器人消息推送服务提供 API，你可以：

- 方便地管理多个班级机器推送链接
- 一键向指定班级的所有机器人推送消息

# 项目架构一览

[create-class](./app/create-class)：用户在这里创建班级。

[dashboard](./app/dashboard): 用户在这里查看、管理已创建的班。

[bots API](./app/api/bots): 提供一键发送消息的 POST API。