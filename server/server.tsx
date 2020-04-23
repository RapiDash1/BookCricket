const app = require("express")();
const cors = require("cors");

app.use(cors());

// socket map to hold two users in the same
// game and make sure they recieve their updates
let socketMap = {};

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});


let server = app.listen(3000, () => {
    console.log("Listening on port 3000");
})


const socketIo = require("socket.io").listen(server);



socketIo.on("connection", (socket) => {
    socket.on("customCommonCode", (code) => {
        // Add socket into map with respective key
        if (socketMap.hasOwnProperty(code+"_A")) {
            // Adding opponent player if customCode_A is already present
            socketMap[code+"_B"] = socket;
            // send player code back
            socket.emit("playerCode", code+"_B");
        } else {
            socketMap[code+"_A"] = socket;
            // send player code back
            socket.emit("playerCode", code+"_A");
        }
        console.log("created custom code player map");
    })
    socket.on("playerScore", ({score: scoreVal, customCode: ccVal}) => {
        console.log("custom player val : " + ccVal);
        // Calculate the last character (A or B) for player that should reccieve the score
        const lastCodeChar = (ccVal.slice(-1) == "A") ? "B" : "A";
        // Create the player name by exchanging the last character
        const opponentPlayer = ccVal.slice(0,-1) + lastCodeChar;
        console.log("playerscore detected " + scoreVal);
        // emit score to opponentPlayer
        socketMap[opponentPlayer].emit("opponentScore", scoreVal);
    });
});