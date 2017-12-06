var socket
// 默认聊天频道
var current_room = '大厅'

var e = function (sel) {
    return document.querySelector(sel)
}

var log = function() {
    console.log.apply(console, arguments)
}

var join_room = function (room) {
    clear_board()
    current_room = room
    log('切换房间', current_room)
    var data = {
        room: room,
    }
    socket.emit('join', data, function () {
        change_title()
    })
}

var change_title = function () {
    if (current_room == '') {
        var title = '聊天室 - 未加入聊天室'
    } else {
        var title = '聊天室 - ' + current_room
    }
    var tag = e("#id-rooms-title")
    tag.innerHTML = title
}

var clear_board = function () {
    e("#id-chat-area").value = ''
}

var __main = function () {
    // 初始化 websocket
    var namespace = '/chat'
    var url = `ws://${document.domain}:${location.port}${namespace}`
    socket = io.connect(url, {
        transports: ['websocket']
    })
    // on 函数用来绑定事件, connect 是 socket.io 的内置事件，表示和后端 websocket 连接成功
    socket.on('connect', function () {
        log('connect')
    })

    // 注册 2 个 websocket 事件, 后端发送消息到前端后, 自动触发
    var chatArea = e('#id-chat-area')
    // 新用户加入聊天室的事件
    socket.on('status', function (data) {
        chatArea.value += `< ${data.message} >\n`
    })
    // 收到其他用户发送的新消息的事件
    socket.on('message', function (data) {
        chatArea.value += (data.message + '\n')
    })

    // 加入默认频道
    join_room(current_room)

    // 给 input 元素绑定回车键发送消息的事件
    var input = e('#id-input-text')
    input.addEventListener('keypress', function (event) {
        // console.log('keypress', event)
        if (event.key == 'Enter') {
            // 得到用户输入的消息
            message = input.value
            // 发送消息给后端
            var data = {
                message: message,
            }
            socket.emit('send', data, function () {
                // 清空用户输入
                input.value = ''
            })

        }
    })

    // 切换频道的事件
    e('body').addEventListener('click', function (event) {
        var self = event.target
        if (self.classList.contains('chat-room')) {
            log('chaneel', self.text)
            // 离开频道
            socket.emit('leave', {}, function () {
                console.log("leave room")
                current_room = self.text
                // 加入房间
                join_room(current_room)
            })
        }
    })
}

__main()