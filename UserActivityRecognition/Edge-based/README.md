# Edge-based implementation
In edge-based implementation the computations to determine if the user is standing still or not are done in the webapp itself. The hub will be receive only the resulting activity of the user.

## Important elements of the repository

* **server.js** starts the whole web app, gets the messages from the smartphone and sends them to the hub
* public
  * **index.html** contains the webpage that you see
  * **accelerometer.js** reads the values of the accelerometer of the smartphone and sends them to the server
* webapp
  * **server.js** is the core part of data visualization. It connects to the IoT hub, calls the function that reads the messages arrived at the hub and reorganize them.
  * public
    * **index.html** contains the webpage that you see.
    * js
        * **chart-device-data.js** describes how the charts are visualized and how the number of the devices is handled.

## Requirements 
* Azure
    * IoT hub
    * Azure web app
* Nodejs
    * npm installed 
    * "@azure/event-hubs" extension of npm
    * connection string of the IoT hub (not the device connection string!) set as environment parameter
    * consumer group set as environment parameter
    
## How to use it
1. Run https://clouduseractivityrecognition.azurewebsites.net/ in the browser of your smartphone (PCs don't have accelerometer)
2. Open a terminal in webapp folder and run `npm install` and `npm start`.
3. Open your browser on http://localhost:3000 and visualize data.

## Tutorial
For more information check out the [tutorial](https://www.hackster.io/domitix/user-activity-recognition-with-azure-4f7c34) and watch the [video](https://www.youtube.com/watch?v=OGusVpQa6ug).
