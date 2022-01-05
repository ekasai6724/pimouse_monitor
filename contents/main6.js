var ros = new ROSLIB.Ros({ url : 'ws://' + location.hostname + ':9000' });
                                                   
ros.on('connection', function() {console.log('websocket: connected'); });
ros.on('error', function(error) {console.log('websocket error: ', error); });
ros.on('close', function() {console.log('websocket: closed');});

// 距離センサデータ読出トピックオブジェクト
var ls = new ROSLIB.Topic({
    ros : ros,
    name : '/lightsensors',
    messageType : 'pimouse_ros/LightSensorValues'
});

// 距離センサデータ受信時に実行:距離データ表示
ls.subscribe(function(message) {
    for( e in message ){
        document.getElementById(e).innerHTML = message[e];
    }
});

// モータ励磁オンサービスオブジェクト
var on = new ROSLIB.Service({
    ros : ros,
    name : '/motor_on',
    messageType : 'std_srvs/Trigger'
});

// モータ励磁オフサービスオブジェクト
var off = new ROSLIB.Service({
    ros : ros,
    name : '/motor_off',
    messageType : 'std_srvs/Trigger'
});

// モータ励磁オンボタンクリック
$('#motor_on').on('click', function(e){
    on.callService(ROSLIB.ServiceRequest(),function(result){
        if(result.success){
            $('#motor_on').attr('class','btn btn-danger');
            $('#motor_off').attr('class','btn btn-default');
        }
    });
});

// モータ励磁オフボタンクリック
$('#motor_off').on('click', function(e){
    off.callService(ROSLIB.ServiceRequest(),function(result){
        if(result.success){
            $('#motor_on').attr('class','btn btn-default');
            $('#motor_off').attr('class','btn btn-primary');
        }
    });
});

// ROSのモータ速度データオブジェクト
var vel = new ROSLIB.Topic({
    ros : ros,
    name : '/cmd_vel',
    messageType : 'geometry_msgs/Twist'
});

// ROSにモータ速度データを発行する
function pubMotorValues(){
    fw = $('#vel_fw').html();
    rot = $('#vel_rot').html();

    fw = parseInt(fw)*0.001;
    rot = 3.141592*parseInt(rot)/180;
    v = new ROSLIB.Message({linear:{x:fw,y:0,z:0}, angular:{x:0,y:0,z:rot}});
    vel.publish(v);
}
setInterval(pubMotorValues,100);

// モータ速度操作パッドクリック
/*
$('#touchmotion').on('click', function(e){
    rect = $('#touchmotion')[0].getBoundingClientRect();
    x = e.pageX - rect.left - window.pageXOffset;
    y = e.pageY - rect.top - window.pageYOffset;
        
    vel_fw = (rect.height/2 - y)*3;
    vel_rot = rect.width/2 - x;
    $('#vel_fw').html(parseInt(vel_fw));
    $('#vel_rot').html(parseInt(vel_rot));
});
*/

// キーボードの矢印キー入力
document.body.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
            vel_fw = 100;
            vel_rot = 0;
            break;
        case 'ArrowDown':
            vel_fw = -100;
            vel_rot = 0;
            break;
        case 'ArrowLeft':
            vel_fw = 0;
            vel_rot = 30;
            break;
        case 'ArrowRight':
            vel_fw = 0;
            vel_rot = -30;
            break;
    }
    $('#vel_fw').html(parseInt(vel_fw));
    $('#vel_rot').html(parseInt(vel_rot));
});

// ゲームパッド入力ポーリング
const gameLoop = () => {
    const gamepads = navigator.getGamepads
        ? navigator.getGamepads()
        : navigator.webkitGetGamepads
        ? navigator.webkitGetGamepads
        : [];
    if (!gamepads) {
        return;
    }

    vel_fw  = gamepads[0].axes[1] * 200 * -1;
    vel_rot = gamepads[0].axes[2] * 200;
    $('#vel_fw').html(parseInt(vel_fw));
    $('#vel_rot').html(parseInt(vel_rot));

    requestAnimationFrame(gameLoop);
};

// ゲームパッド接続イベント
window.addEventListener("gamepadconnected", (e) => {
    console.log(
        "Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index,
        e.gamepad.id,
        e.gamepad.buttons.length,
        e.gamepad.axes.length
    );
    requestAnimationFrame(gameLoop);
});

// USBカメラ画像表示
document.getElementById('camstream').data = 'http://'
                                            + location.hostname
                                            + ':10000/stream?topic=/cv_camera_node/image_raw';

// Copyright 2016 Ryuichi Ueda
// Released under the MIT License.
// To make line numbers be identical with the book, this statement is written here. Don't move it to the header.
