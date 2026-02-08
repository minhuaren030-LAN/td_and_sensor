const socket = io();
let sensorPermission = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    document.getElementById('start-btn').addEventListener('click', () => {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission().then(res => { if (res == 'granted') start(); });
        } else { start(); }
    });
}

function start() {
    sensorPermission = true;
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('mode-display').style.display = 'block';
}

function draw() {
    if (!sensorPermission) return;

    // 1. 映射数据 (缩小到 20 度，让切换极度灵敏)
    let mX = map(rotationY, -20, 20, 0, 1, true); 

    // 2. 发送给 TD
    socket.emit("sensor_data", { rotX: rotationX, rotY: rotationY, moveX: mX });

    // 3. --- 强制染色逻辑 ---
    const txt = document.getElementById('mode-display');
    if (mX < 0.33) {
        background(255, 0, 0); // 红
        txt.innerText = "MODE 1";
    } else if (mX < 0.66) {
        background(255, 215, 0); // 黄
        txt.innerText = "MODE 2";
    } else {
        background(0, 0, 255); // 蓝
        txt.innerText = "MODE 3";
    }

    // 4. 调试数字 (确保你看得到代码在跑)
    fill(255);
    textAlign(CENTER);
    textSize(24);
    text("SENSOR VAL: " + nf(mX, 1, 2), width/2, height - 40);
}