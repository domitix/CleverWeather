import paho.mqtt.client as mqtt
from azure.iot.device import Message, IoTHubDeviceClient
import json
import base64
import configparser


def on_connect(client,userdata,flags,rc):
	print("Connected to TTN")
	client.subscribe('+/devices/+/up')

def on_message(client,userdata,msg):
	j_msg = json.loads(msg.payload.decode('utf-8'))
	dev_eui = j_msg['hardware_serial']
	mess = base64.b64decode(j_msg['payload_raw'])
	dev_id = str(j_msg['dev_id'])
	mess = {'temperature': int(mess[0])-50,'humidity':mess[1],'wind_direction': mess[2], 'wind_intensity':mess[3],'rain':mess[4]}
	messaggio = json.dumps(mess)
	print(dev_id+ " sent " +messaggio)
	if (dev_id == config['HUB']['Device1']):
		hub_client1.send_message(messaggio)
	elif (dev_id == config['HUB']['Device2']):
		hub_client2.send_message(messaggio)
	print("Message forwarded to the hub")


if __name__=="__main__":
	#load the configuration file
	config = configparser.ConfigParser()
	config.read('TTNconfigurations.ini')

	#connect to the hub
	hub_client1 = IoTHubDeviceClient.create_from_connection_string(config['HUB']['ConnectionString1'],websockets=True)
	hub_client1.connect()
	hub_client2 = IoTHubDeviceClient.create_from_connection_string(config['HUB']['ConnectionString2'],websockets=True)
	hub_client2.connect()

	#connect to ttn
	ttn_client = mqtt.Client()
	ttn_client.on_connect = on_connect
	ttn_client.on_message = on_message
	ttn_client.username_pw_set(config['TTN']['AppID'],config['TTN']['AccessKey'])
	ttn_client.connect(config['TTN']['Server'],int(config['TTN']['Port']),60)

	try:
		ttn_client.loop_forever()
	except KeyboardInterrupt:
		print('disconnect')
		ttn_client.disconnect()
		hub_client1.disconnect()
		hub_client2.disconnect()
