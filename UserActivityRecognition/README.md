# User Activity Recognition with Azure 
User Activity Recognition with Azure  is a mobile web application that gathers data from the accelerometer, sends them to Azure IoT Hub and tells if the user is standing still or moving. Finally, you can visualized all the data in a Node.js application that runs in local.

The project consists of two separate parts: cloud-based and edge-based implementation. In **cloud-based** implementation the data of the accelerometer are sent to the hub and the computation of the user activity is at cloud level. In **edge-based** implementation, instead, the computation is done in the webapp and only the state of the activity is sent to the hub.
