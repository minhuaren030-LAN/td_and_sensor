// 在 sketch.js 顶部增加变量
const socket = io();
let sensorPermission = false;
let shakeThreshold = 30; // 抖动阈值，可根据灵敏度调整

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 创建一个大按钮，让用户点击以开启手机传感器权限
  let btn = createButton('点击开启传感器互动');
  btn.position(20, 20);
  btn.mousePressed(requestSensorPermission);
}

// 申请传感器权限（针对 iOS 必做）
function requestSensorPermission() {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response == 'granted') {
          sensorPermission = true;
          console.log("传感器权限已开启");
        }
      })
      .catch(console.error);
  } else {
    // 非 iOS 设备通常直接开启
    sensorPermission = true;
  }
}

function draw() {
  if (!sensorPermission) return;

  // 1. 捕捉数据
  let data = {
    // 旋转数据 (对应：画面抖动 & 蒙版)
    rotX: rotationX, 
    rotY: rotationY,
    rotZ: rotationZ,
    
    // 抖动数据 (对应：发出声音)
    // p5.js 自带 pAccelerationX 等变量
    accel: dist(0, 0, 0, accelerationX, accelerationY, accelerationZ),
    
    // 移动数据 (对应：切换 Switch 的 Index)
    // 利用重力感应产生的角度来模拟上下左右移动
    moveX: map(rotationY, -45, 45, 0, 1, true), // 映射到 0-1 之间
    moveY: map(rotationX, -45, 45, 0, 1, true)
  };

  // 2. 将这些“货物”装上对讲机发给 Render
  socket.emit("sensor_data", data);
}