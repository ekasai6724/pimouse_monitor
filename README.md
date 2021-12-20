# pimouse_monitor

○事前に必要なもの<br>
・pimouse_rosのインストール<br>
$ sudo git clone https://github.com/ryuichiueda/pimouse_ros.git<br>
・OpenCV関係の設定<br>
このリポジトリの「USBカメラとOpenCV関係の設定.txt」を参照してください。<br>
・rosbridge_suiteのインストール<br>
$ sudo apt install ros-kinetic-rosbridge-suite

○起動コマンド<br>
$ roslaunch pimouse_monitor pimouse_monitor.launch

○ブラウザ側の操作<br>
ウェブブラウザで、"http://RaspiMouseのIPアドレス:8000"にアクセスしてください。<br>
※正常に動作しない場合はブラウザのキャッシュを消去してみてください。<br>
