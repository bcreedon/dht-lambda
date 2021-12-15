'use strict';
var AWS = require("aws-sdk");
var sns = new AWS.SNS();
var s3 = new AWS.S3();

exports.handler = (event, context, callback) => {

    event.Records.forEach((record) => {
        console.log('Stream record: ', JSON.stringify(record, null, 2));

        if (record.eventName == 'INSERT') {
            var temp = JSON.stringify(record.dynamodb.NewImage.Temperature);
            if (temp == undefined)
                {
                  var temp = '{"S":"79"}';
                }
            var humidity = JSON.stringify(record.dynamodb.NewImage.Humidity);
            if (humidity == undefined)
                {
                  var humidity = '{"S":"79"}';
                }            
            const myObj = JSON.parse(temp);
            var x = myObj.S;
            const myObj2 = JSON.parse(humidity);
            var y = myObj2.S;
            var temp2 = parseInt(x);
            var humidity2 = parseInt(y);
            var params = {
                Subject: 'An extreme dht reading - temp: ' + temp2 + ' humidity: ' + humidity2,
                Message: 'An extreme dht reading - temp: ' + x +  ' humidity: ' + y,
                TopicArn: 'arn:aws:sns:us-east-1:116401681764:dht'
            };
            const d = new Date(Date().toLocaleString("en-US", { timeZone: "America/Phoenix" }));;
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
            var s3params = {
            Bucket : 'zzz',
            Key: 'dht/' + d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getTime(),            
            Body: JSON.stringify(record.dynamodb.NewImage),
            ContentType: 'application/json; charset=utf-8'
            }
            s3.putObject(s3params, function(err, data) {
              if (err) console.log(err, err.stack); // an error occurred
              else     console.log(data);           // successful response
            });
        }
    });
    callback(null, `Successfully processed ${event.Records.length} records.`);
};   
