const express = require('express');
const socket = require('socket.io');
var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var DeviceClient = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;

//Connect to Azure IoT Hub
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
    //values to add to the chart every 30 seconds
    socket.on('accelerometer', function(message){
        var JSONMessage = new Message(JSON.stringify({
            xaxis: message.xaxis,
            yaxis: message.yaxis,
            zaxis: message.zaxis
        }));
        //handle errors
        client.sendEvent(JSONMessage, function (err) {
            if (err) {
                console.error('Error while sending the message to the hub: ' + err.toString());
            } else {
                console.log('Messages sent');
            }
        });
    });
    //values to add in the spans every 5 seconds
    socket.on('lastaccelerometer', function(message){
        var JSONMessage = new Message(JSON.stringify({
            lastxaxis: message.xaxis,
            lastyaxis: message.yaxis,
            lastzaxis: message.zaxis
        }));
        //handle errors
        client.sendEvent(JSONMessage, function (err) {
            if (err) {
                console.error('Error while sending the message to the hub: ' + err.toString());
            } else {
                console.log('Messages sent');
            }
        });
    });
});
