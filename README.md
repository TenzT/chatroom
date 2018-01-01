# chatroom
基于 WebSocket 的在线聊天室，[Demo 地址](http://chat.enin.cc/)。

- 使用了 Flask 及其扩展插件 Flask-SocketIO，界面实现采用前端框架 Bootstrap 及其免费主题 Bootswatch。
- 可多人实时在线聊天，可自由切换聊天室和创建自定义聊天室。

### 演示
![演示图片](https://github.com/enincc/chatroom/blob/master/chatroom.gif)

### 运行和部署相关
- 安装依赖库 `pip install -r requirements.txt`

- 运行前需要在 `config.py` 文件中修改密钥、房间列表等配置选项，可参照 `config_copy.py` 自行创建。

- 部署使用了 Nginx + Supervisor + Gunicorn ，具体配置分别在 `chat.nginx`、`chat.conf` 及 `gunicorn.config.py` 中修改。

- `configuration\setup_development.sh` 和 `configuration\setup_production.sh` 分别是开发环境和生产环境部署脚本，可根据需要自行修改。

