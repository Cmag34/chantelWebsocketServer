const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Map();

//code mostly from https://ably.com/blog/web-app-websockets-nodejs

wss.on("connection", (wss) => {
  const id = uuidv4();
  const color = Math.floor(Math.random() * 360);
  const metadata = { id, color };

  clients.set(wss, metadata);
  console.log("connected, ID " + id);

  wss.on("message", (message) => {
    console.log(`Received message => ${message}`);

    //loop through all clients map and send each client the message
    [...clients.keys()].forEach((client) => {
      console.log("sending message to client ");

      //only send message to other clients
      if (client !== wss){
        client.send(message);
      }
    });
  });
  
  wss.on("close", () => {
    console.log("client disconnect")
    clients.delete(wss);
  });
});

//create unique ID for each connection 
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
