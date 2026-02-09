const socket = io();
let sensorPermission = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    // 依然绑定你的按钮
    document.getElementById('start-btn').addEventListener('click', requestSensorPermission);
}

function requestSensorPermission() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(res => {
            if (res == 'granted') startExperience();
        });
    } else {
        startExperience();
    }
}

function startExperience() {
    sensorPermission = true;
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('mode-display').style.display = 'block';
}

function draw() {
    if (!sensorPermission) return;

    // --- 最小化修改：不再计算角度，直接锁死在 0.5 ---
    let mX = 0.5; 

    // 发送固定数据给 TD
    socket.emit("sensor_data", { rotX: rotationX, rotY: rotationY, moveX: mX });

    // 直接染成黄色
    background(255, 215, 0); 
    const txt = document.getElementById('mode-display');
    if(txt) txt.innerText = "MODE";

    // 依然保留一个数字，让你知道数据在发
    fill(255);
    textAlign(CENTER);
    text("STABLE MODE 2", width/2, height - 30);
}