# dht-lambda

About:
AWS lambda to take data published from RPi DHT-22 sensor into DynamoDB ans takes data from a DynamoDb stream and captures new records. 
If the temperature is below a certain level, a message is sent via SNS.
