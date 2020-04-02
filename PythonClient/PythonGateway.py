import paho.mqtt.client as mqtt
from azure.iot.device import Message, IoTHubDeviceClient
import json

brokerPort = 1886
brokerAddress = "fec0:affe::1"
#connection_string1 = os.getenv("IOTHUB_DEV1_CONNECTION_STRING")
#connection_string1 = os.getenv("IOTHUB_DEV2_CONNECTION_STRING")
connection_string1 = "HostName=CleverWeather.azure-devices.net;DeviceId=foggia_2;SharedAccessKey=pMl04JINgind65gxMUToWPljlA94rnvasCtGWZ8Nzuo="
connection_string2 = "HostName=CleverWeather.azure-devices.net;DeviceId=rome_2;SharedAccessKey=O9m6s2yY/qA9RYrDNEcb13pSn7Q0nV+yjbKXRbP68vE="

def on_connect(client,userdata,flags,rc):
	"""
	when the gateway connects to RSMB, it also subscribes to 2 topics
	"""
	print("Gateway connected")
	brokerClient.subscribe("foggia_2")
	brokerClient.subscribe("rome_2")

def on_disconnect(client,userdata,rd):
	print("Gateway disconnected")

def on_message(client,userdata,msg):
	"""
	when a message arrives at the gateway, it is sent to the hub by the device specified in the topic
	"""
	dev = msg.topic
	pld = msg.payload
	mess = {'temperature': pld[0]-50,'humidity':pld[1],'wind_direction': pld[2], 'wind_intensity':pld[3],'rain':pld[4]}
	messaggio = json.dumps(mess)
	print(dev+ " sent " +messaggio)
	if (dev == "foggia_2"):
		hubClient1.send_message(messaggio)
	elif (dev == "rome_2"):
		hubClient2.send_message(messaggio)
	print("Message forwarded to the hub")



if __name__=="__main__":
	#initialize the gateway and connect to the hub from 2 possible devices (fogia_2 and rome_2)
	hubClient1 = IoTHubDeviceClient.create_from_connection_string(connection_string1,websockets=True)
	hubClient1.connect()
	hubClient2 = IoTHubDeviceClient.create_from_connection_string(connection_string2,websockets=True)
	hubClient2.connect()


	#initialize the gateway and connect to the broker via MQTT
	brokerClient = mqtt.Client("PythonGateway",mqtt.MQTTv311)
	brokerClient.on_connect=on_connect
	brokerClient.on_disconnect=on_disconnect
	brokerClient.on_message = on_message
	brokerClient.connect(brokerAddress,brokerPort)

	brokerClient.loop_forever()

	#finally disconnect
	hubClient.disconnect()
	brokerClient.disconnect()
