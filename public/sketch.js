const socket = io();
let sensorPermission = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // 绑定 HTML 里的按钮
    const btn = document.getElementById('start-btn');
    btn.addEventListener('click', requestSensorPermission);
}

function requestSensorPermission() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                if (response == 'granted') {
                    startExperience();
                }
            })
            .catch(console.error);
    } else {
        startExperience();
    }
}

// 开启后的界面切换
function startExperience() {
    sensorPermission = true;
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('mode-display').style.display = 'block';
}

function draw() {
    if (!sensorPermission) return;

    // 1. 捕捉数据
    let moveX = map(rotationY, -45, 45, 0, 1, true);
    
    let data = {
        rotX: rotationX, 
        rotY: rotationY,
        accel: dist(0, 0, 0, accelerationX, accelerationY, accelerationZ),
        moveX: moveX
    };

    // 2. 发送给服务器
    socket.emit("sensor_data", data);

    // 3. 手机端实时同步变色 (红、黄、蓝)
    const display = document.getElementById('mode-display');
    const body = document.body;

    if (moveX < 0.33) {
        body.style.backgroundColor = "#FF0000"; // MODE 1: 红
        display.innerText = "MODE 1";
    } else if (moveX < 0.66) {
        body.style.backgroundColor = "#FFD700"; // MODE 2: 黄
        display.innerText = "MODE 2";
    } else {
        body.style.backgroundColor = "#0000FF"; // MODE 3: 蓝
        display.innerText = "MODE 3";
    }
}