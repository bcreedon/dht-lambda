'use strict';
var AWS = require("aws-sdk");
var sns = new AWS.SNS();

exports.handler = (event, context, callback) => {

    event.Records.forEach((record) => {
        console.log('Stream record: ', JSON.stringify(record, null, 2));

        if (record.eventName == 'INSERT') {
            var temp = JSON.stringify(record.dynamodb.NewImage.Temperature);
            if (temp == null)
                {
                    temp = {"S":"79"};
                }
            var temp2 = parseInt(temp.S); 
            var params = {
                Subject: 'A new dht temp: ' + temp2,
                Message: 'A new dht temp: ' + temp2,
                TopicArn: 'arn:aws:sns:us-east-1:116401681764:dht'
            };
            if (temp2 <= 80)
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
