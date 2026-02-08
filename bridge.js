const io = require("socket.io-client");
const socket = io("https://td-and-sensor.onrender.com"); // 你的 Render 地址
const dgram = require("dgram");
const udpClient = dgram.createSocket("udp4");

socket.on("connect", () => console.log("✅ 已成功连接 Render 云端！"));

// 收到手机数据后，直接通过 UDP 转发给 TD
socket.on("sensor_data", (data) => {
    // 将 JSON 转为字符串发给本地 10000 端口
    const message = Buffer.from(JSON.stringify(data) + "\n"); 
    udpClient.send(message, 10000, "localhost");
    console.log("🚀 正在转发数据:", data);
});