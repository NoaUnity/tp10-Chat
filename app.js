//#region REQUIRE

//var events = require('events');
const net = require('net');
const colors = require("colors");
//const { createInterface } = require('readline');

//#endregion REQUIRE

//#region variables

let clients = [];
let ids = [];
let target = "";
let message = "";
let logMsg = "";
let newPeople = "";
let listPeople = "Liste des participants : ";
let listClean = "";
const mainHelp = "[HELP]    @ID => private message to ID \n          $q => quit server \n          $kID => kick ID (admin only) \n          $h => command list\n";
const optHelp = "[HELP]    $q => quit server \n          $kID => kick ID (admin only) \n          $h => command list\n";
let flagIdExist = false;
let adminExist = false;


//#endregion variables

//#region functions

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
function generateId(length) {
    let output;
    do{
        output = "";
        for(var i = 0;i<length;i++) {
        output += randomInt(0,9);
        }
    } while (ids.includes(output) === true);
    
    ids.push(output);
    listPeople +="[" + output + "] ";
    listClean = listPeople + "\n\n";

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



//#endregion functions


//#region MAIN

var server = net.createServer(function(client) {
    client.write("\nBienvenue sur le Chat ! \n[tapez $h pour acceder a l'aide]\r\n\n".grey);

    if(adminExist === false){
        client.write("Votre ID : 00 \nVous êtes l'admin\nVous pouvez utiliser $kId pour exclure un ID\n\n".red);
        client.unique_id = "00";
        clients.push(client);
        ids.push(client.unique_id);
        listPeople +="[00] ";
        listClean = listPeople + "\n\n";
        console.log("admin [00] connecté".green);
        adminExist = true;
    }
    else{
        client.unique_id = generateId(2);
        newPeople = "Nouvel utilisateur connecté ! : " + client.unique_id + "\n\n";
        client.write("Votre ID : ".red + client.unique_id.red + "\n\n");
        client.write(listClean.green);
        clients.push(client);
        sendToAll(newPeople.cyan, client);
        sendToAll(listClean.green, client);
        console.log(newPeople.cyan);
        console.log(listClean.green);
    }
    
    

    client.on('data', function(data) {
        
        data = data.toString();
        
        if(data[0] === '@'){
            target = data[1] + data[2];
            clients.forEach(test => {
                if(target === test.unique_id)
                {
                    flagIdExist = true;
                    if(target === client.unique_id){
                        message = "Vous avez entré votre propre Id\n";
                        client.write(message.red);
                    }
                    else{
                        data = data.substr(1);
                        data = data.substr(1);
                        data = data.substr(1);
                        data = data.substr(1);
                        message = client.unique_id + " a dit : " + data;
                        logMsg = "(To " + test.unique_id + " only) " + message;
                        test.write(message.blue);
                        console.log(logMsg.blue);
                    }
                }
            })

            if(flagIdExist === false){
                message = "L'Id [" + target + "] n'existe pas / n'est pas connecté\n";
                client.write(message.red);
            }

            flagIdExist = false;

        }
        else if(data[0] === '$'){
            switch(data[1]) {
                case "q":
                    message = "Au revoir !\n\n";
                    client.write(message.red);
                    logMsg = "L'utilisateur [" + client.unique_id + "] s'est déconnecté\n\n";
                    message = logMsg;
                    sendToAll(message.red,client);
                    console.log(logMsg.red);
                    client.destroy();
                    break;

                case "k":
                    if(client.unique_id === "00"){
                        target = data[2] + data[3];
                        if(target === client.unique_id){
                            message = "Vous avez entré votre propre Id\n";
                            client.write(message.red);
                        }
                        else{
                            clients.forEach(test => {
                                if(target === test.unique_id){
                                    message = "\nVous avez été exclu par l'admin\n\n";
                                    test.write(message.red);
                                    test.destroy();
                                    message = "Vous avez exclu [" + test.unique_id + "]\n\n";
                                    client.write(message.red);
                                    
                                    logMsg = "L'utilisateur [" + test.unique_id + "] a été exclu par l'admin\n\n";
                                    message = logMsg;
                                    console.log(logMsg.red);
                                    sendToAll(message.red,client);
                                }
                            })
                        }
                        
                    }
                    else{
                        message = "Vous n'avez pas les droits admin\n";
                        client.write(message.red);
                    }
                    break;

                case "h":
                    client.write(mainHelp.gray);
                    break;

                
                default:
                    client.write(optHelp.gray);
                    break;
            }

        }
        else{
            message = client.unique_id + " a dit : " + data;
            logMsg = "(To All) " + message;
            sendToAll(message.gray,client);
            console.log(logMsg.gray);
        }
        
    });

});

server.listen(3000,function(){
    console.log("Server started...", server.address().port, server.address().address, "\n");
});

//#endregion MAIN