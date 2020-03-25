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
      this.maxLen = 50;
      this.timeData = new Array(this.maxLen);
      this.temperatureData = new Array(this.maxLen);
      this.humidityData = new Array(this.maxLen);
      this.wind_directionData = new Array(this.maxLen);
      this.wind_intensityData = new Array(this.maxLen);
      this.rainData = new Array(this.maxLen);
    }

    addData(time, temperature, humidity, wind_direction, wind_intensity, rain) {
      this.timeData.push(time);
      this.temperatureData.push(temperature);
      this.humidityData.push(humidity);
      this.wind_directionData.push(wind_direction);
      this.wind_intensityData.push(wind_intensity);
      this.rainData.push(rain);

      if (this.timeData.length > this.maxLen) {
        this.timeData.shift();
        this.temperatureData.shift();
        this.humidityData.shift();
        this.wind_directionData.shift();
        this.wind_intensityData.shift();
        this.rainData.shift();
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
  const chartDataTemp = {
    datasets: [{
      fill: false,
      label: 'Temperature',
      yAxisID: 'Temperature',
      borderColor: 'rgba(255, 204, 0, 1)',
      pointBoarderColor: 'rgba(255, 204, 0, 1)',
      backgroundColor: 'rgba(255, 204, 0, 0.4)',
      pointHoverBackgroundColor: 'rgba(255, 204, 0, 1)',
      pointHoverBorderColor: 'rgba(255, 204, 0, 1)',
      spanGaps: true,
    }]
  };

  const chartOptionsTemp = {
    scales: {
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'Temperature (ºC)',
          display: true,
        },
        position: 'left',
        ticks:{
          min: -50,
          max: 50,
          stepSize:10,
        }
      }]
    }
  };

  const chartDataHum = {
    datasets: [{
        fill: false,
        label: 'Humidity',
        yAxisID: 'Humidity',
        borderColor: 'rgba(24, 120, 240, 1)',
        pointBoarderColor: 'rgba(24, 120, 240, 1)',
        backgroundColor: 'rgba(24, 120, 240, 0.4)',
        pointHoverBackgroundColor: 'rgba(24, 120, 240, 1)',
        pointHoverBorderColor: 'rgba(24, 120, 240, 1)',
        spanGaps: true,
    }]
  };

  const chartOptionsHum = {
    scales: {
      yAxes: [{
        id: 'Humidity',
        type: 'linear',
        scaleLabel: {
          labelString: 'Humidity (%)',
          display: true,
        },
        position: 'left',
        ticks:{
          min: 0,
          max: 100,
          stepSize:10,
        }
      }]
    }
  };

  const chartDataWD = {
    datasets: [{
      fill: false,
      label: 'Wind Direction',
      yAxisID: 'WindDirection',
      borderColor: 'rgba(0, 255, 150, 1)',
      pointBoarderColor: 'rgba(0, 255, 150, 1)',
      backgroundColor: 'rgba(0, 255, 150, 0.4)',
      pointHoverBackgroundColor: 'rgba(0, 255, 150, 1)',
      pointHoverBorderColor: 'rgba(0, 255, 150, 1)',
      spanGaps: true,
    }]
  };

  const chartOptionsWD = {
    scales: {
      yAxes: [{
        id: 'WindDirection',
        type: 'linear',
        scaleLabel: {
          labelString: 'Wind Direction (°)',
          display: true,
        },
        position: 'left',
        ticks:{
          min: 0,
          max: 360,
          stepSize:36,
        }
      }]
    }
  };

  const chartDataWI = {
    datasets: [{
      fill: false,
      label: 'Wind Intensity',
      yAxisID: 'WindIntensity',
      borderColor: 'rgba(255, 0, 0, 1)',
      pointBoarderColor: 'rgba(255, 0, 0, 1)',
      backgroundColor: 'rgba(255, 0, 0, 0.4)',
      pointHoverBackgroundColor: 'rgba(255, 0, 0, 1)',
      pointHoverBorderColor: 'rgba(255, 0, 0, 1)',
      spanGaps: true,
    }]
  };

  const chartOptionsWI = {
    scales: {
      yAxes: [{
        id: 'WindIntensity',
        type: 'linear',
        scaleLabel: {
          labelString: 'Wind Intensity (m/s)',
          display: true,
        },
        position: 'left',
        ticks:{
          min: 0,
          max: 100,
          stepSize:10,
        }
      }]
    }
  };

  const chartDataRain = {
    datasets: [{
      fill: false,
      label: 'Rain Height',
      yAxisID: 'Rain',
      borderColor: 'rgba(200, 0, 200, 1)',
      pointBoarderColor: 'rgba(200, 0, 200, 1)',
      backgroundColor: 'rgba(200, 0, 200, 0.4)',
      pointHoverBackgroundColor: 'rgba(200, 0, 200, 1)',
      pointHoverBorderColor: 'rgba(200, 0, 200, 1)',
      spanGaps: true,
    }]
  };

  const chartOptionsRain = {
    scales: {
      yAxes: [{
        id: 'Rain',
        type: 'linear',
        scaleLabel: {
          labelString: 'Rain (mm/h)',
          display: true,
        },
        position: 'left',
        ticks:{
          min: 0,
          max: 50,
          stepSize:5,
        }
      }]
    }
  };
  
  // Get the context of the canvas element we want to select
  const ctxhum = document.getElementById('iotChartHum').getContext('2d');
  const ctxtemp = document.getElementById('iotChartTemp').getContext('2d');
  const ctxwi = document.getElementById('iotChartWI').getContext('2d');
  const ctxwd = document.getElementById('iotChartWD').getContext('2d');
  const ctxrain = document.getElementById('iotChartRain').getContext('2d');

  const chartHum = new Chart(
    ctxhum,
    {
      type: 'line',
      data: chartDataHum,
      options: chartOptionsHum
    }
  );

  const chartTemp = new Chart(
    ctxtemp,
    {
      type: 'line',
      data: chartDataTemp,
      options: chartOptionsTemp,
    }
  );
  const chartWI = new Chart(
    ctxwi,
    {
      type: 'line',
      data: chartDataWI,
      options: chartOptionsWI,
    }
  );
  const chartWD= new Chart(
    ctxwd,
    {
      type: 'line',
      data: chartDataWD,
      options: chartOptionsWD,
    }
  );
  const chartRain = new Chart(
    ctxrain,
    {
      type: 'line',
      data: chartDataRain,
      options: chartOptionsRain,
    }
  );


  // Manage a list of devices in the UI, and update which device data the chart is showing
  // based on selection
  let needsAutoSelect = true;
  const deviceCount = document.getElementById('deviceCount');
  const listOfDevices = document.getElementById('listOfDevices');
  function OnSelectionChange() {
    const device = trackedDevices.findDevice(listOfDevices[listOfDevices.selectedIndex].text);

    chartDataHum.labels = device.timeData;
    chartDataHum.datasets[0].data = device.humidityData;

    chartDataTemp.labels = device.timeData;
    chartDataTemp.datasets[0].data = device.temperatureData;

    chartDataWD.labels = device.timeData;
    chartDataWD.datasets[0].data = device.wind_directionData;

    chartDataWI.labels = device.timeData;
    chartDataWI.datasets[0].data = device.wind_intensityData;

    chartDataRain.labels = device.timeData;
    chartDataRain.datasets[0].data = device.rainData;
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
        existingDeviceData.addData(messageData.MessageDate, messageData.IotData.temperature, messageData.IotData.humidity, messageData.IotData.wind_direction, messageData.IotData.wind_intensity, messageData.IotData.rain);
      } else {
        const newDeviceData = new DeviceData(messageData.DeviceId);
        trackedDevices.devices.push(newDeviceData);
        const numDevices = trackedDevices.getDevicesCount();
        deviceCount.innerText = numDevices === 1 ? `${numDevices} device` : `${numDevices} devices`;
        newDeviceData.addData(messageData.MessageDate, messageData.IotData.temperature, messageData.IotData.humidity, messageData.IotData.wind_direction, messageData.IotData.wind_intensity, messageData.IotData.rain);

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

      chartHum.update();
      chartTemp.update();
      chartWD.update();
      chartWI.update();
      chartRain.update();
    } catch (err) {
      console.error(err);
    }
  };
});
