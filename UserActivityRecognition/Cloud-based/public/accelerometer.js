var socket = io();

$(document).ready(() => {
  if ("Accelerometer" in window){
    const xax = document.getElementById("xaxis");
    const yax = document.getElementById("yaxis");
    const zax = document.getElementById("zaxis");
    
    //create a new sensor
    let sensor = new Accelerometer({frequency: 1});

    //start the sensor
    sensor.start();

    sensor.onreading = () => {
      //round the values with factor 3
      factor = 10**3;
      x = Math.round(sensor.x*factor)/factor;
      y = Math.round(sensor.y*factor)/factor;
      z = Math.round(sensor.z*factor)/factor;

      //visualize sensor values in the file
      xax.textContent(x);
      yax.textContent(y);
      zax.textContent(z);

      console.log("Acceleration along X-axis: " + sensor.x);
      console.log("Acceleration along Y-axis: " + sensor.y);
      console.log("Acceleration along Z-axis: " + sensor.z);

      //create the message and send it to server.js using the socket every 5 seconds
      setInterval(function(){
        var message = new Message(JSON.stringify({
          xaxis: x,
          yaxis: y,
          zaxis: z
        }));

        socket.emit("accelerometer",message)
  
      }, 5000);
    }

    /*sensor.onerror = event => {
      console.log(event.error.name, event.error.message);
      document.getElementById("errorType").textContent(event.error.name);
      document.getElementById("errorMessage").textContent(event.error.message);
    } */
  }else document.getElementById("errorMessage").textContent("Accelerometer not supported");


    /*setInterval(function(){
        // Simulate telemetry.
          var message = new Message(JSON.stringify({
            //xaxis: x,
            //yaxis: y,
            //zaxis: z
          }));
      
          // Add a custom application property to the message.
          // An IoT hub can filter on these properties without access to the message body.
          //message.properties.add('temperatureAlert', (temperature > 30) ? 'true' : 'false');
      
          console.log('Sending message: ' + message.getData());
      
          // Send the message.
          client.sendEvent(message, function (err) {
            if (err) {
              console.error('send error: ' + err.toString());
            } else {
              console.log('message sent');
            }
          });
        }, 5000);*/

    
});