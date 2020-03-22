import os
import asyncio
from azure.iot.device.aio import IoTHubDeviceClient
from azure.iot.device import Message
import random
import time
# Fetch the connection string from an enviornment variable
CONNECTION_STRING = os.getenv("IOTHUB_DEVICE_CONNECTION_STRING")

MSG_TXT = '{{"temperature": {temperature},"humidity": {humidity},"wind_direction": {wind_direction},"wind_intensity":{wind_intensity},"rain":{rain}}}'

def generate_weather():
    """
    it generates random temperature[-50,50], humidity [0,100], wind direction [0,360], wind intensity [0,100], rain [0,50]
    """
    t = random.uniform(-50.0,50.01)
    te = round(t,2)
    temp = te
    h = random.randint(0,100)
    hum = h
    w_d = random.randint(0,360)
    wind_dir = w_d
    w_i = random.randint(0,100)
    wind_int = w_i
    r = random.randint(0,50)
    rain = r
    
    return temp, hum, wind_dir, wind_int, rain

async def main():
    # Create instance of the device client using the authentication provider
    device_client = IoTHubDeviceClient.create_from_connection_string(CONNECTION_STRING)

    # Connect the device client.
    await device_client.connect()

    temp,hum,wind_dir,wind_int,rain = generate_weather()
    msg_txt_formatted = MSG_TXT.format(temperature=temp, humidity=hum,wind_direction=wind_dir,wind_intensity=wind_int,rain=rain)
    message = Message(msg_txt_formatted)

    # Send the message
    print("Sending message...")
    await device_client.send_message(message)
    print("Message successfully sent!")
    print(message)

    # finally, disconnect
    await device_client.disconnect()


if __name__ == "__main__":
    asyncio.run(main())