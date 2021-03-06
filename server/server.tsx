const app = require("express")();
const cors = require("cors");

app.use(cors());

// socket map to hold two users in the same
// game and make sure they recieve their updates
let socketMap = {};


// current session map
// has information on who is currently playing
let playerSession = {}


app.get('/', (req, res) => {
    res.send('<h1>Book cricket server side</h1>');
});


let server = app.listen(process.env.PORT || 3000, () => {
    console.log("Listening on custom port");
})


const socketIo = require("socket.io").listen(server);


// on establishing connection
socketIo.on("connection", (socket) => {
    console.log("Player connected");
    // Sharable player code
    let sharableCode = uniquePlayerCode();
    socket.emit("sharableCode", {gameCode: sharableCode});
    // handle adding players to soclet map
    socket.on("customCommonCode", (code) => {
        console.log("Inside custom common code");
        // Add socket into map with respective key
        if (socketMap.hasOwnProperty(code+"_A")) {
            // Adding opponent player if customCode_A is already present
            socketMap[code+"_B"] = socket;
            // send player code back
            // player B has the opposite session of player A
            // if A is plating then B should not
            playerSession[code+"_B"] = !playerSession[code+"_A"]
            socket.emit("playerCode", {playerCode: code+"_B", initSession: playerSession[code+"_B"]});
            // After both the players are added to the map, hide the loader since both the players are connected
            socket.emit("hideLoader");
            socketMap[code+"_A"].emit("hideLoader");
        } else if (socketMap.hasOwnProperty(code+"_B")) {
            // since B is always populated after A
            // do nothing since two players are already connected
        } else {
            socketMap[code+"_A"] = socket;
            playerSession[code+"_A"] = initPlayerSession();
            // send player code and session info back
            // session info is wheteher the player is playing or not
            socket.emit("playerCode", {playerCode: code+"_A", initSession: playerSession[code+"_A"]});
        }
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
    
    // stop book animation for opponent
    socket.on("opponentBookStopOpeningAnimation", ({playerCode: customPlayerCode}) => {
        let opponentPlayer = opponentPlayerKey(customPlayerCode);  
        if (socketMap[opponentPlayer]) {
            socketMap[opponentPlayer].emit("opponentBookStopOpeningAnimation");
            console.log("closing book event emited");
        }
    });

    // send current page to opponent
    socket.on("currentPage", ({page: currentPage, playerCode: customPlayerCode}) => {
        let opponentPlayer = opponentPlayerKey(customPlayerCode);  
        if (socketMap[opponentPlayer]) {
            socketMap[opponentPlayer].emit("currentPage", currentPage);
            console.log("currentPage event emited");
        }
    });

    // Display out messagee in opponent's window
    socket.on("outMessage", ({playerCode: customPlayerCode}) => {
        let opponentPlayer = opponentPlayerKey(customPlayerCode); 
        if (socketMap[opponentPlayer]) {
            socketMap[opponentPlayer].emit("outMessage");
            console.log("outMessage event emited");
        }
    });

    // Handle sending player message to opponenet
    socket.on("playerMessage", (messageInfo) => {
        let opponentPlayer = opponentPlayerKey(messageInfo.customPlayerCode); 
        if (socketMap[opponentPlayer]) {
            socketMap[opponentPlayer].emit("opponentMessage", {message: messageInfo.message});
            console.log("Player message event emited");
        }
    });

    // disconnect
    socket.on("disconnect", (socket) => {
        console.log("disconnect event");
        Array.from(Object.keys(socketMap)).forEach(user => {
            if (socketMap[user] == socket) {
                delete socketMap[user];
                delete playerSession[user];
                console.log("player deleted");
            }
        });
    });

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

// get the initaial value of player session
function initPlayerSession() {
    let index = Math.floor(Math.random()*2);
    return (index == 0) ? false : true;
}


// returns an unique code
// this is used by players to enter a game
function uniquePlayerCode() {
    const initialValue = 10000;
    const randomGameNumber = initialValue + Math.round(Math.random() * initialValue);
    return randomGameNumber;
}