'use strict';
var AWS = require("aws-sdk");
var sns = new AWS.SNS();

exports.handler = (event, context, callback) => {

    event.Records.forEach((record) => {
        console.log('Stream record: ', JSON.stringify(record, null, 2));

        if (record.eventName == 'INSERT') {
            var temp = JSON.stringify(record.dynamodb.NewImage.Temperature);
            var humidity = JSON.stringify(record.dynamodb.NewImage.Humidity);            
            const myObj = JSON.parse(temp);
            var x = myObj.S;
            const myObj2 = JSON.parse(humidity);
            var y = myObj2.S;
            if (temp == undefined)
                {
                    temp = {"S":"79"};
                }
            var temp2 = parseInt(x);
            var humidity2 = parseInt(y);
            var params = {
                Subject: 'An extreme dht reading - temp: ' + temp2 + ' humidity: ' + humidity2,
                Message: 'An extreme dht reading - temp: ' + x +  ' humidity: ' + y,
                TopicArn: 'arn:aws:sns:us-east-1:116401681764:dht'
            };
            if (temp2 <= 67 || humidity2 <= 10)
            {
                sns.publish(params, function(err, data) {
                    if (err) {
                        console.error("Unable to send message. Error JSON:", JSON.stringify(err, null, 2));
                    } else {
                        console.log("Results from sending message: ", JSON.stringify(data, null, 2));
                    }
                });
            }
        }
    });
    callback(null, `Successfully processed ${event.Records.length} records.`);
};   
