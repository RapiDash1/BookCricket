const app = require("express")();
const http = require("http").createServer(app);
const socketIo = require("socket.io")(http);
const cors = require("cors");

app.use(cors());

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

socketIo.on("connection", (socket) => {
    socket.emit("opponentScore", "42"); 
});


http.listen(3000, () => {
    console.log("Listening on port 3000");
})