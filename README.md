# CleverWeather
#### IoT app that allows you to create random values, send them to your Azure IoT hub and visualize them. 


## Important elements of the repository

* **publisher.py** randomly chooses a device to publish messages, creates random values for temperature, humidity, wind direction, wind intensity and send them to the IoT hub.
* webapp
    * **server.js** is the core part of the web app. It connects to the IoT hub, calls the function that reads the messages arrived at the hub and reorganize them.
    * public
        * **index.html** contains the webpage that you see.
    * js
        * **chart-device-data.js** describes how the charts are visualized and how the number of the devices is handled.


## Requirements

* Azure
    * IoT hub
* Python
    * connection string to the IoT hub for every device set as environment parameter
    * "azure.iot.device" library
* Nodejs
    * npm installed 
    * "@azure/event-hubs" extension of npm
    * connection string of the IoT hub (not the device connection string!) set as environment parameter
    * consumer group set as environment parameter

## How to use it
### Simple modality with random values created by python
Go to the folder where there's publisher.py and write in the command line
`python publisher.py`
  
Open another command line, go in the webapp folder and write
`npm start`

At this point you can open your browser on http://localhost:3000 and visualize data.
 
### Random values created by RIOT app


## Tutorial
Follow the [tutorial](https://www.hackster.io/domitix/clever-weather-4fc8ec) and whatch the [video](https://youtu.be/TwIHceQEKSE) to find out how to use CleverWeather.

