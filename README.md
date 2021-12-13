# dht-lambda

About:
AWS Lambda to take data published from RPi DHT-22 sensor into DynamoDB that feeds a DynamoDb stream. This Lambda processes new records as they come in. 
If the temperature is below a certain level, a message is sent via SNS.
