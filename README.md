# CleverWeather
## is an IoT app that allows you to create random values, send them to your Azure IoT hub and visualize them. 

## Important elements of the repository

* **publisher.py** randomly chooses a device to publish messages, creates random values for temperature, humidity, wind direction, wind intensity and send them to the IoT hub.
* webapp
    * **server.js** is the core part of the web app. It calls the function that reads the messages sent to the IoT hub, it loads the website etc.
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


## Tutorial
Follow the [tutorial](https://www.hackster.io/domitix/clever-weather-4fc8ec) and find out how to use CleverWeather.

