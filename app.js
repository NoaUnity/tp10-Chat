//var events = require('events');
const net = require('net');
const colors = require("colors");
//const { createInterface } = require('readline');

let clients = [];
let target = "";
let message = "";


function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
function generateId(length) {
    var output = "";
    for(var i = 0;i<length;i++) {
        output += randomInt(0,9);
    }
    return output;
}

function sendToAll(data,sender) {
    var size = clients.length;
    for(i=0;i<size;i++) {
        if(sender.unique_id !== clients[i].unique_id) {
            clients[i].write(data);
        }
    }
}

function sendToOne(data, sender, receiver) {
    clients.forEach(client => {
        if(client.unique_id === receiver){
            client.write(data);
        }
    });
}

var server = net.createServer(function(client) {
    console.log("New client: " + client.remoteAddress + "\n");
    client.write("Welcome!\r\n");
    client.unique_id = generateId(3);
    client.write("Vous avez l'ID numero " + client.unique_id + "\n\n");
    clients.push(client);

    client.on('data', function(data) {
        
        data = data.toString();
        console.log(data);
        if(data[0] === '@'){
            target = data[1] + data[2] + data[3];
            clients.forEach(test =>{
                if(target === test.unique_id)
                {
                    data = data.substr(1);
                    data = data.substr(1);
                    data = data.substr(1);
                    data = data.substr(1);
                    message = client.unique_id + " a dit : " + data;
                    test.write(message);
                }
            })
        }
        else{
            message = client.unique_id + " a dit : " + data;
            sendToAll(message,client);
        }
    });

});

server.listen(3000,function(){
    console.log("Server started...", server.address().port, server.address().address);
});