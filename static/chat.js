var socket
// 默认聊天房间
var currentRoom = e('#id-current-room').value

// 加入房间
var joinRoom = function (room) {
    clearBoard()
    var data = {
        room: room,
    }
    socket.emit('join', data, function () {
        changeTitle()
    })
}

var changeTitle = function () {
    if (currentRoom == '') {
        var title = '聊天室 - 未加入聊天室'
    } else {
        var title = '聊天室 - ' + currentRoom
    }
    e("#id-rooms-title").innerHTML = title
}

var clearBoard = function () {
    e("#id-chat-area").innerHTML = ''
}

// 插入从后端收到的消息
var insertMessage = function (data) {
    var d = new Date()
    var messageDiv = `
        <div>
            <span class="label label-primary">${data.user}</span>
            <span class="text-muted"><small>(${d.toLocaleTimeString()})</small></span>
            ${data.message}
        </div>
    `
    var chatArea = e("#id-chat-area")
    chatArea.insertAdjacentHTML('beforeend', messageDiv)
    // 插入新消息时滚动条自动触底
    chatArea.scrollTop = chatArea.scrollHeight
}

// 得到用户输入的消息并发送消息给后端
var getMessageAndSend = function () {
    var input = e('#id-input-text')
    message = input.value
    if (message != '') {
        var data = {
            message: message,
        }
        socket.emit('send', data, function () {
            // 清空用户输入
            input.value = ''
        })
    }
}

// 给 input 元素绑定回车键及点击发送消息的事件
var bindEventSendMessage = function () {
    e('#id-input-text').addEventListener('keypress', function (event) {
        if (event.key == 'Enter') {
            getMessageAndSend()
        }
    })
    e('#id-button-send').addEventListener('click', getMessageAndSend)
}

// 绑定切换房间的事件
var bindEventChangeRoom = function () {
    e('body').addEventListener('click', function (event) {
        var self = event.target
        if (self.classList.contains('chat-room')) {
            // 离开房间
            socket.emit('leave', {}, function () {
                currentRoom = self.text
                // 加入房间
                joinRoom(currentRoom)
            })
        }
    })
    // 离开页面
    window.onbeforeunload = function () {
        socket.emit('leave', {})
    }
}

// 注册 2 个 websocket 事件, 后端发送消息到前端后, 自动触发
var bindEventReceiveMessage  = function () {
    var chatArea = e('#id-chat-area')
    // 新用户加入聊天室的事件
    socket.on('status', function (data) {
        insertMessage(data)
    })
    // 收到其他用户发送的新消息的事件
    socket.on('message', function (data) {
        insertMessage(data)
    })
}

var __main = function () {
    // 初始化 websocket
    var namespace = '/chat'
    var url = `ws://${document.domain}:${location.port}${namespace}`
    socket = io.connect(url, {
        transports: ['websocket']
    })
    // on 函数用来绑定事件, connect 是 socket.io 的内置事件，表示和后端 websocket 连接成功
    // socket.on('connect', function () {
    //     log('connect')
    // })
    
    // 监听消息接收
    bindEventReceiveMessage()

    // 加入默认频道
    joinRoom(currentRoom)

    // 监听消息发送
    bindEventSendMessage()

    // 监听房间切换
    bindEventChangeRoom()
    
}

__main()