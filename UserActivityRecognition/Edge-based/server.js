//Express loads the file in public folder
const express = require('express');

//Socket to communicate with accelerometer.js
const socket = require('socket.io');

//IoT hub Connection
var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var DeviceClient = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;

//remember to set the connection string of the device
var connectionString = "";
var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

const app = express();
const port =process.env.PORT || '3000';

//index.html and accelerometer.js are in public folder
app.use(express.static('public'));

var server = app.listen(port, () => {
    console.log('Server is running on http://localhost:${port}');
});

var io = socket(server);

io.on('connection', function(socket){
    //getting data from accelerometer.js
    socket.on('activity', function(message){
        var JSONMessage = new Message(JSON.stringify({
            state: message.state
        }));
        //sending message to azure iot hub
        client.sendEvent(JSONMessage, function (err) {
            if (err) {
                console.error('Error while sending the message to the hub: ' + err.toString());
            } else {
                console.log('Messages sent');
            }
        });
    });
    socket.on('lastactivity', function(message){
        var JSONMessage = new Message(JSON.stringify({
            state: message.state
        }));
        //sending message to azure iot hub
        client.sendEvent(JSONMessage, function (err) {
            if (err) {
                console.error('Error while sending the message to the hub: ' + err.toString());
            } else {
                console.log('Messages sent');
            }
        });
    });
});
