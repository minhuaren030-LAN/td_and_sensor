const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// 自动分配端口，Render 部署的核心
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('新设备已连接:', socket.id);

    // 核心逻辑：监听手机发来的传感器数据
    socket.on('sensor_data', (data) => {
        // 广播给所有人（包括你运行 TouchDesigner 的电脑）
        socket.broadcast.emit('sensor_data', data);
    });
});

server.listen(PORT, () => {
    console.log(`服务器已在端口 ${PORT} 启动`);
});