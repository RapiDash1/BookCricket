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


// on establishing connection
socketIo.on("connection", (socket) => {

    // handle adding players to soclet map
    socket.on("customCommonCode", (code) => {
        // Add socket into map with respective key
        if (socketMap.hasOwnProperty(code+"_A")) {
            // Adding opponent player if customCode_A is already present
            socketMap[code+"_B"] = socket;
            // send player code back
            socket.emit("playerCode", code+"_B");
        } else if (socketMap.hasOwnProperty(code+"_B")) {
            // do nothing since two players are already connected
        } else {
            socketMap[code+"_A"] = socket;
            // send player code back
            socket.emit("playerCode", code+"_A");
        }
        console.log("Added player to player map");
    });

    // handling sending scores between two players
    socket.on("playerScore", ({score: scoreVal, customCode: ccVal}) => {
        // get opponent player key
        let opponentPlayer = opponentPlayerKey(ccVal);
        // if opponent player exists
        if (socketMap[opponentPlayer]) {
            // emit score to opponentPlayer
            socketMap[opponentPlayer].emit("opponentScore", scoreVal);
            console.log("opponent score emitted");
        }
    });

    // handle book opening of opponent player
    socket.on("bookOpenAngle", ({bookAngle: angle, customCode: ccVal, sheetPos: coverPos}) => {
        // get opponent player key
        let opponentPlayer = opponentPlayerKey(ccVal);  
        if (socketMap[opponentPlayer]) {
            // emit score to opponentPlayer
            // send angle and which sheet to rotate
            socketMap[opponentPlayer].emit("openBookWithOpponentAngle", {sheetAngle: angle, sheetCoverPos: coverPos});
            console.log("Open angle emitted");
        }
    });
    
    
    socket.on("opponentBookStopOpeningAnimation", ({playerCode: customPlayerCode}) => {
        let opponentPlayer = opponentPlayerKey(customPlayerCode);  
        if (socketMap[opponentPlayer]) {
            socketMap[opponentPlayer].emit("opponentBookStopOpeningAnimation");
            console.log("closing book event emited");
        }
    })

});


function opponentPlayerKey(customCodeStr) {
    // Calculate the last character (A or B) for player that should reccieve the score
   if (customCodeStr) {
    const lastCodeChar = (customCodeStr.slice(-1) == "A") ? "B" : "A";
    // Create the player name by exchanging the last character
    const opponentPlayer = customCodeStr.slice(0,-1) + lastCodeChar;
    return opponentPlayer;
   } 
   return null;
}