var amqp = require('amqplib/callback_api');

var events = {}

events.init = function(socket){

    events.send = function(msg) {
        amqp.connect('amqp://20.20.20.20', function(err, conn) {
          conn.createChannel(function(err, ch) {
            var q = 'hello';

            ch.assertQueue(q, {durable: false});

            ch.sendToQueue(q, Buffer.from('Message = ' + msg));
            console.log(" [x] Sent message" + msg);
          });
        });
    }

    return events;
}

module.exports = events;
