/* eslint-disable max-classes-per-file */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
$(document).ready(() => {
  // if deployed to a site supporting SSL, use wss://
  const protocol = document.location.protocol.startsWith('https') ? 'wss://' : 'ws://';
  const webSocket = new WebSocket(protocol + location.host);

  // A class for holding the last 60 points of telemetry for a device
  class DeviceData {
    constructor(deviceId) {
      this.deviceId = deviceId;
      this.maxLen = 60;
      this.timeData = new Array(this.maxLen);
      this.xData = new Array(this.maxLen);
    }

    addData(time, x) {
      this.timeData.push(time);
      this.xData.push(x);

      if (this.timeData.length > this.maxLen) {
        this.timeData.shift();
        this.xData.shift();
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
  const chartDataX = {
    datasets: [{
      fill: false,
      label: '0 Standing still, 1 Moving',
      yAxisID: 'UserActivity',
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
  const cctxx = document.getElementById('iotChartX').getContext('2d');
  const ctxactivity = document.getElementById('activity');

  ctxactivity.textContent= "Now user is standing still";

  const chartX = new Chart(
    cctxx,
    {
      type: 'line',
      data: chartDataX,
      options: chartOptionsX,
    }
  );

  // Manage a list of devices in the UI, and update which device data the chart is showing
  // based on selection
  let needsAutoSelect = true;
  const deviceCount = document.getElementById('deviceCount');
  const listOfDevices = document.getElementById('listOfDevices');
  function OnSelectionChange() {
    const device = trackedDevices.findDevice(listOfDevices[listOfDevices.selectedIndex].text);

    chartDataX.labels = device.timeData;
    chartDataX.datasets[0].data = device.xData;
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
        //add still to the chart
        if (messageData.IotData.state=="still"){
          existingDeviceData.addData(messageData.MessageDate, 0);
        }
        //last value received is still, so visualize it in a span
        else if(messageData.IotData.state=="laststill"){
          ctxactivity.textContent= "Now user is standing still";
        }
        //last value received is NOT still, so visualize it in a span
        else if(messageData.IotData.state=="lastnot"){
          ctxactivity.textContent= "Now user is moving";
        }
        //add moving to the chart
        else{
          existingDeviceData.addData(messageData.MessageDate, 1);
        }
      } else {
        const newDeviceData = new DeviceData(messageData.DeviceId);
        trackedDevices.devices.push(newDeviceData);
        const numDevices = trackedDevices.getDevicesCount();
        deviceCount.innerText = numDevices === 1 ? `${numDevices} device` : `${numDevices} devices`;
        //add still to the chart
        if (messageData.IotData.state=="still"){
          existingDeviceData.addData(messageData.MessageDate, 0);
        }else
        //last value received is still, so visualize it
        if(messageData.IotData.state=="laststill"){
          ctxactivity.textContent= "Now user is standing still";
        }
        //last value received is NOT still, so visualize it in a span
        else if(messageData.IotData.state=="lastnot"){
          ctxactivity.textContent= "Now user is moving";
        }
        //add moving to the chart
        else{
          existingDeviceData.addData(messageData.MessageDate, 1);
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
      chartX.update();
    } catch (err) {
      console.error(err);
    }
  };
});