//var events = require('events');
const net = require('net');
const colors = require("colors");
//const { createInterface } = require('readline');

let clients = [];
let target = "";
let message = "";
let logMsg = "";
let newPeople = "";


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


var server = net.createServer(function(client) {
    client.write("Bienvenue !\r\n");
    client.unique_id = generateId(3);
    newPeople = "Nouvel utilisateur connecté ! : " + client.unique_id + "\n";
    console.log(newPeople.cyan);
    client.write("Vous avez l'ID numero " + client.unique_id + "\n\n");
    clients.push(client);

    client.on('data', function(data) {
        
        data = data.toString();
        
        if(data[0] === '@'){
            target = data[1] + data[2] + data[3];
            clients.forEach(test =>{
                if(target === test.unique_id)
                {
                    data = data.substr(1);
                    data = data.substr(1);
                    data = data.substr(1);
                    data = data.substr(1);
                    data = data.substr(1);
                    message = client.unique_id + " a dit : " + data;
                    logMsg = "(To " + test.unique_id + " only) " + message;
                    test.write(message.blue);
                    console.log(logMsg.blue);
                }
            })
        }
        else{
            message = client.unique_id + " a dit : " + data;
            logMsg = "(To All) " + message;
            sendToAll(message.green,client);
            console.log(logMsg.green);
        }
        
    });

});

server.listen(3000,function(){
    console.log("Server started...", server.address().port, server.address().address, "\n");
});