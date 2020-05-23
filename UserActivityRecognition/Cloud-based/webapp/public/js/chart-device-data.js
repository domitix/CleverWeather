/* eslint-disable max-classes-per-file */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
$(document).ready(() => {
  // if deployed to a site supporting SSL, use wss://
  const protocol = document.location.protocol.startsWith('https') ? 'wss://' : 'ws://';
  const webSocket = new WebSocket(protocol + location.host);

  // A class for holding the last 50 points of telemetry for a device
  class DeviceData {
    constructor(deviceId) {
      this.deviceId = deviceId;
      this.maxLen = 120;
      this.timeData = new Array(this.maxLen);
      this.xData = new Array(this.maxLen);
      this.yData = new Array(this.maxLen);
      this.zData = new Array(this.maxLen);
      this.actData = new Array(this.maxLen);
    }

    addData(time, x, y, z,act) {
      this.timeData.push(time);
      this.xData.push(x);
      this.yData.push(y);
      this.zData.push(z);
      this.actData.push(act);

      if (this.timeData.length > this.maxLen) {
        this.timeData.shift();
        this.xData.shift();
        this.yData.shift();
        this.zData.shift();
        this.actData.shift();
      }

    }
  }

  // All the devices in the list (those that have been sending telemetry)
  class TrackedDevices {
    constructor() {
      this.devices = [];
    }

    // Find a device based on its Id
    findDevice(deviceId) {
      for (let i = 0; i < this.devices.length; ++i) {
        if (this.devices[i].deviceId === deviceId) {
          return this.devices[i];
        }
      }

      return undefined;
    }

    getDevicesCount() {
      return this.devices.length;
    }
  }

  const trackedDevices = new TrackedDevices();

  // Define the chart axes and the options
  // X axis
  const chartDataX = {
    datasets: [{
      fill: false,
      label: 'Accelerometer on X axis',
      yAxisID: 'Xaxis',
      borderColor: 'rgba(255, 204, 0, 1)',
      pointBoarderColor: 'rgba(255, 204, 0, 1)',
      backgroundColor: 'rgba(255, 204, 0, 0.4)',
      pointHoverBackgroundColor: 'rgba(255, 204, 0, 1)',
      pointHoverBorderColor: 'rgba(255, 204, 0, 1)',
      spanGaps: true,
    }]
  };

  const chartOptionsX = {
    scales: {
      yAxes: [{
        id: 'Xaxis',
        type: 'linear',
        scaleLabel: {
          labelString: 'm/s^2',
          display: true,
        },
        position: 'left',
        ticks:{
          min: -2,
          max: 20,
          stepSize: 5,
        }
      }]
    }
  };

  // Y axis
  const chartDataY = {
    datasets: [{
        fill: false,
        label: 'Accelerometer on Y axis',
        yAxisID: 'Yaxis',
        borderColor: 'rgba(24, 120, 240, 1)',
        pointBoarderColor: 'rgba(24, 120, 240, 1)',
        backgroundColor: 'rgba(24, 120, 240, 0.4)',
        pointHoverBackgroundColor: 'rgba(24, 120, 240, 1)',
        pointHoverBorderColor: 'rgba(24, 120, 240, 1)',
        spanGaps: true,
    }]
  };

  const chartOptionsY = {
    scales: {
      yAxes: [{
        id: 'Yaxis',
        type: 'linear',
        scaleLabel: {
          labelString: 'm/s^2',
          display: true,
        },
        position: 'left',
        ticks:{
          min: -2,
          max: 20,
          stepSize: 5,
        }
      }]
    }
  };

  //Z axis
  const chartDataZ = {
    datasets: [{
      fill: false,
      label: 'Accelerometer on Z axis',
      yAxisID: 'Zaxis',
      borderColor: 'rgba(0, 255, 150, 1)',
      pointBoarderColor: 'rgba(0, 255, 150, 1)',
      backgroundColor: 'rgba(0, 255, 150, 0.4)',
      pointHoverBackgroundColor: 'rgba(0, 255, 150, 1)',
      pointHoverBorderColor: 'rgba(0, 255, 150, 1)',
      spanGaps: true,
    }]
  };

  const chartOptionsZ = {
    scales: {
      yAxes: [{
        id: 'Zaxis',
        type: 'linear',
        scaleLabel: {
          labelString: 'm/s^2',
          display: true,
        },
        position: 'left',
        ticks:{
          min: -2,
          max: 20,
          stepSize: 5,
        }
      }]
    }
  };

  // activities
  const chartDataAct= {
    datasets: [{
      fill: false,
      label: '0 Standing still, 1 Moving',
      yAxisID: 'UserActivity',
      borderColor: 'rgba(0, 0, 0, 1)',
      pointBoarderColor: 'rgba(0, 0, 0, 1)',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      pointHoverBackgroundColor: 'rgba(0, 0, 0, 1)',
      pointHoverBorderColor: 'rgba(0, 0, 0, 1)',
      spanGaps: true,
    }]
  };

  const chartOptionsAct = {
    scales: {
      yAxes: [{
        id: 'UserActivity',
        type: 'linear',
        scaleLabel: {
          labelString: 'Standing still or not',
          display: true,
        },
        position: 'left',
        ticks:{
          min: 0,
          max: 1,
          stepSize: 1,
        }
      }]
    }
  };
  
  // Get the context of the canvas element we want to select
  const ctxx = document.getElementById('iotChartX').getContext('2d');
  const ctxy = document.getElementById('iotChartY').getContext('2d');
  const ctxz = document.getElementById('iotChartZ').getContext('2d');
  const ctxact = document.getElementById('lastHourActivity').getContext('2d');
  const latx = document.getElementById('latestX');
  const laty = document.getElementById('latestY');
  const latz = document.getElementById('latestZ');
  const nowActivity = document.getElementById('activity');
  
  //activity
  const chartAct = new Chart(
    ctxact,
    {
      type: 'line',
      data: chartDataAct,
      options: chartOptionsAct,
    }
  );

  //Z axis
  const chartY = new Chart(
    ctxy,
    {
      type: 'line',
      data: chartDataY,
      options: chartOptionsY
    }
  );
  
  //X axis
  const chartX = new Chart(
    ctxx,
    {
      type: 'line',
      data: chartDataX,
      options: chartOptionsX,
    }
  );
  
  //Z axis
  const chartZ= new Chart(
    ctxz,
    {
      type: 'line',
      data: chartDataZ,
      options: chartOptionsZ,
    }
  );


  // Manage a list of devices in the UI, and update which device data the chart is showing
  // based on selection
  let needsAutoSelect = true;
  const deviceCount = document.getElementById('deviceCount');
  const listOfDevices = document.getElementById('listOfDevices');
  function OnSelectionChange() {
    const device = trackedDevices.findDevice(listOfDevices[listOfDevices.selectedIndex].text);

    chartDataY.labels = device.timeData;
    chartDataY.datasets[0].data = device.yData;

    chartDataX.labels = device.timeData;
    chartDataX.datasets[0].data = device.xData;

    chartDataZ.labels = device.timeData;
    chartDataZ.datasets[0].data = device.zData;

    chartDataAct.labels = device.timeData;
    chartDataAct.datasets[0].data = device.actData;
  }

  listOfDevices.addEventListener('change', OnSelectionChange, false);

  // When a web socket message arrives:
  // 1. Unpack it
  // 2. Find or create a cached device to hold the telemetry data
  // 3. Append the telemetry data
  // 4. Update the chart UI
  webSocket.onmessage = function onMessage(message) {
    try {
      const messageData = JSON.parse(message.data);
      console.log(messageData);

      // find or add device to list of tracked devices
      const existingDeviceData = trackedDevices.findDevice(messageData.DeviceId);

      if (existingDeviceData) {
        //last value arrived to visualize
        if (messageData.IotData.lastxaxis){
          //insert the values in the spans
          latx.textContent = messageData.IotData.lastxaxis.toString();
          laty.textContent = messageData.IotData.lastyaxis.toString();
          latz.textContent = messageData.IotData.lastzaxis.toString();

          diffX = lastX-messageData.IotData.lastxaxis;
          diffY = lastY-messageData.IotData.lastyaxis;
          diffZ = lastZ-messageData.IotData.lastzaxis;

          //check if the difference between the last value arrived is within [-0.6,0.6]. 
          //if not, the user is moving
          if (diffX > 0.6 || diffY > 0.6 || diffZ > 0.6 || diffX <-0.6 || diffY <-0.6 || diffZ <-0.6){
            nowActivity.textContent = "Moving";
          }
          else{
            nowActivity.textContent= "Standing still";
          }
          //update the last value
          lastX = messageData.IotData.lastxaxis;
          lastY = messageData.IotData.lastyaxis;
          lastZ = messageData.IotData.lastzaxis;
        }else if (messageData.IotData.xaxis){
          //values to visualize in the charts
          diffprevX = prevX - messageData.IotData.xaxis;
          diffprevY = prevY - messageData.IotData.yaxis;
          diffprevZ = prevZ - messageData.IotData.zaxis;
          
          //check if the difference between the last value arrived is within [-0.6,0.6]. 
          //if not, the user is moving
          if (diffX > 0.6 || diffY > 0.6 || diffZ > 0.6 || diffX <-0.6 || diffY <-0.6 || diffZ <-0.6){
            existingDeviceData.addData(messageData.MessageDate, messageData.IotData.xaxis, messageData.IotData.yaxis, messageData.IotData.zaxis,1);
          }
          else{
            existingDeviceData.addData(messageData.MessageDate, messageData.IotData.xaxis, messageData.IotData.yaxis, messageData.IotData.zaxis,0);
          }
          //update the value of previous X, Y and Z
          prevX = messageData.IotData.xaxis;
          prevY = messageData.IotData.yaxis;
          prevZ = messageData.IotData.zaxis;

        }
        
      } else {
        const newDeviceData = new DeviceData(messageData.DeviceId);
        trackedDevices.devices.push(newDeviceData);
        const numDevices = trackedDevices.getDevicesCount();
        deviceCount.innerText = numDevices === 1 ? `${numDevices} device` : `${numDevices} devices`;
        //last value arrived to visualize
        if (messageData.IotData.lastxaxis){
          var lastX = messageData.IotData.lastxaxis;
          var lastY = messageData.IotData.lastyaxis;
          var lastZ = messageData.IotData.lastzaxis;
          
          //insert the values in the spans
          latx.textContent = messageData.IotData.lastxaxis.toString();
          laty.textContent = messageData.IotData.lastyaxis.toString();
          latz.textContent = messageData.IotData.lastzaxis.toString();
          nowActivity.textContent= "Standing still";
        
        }else if (messageData.IotData.xaxis){
          //values to visualize in the charts

          //compute previous values
          var prevX = messageData.IotData.xaxis;
          var prevY = messageData.IotData.yaxis;
          var prevZ = messageData.IotData.zaxis;
          
          if (nowActivity.textContent == "Standing still"){
            //add the values to the charts + 0 for standing still
            newDeviceData.addData(messageData.MessageDate, messageData.IotData.xaxis, messageData.IotData.yaxis, messageData.IotData.zaxis,0);
          }
          else{
            //add the values to the charts + 1 for moving
            newDeviceData.addData(messageData.MessageDate, messageData.IotData.xaxis, messageData.IotData.yaxis, messageData.IotData.zaxis,1);
          }
  
        }
        // add device to the UI list
        const node = document.createElement('option');
        const nodeText = document.createTextNode(messageData.DeviceId);
        node.appendChild(nodeText);
        listOfDevices.appendChild(node);

        // if this is the first device being discovered, auto-select it
        if (needsAutoSelect) {
          needsAutoSelect = false;
          listOfDevices.selectedIndex = 0;
          OnSelectionChange();
        }
      }

      //update the charts
      chartY.update();
      chartX.update();
      chartZ.update();
      chartAct.update();
    } catch (err) {
      console.error(err);
    }
  };
});
