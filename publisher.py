import os
from azure.iot.device import Message, IoTHubDeviceClient
import random
import time
import json

def generate_weather():
    """
    it generates random values for temperature, humidity, wind direction, wind intensity and rain
    """
    t = random.uniform(-50.0,50.01)
    temp = round(t,2)
    hum = random.randint(0,100)
    wind_dir = random.randint(0,360)
    wind_int = random.randint(0,100)
    rain = random.randint(0,50)

    return temp, hum, wind_dir, wind_int, rain

def choose_device():
    """
    it randomly chooses between two different virtual stations: foggia_1 and rome_1.
    Fetch the connection string from an enviornment variable
    """
    prob = random.random()
    if (prob < 0.5):
        connection_string = os.getenv("IOTHUB_DEVICE1_CONNECTION_STRING")
    else:
        connection_string = os.getenv("IOTHUB_DEVICE2_CONNECTION_STRING")
    
    return connection_string

def publish_message(connection_string: str):
    """
    :connection_string is the connection string of the device to the IoT hub.
    It publishes messages to the IoT hub every 4 seconds.
    """
    # Create instance of the device client using the authentication provider
    device_client = IoTHubDeviceClient.create_from_connection_string(connection_string,websockets=True)

    
    # Connect the device client
    device_client.connect()
    while(True):
        try:
            temp,hum,wind_dir,wind_int,rain = generate_weather()

            #Generating the message to send
            msg = {'temperature': temp, 'humidity': hum,'wind_direction': wind_dir,'wind_intensity':wind_int,'rain':rain}
            message = json.dumps(msg)
            
            # Send the message
            print("Sending message...")
            device_client.send_message(message)
            print("Message successfully sent!")
            print(message)
            time.sleep(4)
        
        except KeyboardInterrupt:
            print("IoTHubClient stopped")
            return
        
        except:
            print("Unexpected error")
            time.sleep(4)

    # finally, disconnect
    device_client.disconnect()


if __name__ == "__main__":
    connection_string = choose_device()
    publish_message(connection_string)