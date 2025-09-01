var express = require("express");
var app =  express();
var http = require("http");
const server = http.createServer(app);
const {Server} = require("socket.io");
var count = 1;

const io = new Server(server);

io.on("connection",(socket) => {
    console.log("Socket Connected");
    io.emit("countInc",{ count })
    // setInterval((44) => {
    // count++;
    // io.emit('presentCount',{ count });
    // },100);
});

// io.on("connection",(socket) => {
//     console.log("Socket Connected");
//     io.emit("countDec",{ count })
// });

app.get("/incCount",(req,res) => {
    count++;
    io.emit("countInc",{ count });
});

// app.get("/decCount",(req,res) => {
//     count--;
//     io.emit("countDec",{ count });
// });


app.use(express.static(__dirname + "/public"));

app.get("/",(req,res) => {
    res.send("Server Socket")
})

server.listen(4000,()=>{
    console.log("Server running on 4000")
})
