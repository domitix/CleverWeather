//create the socket to communicate with the server
var socket = io();

$(document).ready(() => {
  if ("Accelerometer" in window){
    const xax = document.getElementById("xaxis");
    const yax = document.getElementById("yaxis");
    const zax = document.getElementById("zaxis");
    const activ =  document.getElementById("activity");
    var act = "";
    //create a new sensor with frequency 1 Hz
    let sensor = new Accelerometer({frequency: 1});

    //start the sensor
    sensor.start();

    sensor.onreading = () => {
      //round the values with factor 3
      const factor = 10**3;
      var x = Math.round(sensor.x*factor)/factor;
      var y = Math.round(sensor.y*factor)/factor;
      var z = Math.round(sensor.z*factor)/factor;

      //visualize sensor values in the file
      xax.textContent = x.toString();
      yax.textContent = y.toString();
      zax.textContent = z.toString();

      var lastX = sensor.x;
      var lastY = sensor.y;
      var lastZ = sensor.z;

      setInterval(function(){
        //check if the difference between previous and last data is > 0.6
        if (lastX-sensor.x > 0.6 || sensor.x - lastX > 0.6 || lastY-sensor.y > 0.6 || sensor.y - lastY > 0.6 || lastZ-sensor.z > 0.6 || sensor.z - lastZ > 0.6 ){
          //user is not standing stil
          act = "not";
          activ.textContent = "Moving";
        }else{
          //user is standing still
          act = "still";
          activ.textContent = "Standing still";
        }
        
        //send the data to the server using the socket
        //socket.emit("activity",message);
      }, 1000);

      setInterval(function(){
        //update containing the last state is sent every 5 seconds to the hub
        //not every 1 s because the message limit is 8000/day
        if (act == "not"){
          //user is not standing stil
          var message = {
            state: "lastnot"
          };
          activ.textContent = "Moving";
        }else{
          //user is standing still
          var message = {
            state: "laststill"
          };
          activ.textContent = "Standing still";
        }
        
        //send the data to the server using the socket
        socket.emit("lastactivity",message);
      }, 5000);

      setInterval(function(){
        //update sent to the hub every 1 min
        if (act == "not"){
          //user is not standing stil
          var message = {
            state: "not"
          }
        }else{
          //user is standing still
          var message = {
            state: "still"
          }
        }
        //send the data to the server using the socket
        socket.emit("activity",message);
      }, 30000);
    }

  }else{
    document.getElementById("errorMessage").textContent = "Accelerometer not supported";
  }
});