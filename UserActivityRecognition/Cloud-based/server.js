const express = require('express');
const socket = require('socket.io');
var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var DeviceClient = require('azure-iot-device').Client
var Message = require('azure-iot-device').Message;

const app = express();
const port = '8080';

app.use(express.static('public'));

//IoT hub Connection
var connectionString = 'HostName=Clever-Weather.azure-devices.net;DeviceId=mate10pro;SharedAccessKey=ew5Ri+C+Cm8Ujm0T/OhLxOVSsjJaYnT8hY6KF+nsa08=';
var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

var server = app.listen('8080', () => {
console.log('Server is running on http://localhost:8080');
});

var io = socket(server);

io.on('connection', function(socket){
    socket.on('accelerometer', function(message){
        console.log(message);
        //var message = new Message(JSON.stringify({data}));
        //console.log('Sending message: ' + message.getData());
        client.sendEvent(message, function (err) {
            if (err) {
                console.error('send error: ' + err.toString());
            } else {
                console.log('messages sent');
            }
        });
    })
});