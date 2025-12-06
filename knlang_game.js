const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// ============================================================
// Squad: Room
// ============================================================
class Room {
    constructor(name, description) {
        this.name = name;                // Quark
        this.description = description;  // Quark
        this.items = [];                 // Quark
        this.exits = {};                 // Quark
        this.locked = false;             // Quark
        this.puzzle = null;              // Quark
    }

    // Doodle: showDetails()
    showDetails() {
        console.log(`\n== ${this.name} ==`);
        console.log(this.description);

        if (this.items.length > 0) {
            console.log(`Items here: ${this.items.join(", ")}`);
        } else {
            console.log("Items here: None. Suspiciously none.");
        }

        let exitStr = Object.entries(this.exits)
            .map(([dir, room]) => `${dir} → ${room}`)
            .join(", ");

        console.log("Exits: " + exitStr);
    }

    // Doodle: interact()
    interact(game, command) {
        if (this.puzzle) return this.puzzle(game, command);
        console.log("You interact with the air. The air interacts back. Nothing changes.");
    }
}

// ============================================================
// Squad: Player
// ============================================================
class Player {
    constructor(name = "Unnamed Hero") {
        this.name = name;         // Quark
        this.inventory = [];      // Quark
        this.currentRoom = null;  // Quark
        this.isAlive = true;      // Quark
    }

    // Doodle: pickUp(item)
    pickUp(item) {
        let room = this.currentRoom;
        if (!room.items.includes(item)) {
            console.log(`You try picking up '${item}', but reality disagrees.`);
            return;
        }
        room.items = room.items.filter(i => i !== item);
        this.inventory.push(item);
        console.log(`You picked up the ${item}. Power +10.`);
    }

    // Doodle: move(direction)
    move(direction, game) {
        let room = this.currentRoom;

        if (!room.exits[direction]) {
            console.log("You walk into a wall. The wall wins.");
            return;
        }

        let nextRoom = game.rooms[room.exits[direction]];

        // locked?
        if (nextRoom.locked) {
            if (this.inventory.includes("rusty key")) {
                console.log("You unlock the door using the rusty key. It crumbles dramatically.");
                nextRoom.locked = false;
                this.inventory = this.inventory.filter(i => i !== "rusty key");
            } else {
                console.log("The door refuses to open. Maybe it wants a key? Or emotional support?");
                return;
            }
        }

        this.currentRoom = nextRoom;
        console.log(`\nYou walk ${direction} → ${nextRoom.name}`);
        nextRoom.showDetails();
    }

    // Doodle: showInventory()
    showInventory() {
        if (this.inventory.length === 0) {
            console.log("Inventory: Empty. Very minimalistic.");
        } else {
            console.log("Inventory: " + this.inventory.join(", "));
        }
    }
}

// ============================================================
// Squad: GameManager
// ============================================================
class GameManager {
    constructor() {
        this.rooms = {};    // Quark
        this.player = new Player();
        this.quitRequested = false; // Quark
        this.setupWorld();  // Build rooms
    }

    // Doodle: setupWorld()
    setupWorld() {
        // Entrance
        let entrance = new Room("Entrance",
            "A stone corridor with a crooked welcome mat and faint smell of hope.");
        entrance.items.push("lantern");
        entrance.exits = { north: "Main Hall" };

        // Main Hall
        let mainHall = new Room("Main Hall",
            "Tall ceilings, dusty portraits judging your posture.");
        mainHall.items.push("mysterious note");
        mainHall.exits = {
            south: "Entrance",
            east: "Spooky Dungeon",
            west: "Locked Door",
            north: "Riddle Room"
        };

        // Spooky Dungeon
        let dungeon = new Room("Spooky Dungeon",
            "Damp walls, moldy smell, and distant snoring.");
        dungeon.items.push("rusty key");
        dungeon.exits = { west: "Main Hall" };

        // Locked Door
        let locked = new Room("Locked Door",
            "A door with more bolts than personality.");
        locked.locked = true;
        locked.exits = { east: "Main Hall", west: "Treasure Room" };

        // Treasure Room
        let treasure = new Room("Treasure Room",
            "Golden glow everywhere. A chest sits quietly, judging.");
        treasure.items.push("jeweled crown");
        treasure.exits = { east: "Locked Door" };

        // Riddle Room
        let riddle = new Room("Riddle Room",
            "A circular room with glowing runes. A stone tablet stands ominously.");
        riddle.exits = { south: "Main Hall" };
        riddle.puzzle = this.riddlePuzzle.bind(this);

        // Save rooms
        [entrance, mainHall, dungeon, locked, treasure, riddle].forEach(r => {
            this.rooms[r.name] = r;
        });

        // Start player location
        this.player.currentRoom = entrance;
    }

    // Doodle: riddlePuzzle()
    riddlePuzzle(game, command) {
        let room = game.player.currentRoom;

        if (!room.riddleSeen) {
            console.log("\nThe tablet reads:");
            console.log("\"Forward I am heavy, backward I am not. What am I?\"");
            console.log("(Try: answer ton)");
            room.riddleSeen = true;
            return;
        }

        if (!command.startsWith("answer")) {
            console.log("The tablet vibrates, unimpressed. Use: answer <text>");
            return;
        }

        let guess = command.split(" ").slice(1).join(" ").toLowerCase();

        if (guess === "ton") {
            console.log("The runes glow! A hidden passage opens to the north.");
            room.exits["north"] = "Quiet Garden";

            let garden = new Room("Quiet Garden",
                "Peaceful and green. A golden apple hangs suspiciously low.");
            garden.items.push("golden apple");
            garden.exits = { south: "Riddle Room" };
            this.rooms[garden.name] = garden;
        } else {
            console.log("Wrong. The tablet sighs loudly.");
        }
    }

    // Doodle: startGame()
    startGame() {
        console.log("\nWelcome to the Mysterious Land of KN-Lang!");
        this.player.currentRoom.showDetails();

        this.mainLoop();
    }

    // SpinCycle: mainLoop()
    mainLoop() {
        const loop = () => {
            if (this.quitRequested) {
                console.log("\nThanks for playing!");
                rl.close();
                return;
            }

            rl.question("\n>> ", (input) => {
                this.handleCommand(input.trim());
                loop();
            });
        };
        loop();
    }

    // Doodle: handleCommand()
    handleCommand(cmd) {
        let [verb, ...rest] = cmd.split(" ");
        verb = verb.toLowerCase();
        let arg = rest.join(" ");

        // go <dir>
        if (verb === "go") {
            if (!arg) return console.log("Go WHERE? Left? Right? Into the void?");
            return this.player.move(arg.toLowerCase(), this);
        }

        // pick <item>
        if (verb === "pick") {
            if (!arg) return console.log("Pick WHAT? Air molecules?");
            return this.player.pickUp(arg);
        }

        // inventory
        if (verb === "inventory") return this.player.showInventory();

        // look
        if (verb === "look") return this.player.currentRoom.showDetails();

        // answer <text>
        if (verb === "answer") return this.player.currentRoom.interact(this, cmd);

        // use <item>
        if (verb === "use") return this.player.currentRoom.interact(this, cmd);

        // quit
        if (verb === "quit") {
            console.log("Quitting already? Bold choice.");
            this.quitRequested = true;
            return;
        }

        // default sarcastic reply
        this.sarcastic(cmd);
    }

    sarcastic(cmd) {
        const replies = [
            `'${cmd}'? Interesting… but no.`,
            "The game pretends it didn’t hear that.",
            "That command went straight into the void.",
            "Invalid input. Even the walls facepalm."
        ];
        console.log(replies[cmd.length % replies.length]);
    }
}

// ============================================================
// Start the game
// ============================================================
function start() {
    rl.question("Enter your name, brave coder: ", (name) => {
        let gm = new GameManager();
        gm.player.name = name || "Unnamed Hero";
        gm.startGame();
    });
}

start();
