# CleverWeather
#### IoT app that allows you to create random values, send them to your Azure IoT hub and visualize them. 
##### CleverWeather was created for Internet of Things course at Sapienza University of Rome.


## Important elements of the repository

* **publisher.py** randomly chooses a device to publish messages, creates random values for temperature, humidity, wind direction, wind intensity and send them to the IoT hub.
* webapp
    * **server.js** is the core part of the web app. It connects to the IoT hub, calls the function that reads the messages arrived at the hub and reorganize them.
    * public
        * **index.html** contains the webpage that you see.
    * js
        * **chart-device-data.js** describes how the charts are visualized and how the number of the devices is handled.
* CleverWeatherRIOTOS
   * **main.c** runs the RIOT app. Use publisher command to start publishing random messages in a topic of your choice.
* RSMB
   * **config.conf** is the configuration file of RSMB.
* LoRa
   * **main.c** RIOT app that connects to TTN using LoRaWAN protocol. Use "loramac publisher" command to start publishing random messages.
* Gateway
   * **PythonGateway.py** connects to RSMB and sends the messages received to the hub.
   * **TTNGateway.py** connects to TTN and sens messages received to the hub.
   * **TTNconfigurations.ini** configuration file for TTNGateway.py. Remember to fill it before running TTNGateway.py.
 

## Requirements

* Azure
    * IoT hub
* Python
    * connection string to the IoT hub for every device set as environment parameter
    * "azure.iot.device" library
    * "paho-mqtt" library
* RSMB
    * clone the [mosquitto.RSMB repository](https://github.com/eclipse/mosquitto.rsmb).
* RIOT-OS
    * all the requirements specified [here](https://github.com/RIOT-OS/Tutorials).
    * clone the [RIOT repository](https://github.com/RIOT-OS/RIOT).
* Nodejs
    * npm installed 
    * "@azure/event-hubs" extension of npm
    * connection string of the IoT hub (not the device connection string!) set as environment parameter
    * consumer group set as environment parameter
    

## How to use it
### Simple modality with random values created by python
1. Go to the folder where there's publisher.py and write in the command line
   `python publisher.py`
  
2. Open another command line, go in the webapp folder and write
   `npm start`

3. At this point you can open your browser on http://localhost:3000 and visualize data.
 
### Random values created by RIOT app and MQTTSN protocol
1. **Really Small Message Broker** 
   1. Compile the repository previously cloned:
      `cd rsmb/src`
      `make`

   2. Copy config.conf file contained in RSMB folder to mosquitto.rsmb/rsmb/src directory. From mosquitto.rsmb/rsmb/src directory execute   the Really Small Message Broker:
    `./broker_mqtts config.conf`

2. **RIOT app**
   1. Copy CleverWeatherRIOTOS folder into RIOT folder. Open a second teminal in RIOT directory and create tap0, tap1 devices and tapbr0 typing:
      `sudo ./RIOTDIR/dist/tools/tapsetup/tapsetup`
   2. To check if they have been correctly created:
      `ifconfig | grep tap`
   3. Assign a site-global prefix to the tapbr0:
      `sudo ip a a fec0:affe::1/64 dev tapbr0`

   4. To execute the app with tap0 device (you can also run it with tap1) from native:
   `cd CleverWeatherRIOTOS`
   `make all term PORT=tap0 BOARD=native`

   * During the execution of the app: 
      * assign a site-global address with the same prefix within the RIOT native instance:
         `ifconfig 5 add fec0:affe::99`
      * See all the possible commands of the app:
         `help`
      * Connect to the previously created broker at port 1885:
         `con fec0:affe::1 1885`
      * Start publishing messages with random values in <topic>:
         `publisher <topic> `

3. **Gateway**
   1. Open a third terminal, go to Gateway folder and type
      `python PythonGateway.py`

4. **Web app**
   1. Open another command line, go in the webapp folder and write
      `npm start`
   2. At this point you can open your browser on http://localhost:3000 and visualize data.
   
### Random values created by RIOT app and LoRaWAN protocol
1. **IoT-LAB and TTN app 
   1. Follow the [tutorial]()

2. **Gateway**
   1. Go to Gateway folder and fill TTNconfigurations.ini with the values of your TTN app, TTN devices and IoT Hub.
   2. Open another terminal there and type
      `python TTNGateway.py`
3. **Web app**
   1. Open another command line, go in the webapp folder and write
      `npm start`
   2. At this point you can open your browser on http://localhost:3000 and visualize data.


## Tutorial
Follow the [tutorial](https://www.hackster.io/domitix/clever-weather-4fc8ec) and whatch the [video](https://youtu.be/TwIHceQEKSE) to find out how to use **CleverWeather**.
<br/>For more information on **CleverWeatherRIOTOS**: [tutorial](https://www.hackster.io/domitix/cleverweather-with-riot-os-ada7fe) and [video](https://youtu.be/ikV0G87yPIo).
**CleverweatherLoRa** [tutorial]() and [video]().
