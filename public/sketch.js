const socket = io();
let sensorPermission = false;

function setup() {
    // 关键：让画布跟随窗口，但不遮挡点击
    createCanvas(windowWidth, windowHeight);
    const btn = document.getElementById('start-btn');
    btn.addEventListener('click', requestSensorPermission);
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
    
    // 强制背景透明，看到 body 的颜色
    clear(); 

    // 提高灵敏度：-20 到 20 度就完成 0 到 1 的映射
    let mX = map(rotationY, -20, 20, 0, 1, true); 

    // 发送数据 (TD 能动靠的就是这里)
    socket.emit("sensor_data", { rotX: rotationX, rotY: rotationY, moveX: mX });

    // 本地 UI 逻辑
    const body = document.body;
    const txt = document.getElementById('mode-display');

    if (mX < 0.33) {
        body.style.backgroundColor = "red";
        txt.innerText = "MODE 1";
    } else if (mX < 0.66) {
        body.style.backgroundColor = "yellow";
        txt.innerText = "MODE 2";
    } else {
        body.style.backgroundColor = "blue";
        txt.innerText = "MODE 3";
    }
}