const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(q) {
    return new Promise(resolve => rl.question(q, ans => resolve(ans.trim())));
}

// ================================================
// Squad: Player
// ================================================
class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
    }

    addScore(points) {
        this.score += points;
        if (this.score < 0) this.score = 0;
    }
}

// ================================================
// Squad: Question
// ================================================
class Question {
    constructor(category, difficulty, text, correctAnswer) {
        this.category = category;
        this.difficulty = difficulty;
        this.text = text;
        this.correctAnswer = correctAnswer;
    }
}

// ================================================
// Squad: QuizMaster
// ================================================
class QuizMaster {
    constructor() {
        this.questions = [];
        this.chosenCategory = "";
        this.chosenDifficulty = "";
        this.currentPlayer = null;
        this.QUESTIONS_LIMIT = 10;
    }

    async start() {
        console.log("\n🧠 Welcome to *QUIZ MASTER* — where knowledge meets sarcasm.\n");

        const name = await ask("Enter your name, brave quiz warrior: ");
        this.currentPlayer = new Player(name);
        console.log(`\nAh, ${name}! Let's see if your brain is debugging-ready.\n`);

        await this.chooseCategory();
        await this.chooseDifficulty();

        await this.beginQuiz();
        this.finalScore();
        rl.close();
    }

    async chooseCategory() {
        console.log("\nChoose a category:");
        console.log("1. Science\n2. History\n3. Fun Facts");

        const choice = await ask("Your choice (1/2/3): ");
        const map = {
            "1": "Science",
            "2": "History",
            "3": "Fun Facts"
        };

        this.chosenCategory = map[choice] || "Science";
        console.log(`\nCategory Selected → ${this.chosenCategory}`);
    }

    async chooseDifficulty() {
        console.log("\nChoose difficulty:");
        console.log("1. Easy\n2. Medium\n3. Hard");

        const choice = await ask("Your choice (1/2/3): ");
        const map = {
            "1": "Easy",
            "2": "Medium",
            "3": "Hard"
        };

        this.chosenDifficulty = map[choice] || "Easy";
        console.log(`Difficulty Selected → ${this.chosenDifficulty}\n`);
    }

    getPoints() {
        return {
            Easy: { correct: 5, wrong: -2 },
            Medium: { correct: 10, wrong: -5 },
            Hard: { correct: 15, wrong: -7 }
        }[this.chosenDifficulty];
    }

    async beginQuiz() {
        console.log("\n📝 Let the Quiz Begin!\n");

        const filtered = this.questions.filter(
            q => q.category === this.chosenCategory && q.difficulty === this.chosenDifficulty
        );

        let questionsPool = [];
        while (questionsPool.length < this.QUESTIONS_LIMIT) {
            questionsPool.push(...filtered);
        }

        questionsPool = questionsPool.slice(0, this.QUESTIONS_LIMIT);

        for (let i = 0; i < this.QUESTIONS_LIMIT; i++) {
            const q = questionsPool[i];
            console.log(`\nQuestion ${i + 1}: ${q.text}`);
            const ans = await ask("Your answer: ");

            this.evaluateAnswer(q, ans);
        }
    }

    evaluateAnswer(question, answer) {
        const points = this.getPoints();

        if (answer.toLowerCase() === question.correctAnswer.toLowerCase()) {
            this.currentPlayer.addScore(points.correct);
            this.commentOnAnswer(true);
        } else {
            this.currentPlayer.addScore(points.wrong);
            this.commentOnAnswer(false);
            console.log(`Correct answer was → ${question.correctAnswer}`);
        }

        console.log(`Current Score: ${this.currentPlayer.score}`);
    }

    commentOnAnswer(isCorrect) {
        if (isCorrect) {
            console.log("✔️  Well, someone paid attention in school!");
        } else {
            console.log("❌  Close… if we were grading on imagination.");
        }
    }

    finalScore() {
        console.log("\n======================================");
        console.log(`🎉 FINAL SCORE: ${this.currentPlayer.score}`);
        console.log("======================================");

        if (this.currentPlayer.score >= 80) {
            console.log("👑 Quiz Royalty has arrived!");
        } else if (this.currentPlayer.score >= 50) {
            console.log("🎓 Quiz Master in training.");
        } else {
            console.log("🤦 Better luck next time, genius.");
        }

        console.log("\nThanks for playing!");
    }
}

// ====================================================
// Add Questions
// ====================================================
const quiz = new QuizMaster();

// --------------------------- Science Questions ---------------------------

// Science (Easy)
quiz.questions.push(new Question("Science", "Easy", "What planet is known as the Red Planet?", "Mars"));
quiz.questions.push(new Question("Science", "Easy", "What do bees produce?", "Honey"));
quiz.questions.push(new Question("Science", "Easy", "What gas do humans need to breathe?", "Oxygen"));
quiz.questions.push(new Question("Science", "Easy", "What is H2O commonly known as?", "Water"));
quiz.questions.push(new Question("Science", "Easy", "How many legs does an insect have?", "Six"));
quiz.questions.push(new Question("Science", "Easy", "Which planet is closest to the Sun?", "Mercury"));
quiz.questions.push(new Question("Science", "Easy", "What do plants need for photosynthesis?", "Sunlight"));
quiz.questions.push(new Question("Science", "Easy", "What part of your body lets you breathe?", "Lungs"));
quiz.questions.push(new Question("Science", "Easy", "What is the largest mammal?", "Blue Whale"));
quiz.questions.push(new Question("Science", "Easy", "What force keeps us on Earth?", "Gravity"));


// Science (Medium)
quiz.questions.push(new Question("Science", "Medium", "What gas do plants absorb from the air?", "Carbon dioxide"));
quiz.questions.push(new Question("Science", "Medium", "What is the chemical symbol for gold?", "Au"));
quiz.questions.push(new Question("Science", "Medium", "What part of the cell contains DNA?", "Nucleus"));
quiz.questions.push(new Question("Science", "Medium", "What organ pumps blood through the body?", "Heart"));
quiz.questions.push(new Question("Science", "Medium", "What type of energy comes from the sun?", "Solar"));
quiz.questions.push(new Question("Science", "Medium", "What is the boiling point of water in Celsius?", "100"));
quiz.questions.push(new Question("Science", "Medium", "Who developed the theory of relativity?", "Einstein"));
quiz.questions.push(new Question("Science", "Medium", "Which scientist discovered gravity?", "Newton"));
quiz.questions.push(new Question("Science", "Medium", "What is the hardest natural substance?", "Diamond"));
quiz.questions.push(new Question("Science", "Medium", "What gas gives soda its fizz?", "Carbon dioxide"));

// Science (Hard)
quiz.questions.push(new Question("Science", "Hard", "What is the powerhouse of the cell?", "Mitochondria"));
quiz.questions.push(new Question("Science", "Hard", "What is the speed of light in m/s?", "299792458"));
quiz.questions.push(new Question("Science", "Hard", "What particle has a negative charge?", "Electron"));
quiz.questions.push(new Question("Science", "Hard", "What is the most abundant gas in Earth's atmosphere?", "Nitrogen"));
quiz.questions.push(new Question("Science", "Hard", "What is the chemical formula for table salt?", "NaCl"));
quiz.questions.push(new Question("Science", "Hard", "Which vitamin is produced when skin is exposed to sunlight?", "Vitamin D"));
quiz.questions.push(new Question("Science", "Hard", "What branch of science studies fungi?", "Mycology"));
quiz.questions.push(new Question("Science", "Hard", "Which planet has the most moons?", "Saturn"));
quiz.questions.push(new Question("Science", "Hard", "What scientist proposed the laws of planetary motion?", "Kepler"));
quiz.questions.push(new Question("Science", "Hard", "What is the heaviest naturally occurring element?", "Uranium"));



// --------------------------- History Questions ---------------------------

// History (Easy)
quiz.questions.push(new Question("History", "Easy", "Who discovered America?", "Christopher Columbus"));
quiz.questions.push(new Question("History", "Easy", "Who was the first President of the USA?", "George Washington"));
quiz.questions.push(new Question("History", "Easy", "Which country built the Great Wall?", "China"));
quiz.questions.push(new Question("History", "Easy", "Who was known as the 'Father of India'?", "Mahatma Gandhi"));
quiz.questions.push(new Question("History", "Easy", "Which ancient civilization built the pyramids?", "Egyptians"));
quiz.questions.push(new Question("History", "Easy", "What boat did Columbus sail?", "Santa Maria"));
quiz.questions.push(new Question("History", "Easy", "Who was the first man on the moon?", "Neil Armstrong"));
quiz.questions.push(new Question("History", "Easy", "Which war ended in 1945?", "World War II"));
quiz.questions.push(new Question("History", "Easy", "Who wrote the Indian Constitution?", "B. R. Ambedkar"));
quiz.questions.push(new Question("History", "Easy", "Which city was called Constantinople?", "Istanbul"));

// History (Medium)
quiz.questions.push(new Question("History", "Medium", "When did World War I begin?", "1914"));
quiz.questions.push(new Question("History", "Medium", "Who was the first Mughal emperor?", "Babur"));
quiz.questions.push(new Question("History", "Medium", "Who was the British PM during World War II?", "Winston Churchill"));
quiz.questions.push(new Question("History", "Medium", "In which year did India gain independence?", "1947"));
quiz.questions.push(new Question("History", "Medium", "Who was known as the Iron Lady of the UK?", "Margaret Thatcher"));
quiz.questions.push(new Question("History", "Medium", "Who founded the Maurya Empire?", "Chandragupta Maurya"));
quiz.questions.push(new Question("History", "Medium", "Which war was fought between the North and South USA?", "Civil War"));
quiz.questions.push(new Question("History", "Medium", "Where was Napoleon born?", "Corsica"));
quiz.questions.push(new Question("History", "Medium", "What ancient city was destroyed by a volcano?", "Pompeii"));
quiz.questions.push(new Question("History", "Medium", "Who invented the telephone?", "Alexander Graham Bell"));


// History (Hard)
quiz.questions.push(new Question("History", "Hard", "Who was the last Roman Emperor?", "Romulus Augustulus"));
quiz.questions.push(new Question("History", "Hard", "Which treaty ended World War I?", "Treaty of Versailles"));
quiz.questions.push(new Question("History", "Hard", "Who succeeded Queen Victoria?", "Edward VII"));
quiz.questions.push(new Question("History", "Hard", "Which empire used Quipu for record-keeping?", "Inca Empire"));
quiz.questions.push(new Question("History", "Hard", "What year did the Berlin Wall fall?", "1989"));
quiz.questions.push(new Question("History", "Hard", "Which dynasty built the Forbidden City?", "Ming Dynasty"));
quiz.questions.push(new Question("History", "Hard", "Who was the longest-reigning English monarch before Elizabeth II?", "Queen Victoria"));
quiz.questions.push(new Question("History", "Hard", "Who wrote 'The Art of War'?", "Sun Tzu"));
quiz.questions.push(new Question("History", "Hard", "What was the capital of the Aztec Empire?", "Tenochtitlan"));
quiz.questions.push(new Question("History", "Hard", "Which king signed the Magna Carta?", "King John"));



// --------------------------- Fun Facts Questions ---------------------------

// Fun Facts (Easy)
quiz.questions.push(new Question("Fun Facts", "Easy", "What is the capital of Japan?", "Tokyo"));
quiz.questions.push(new Question("Fun Facts", "Easy", "Which animal is called the King of the Jungle?", "Lion"));
quiz.questions.push(new Question("Fun Facts", "Easy", "How many colors are in a rainbow?", "7"));
quiz.questions.push(new Question("Fun Facts", "Easy", "Which fruit is yellow and curved?", "Banana"));
quiz.questions.push(new Question("Fun Facts", "Easy", "Which animal barks?", "Dog"));
quiz.questions.push(new Question("Fun Facts", "Easy", "What do cows drink?", "Water"));
quiz.questions.push(new Question("Fun Facts", "Easy", "How many days are there in a week?", "7"));
quiz.questions.push(new Question("Fun Facts", "Easy", "Which fruit keeps the doctor away?", "Apple"));
quiz.questions.push(new Question("Fun Facts", "Easy", "What do you call frozen water?", "Ice"));
quiz.questions.push(new Question("Fun Facts", "Easy", "Which animal is the largest on land?", "Elephant"));

// Fun Facts (Meduim)
quiz.questions.push(new Question("Fun Facts", "Medium", "Which animal is known as the Ship of the Desert?", "Camel"));
quiz.questions.push(new Question("Fun Facts", "Medium", "What is the tallest animal?", "Giraffe"));
quiz.questions.push(new Question("Fun Facts", "Medium", "Which ocean is the largest?", "Pacific Ocean"));
quiz.questions.push(new Question("Fun Facts", "Medium", "How many bones are in the human body?", "206"));
quiz.questions.push(new Question("Fun Facts", "Medium", "Which bird cannot fly but runs fast?", "Ostrich"));
quiz.questions.push(new Question("Fun Facts", "Medium", "Which planet is famous for its rings?", "Saturn"));
quiz.questions.push(new Question("Fun Facts", "Medium", "What is the hottest planet?", "Venus"));
quiz.questions.push(new Question("Fun Facts", "Medium", "Which country invented pizza?", "Italy"));
quiz.questions.push(new Question("Fun Facts", "Medium", "Which organ has the strongest muscle?", "Tongue"));
quiz.questions.push(new Question("Fun Facts", "Medium", "What is the fastest land animal?", "Cheetah"));

// Fun Facts (Hard)
quiz.questions.push(new Question("Fun Facts", "Hard", "What is the rarest blood type?", "AB negative"));
quiz.questions.push(new Question("Fun Facts", "Hard", "How many hearts does an octopus have?", "3"));
quiz.questions.push(new Question("Fun Facts", "Hard", "Which metal is liquid at room temperature?", "Mercury"));
quiz.questions.push(new Question("Fun Facts", "Hard", "What is the smallest country in the world?", "Vatican City"));
quiz.questions.push(new Question("Fun Facts", "Hard", "Which planet spins backwards?", "Venus"));
quiz.questions.push(new Question("Fun Facts", "Hard", "What is the oldest known civilization?", "Sumerian"));
quiz.questions.push(new Question("Fun Facts", "Hard", "Which animal has blue blood?", "Horseshoe crab"));
quiz.questions.push(new Question("Fun Facts", "Hard", "What is the driest place on Earth?", "Atacama Desert"));
quiz.questions.push(new Question("Fun Facts", "Hard", "What is the only mammal that can fly?", "Bat"));
quiz.questions.push(new Question("Fun Facts", "Hard", "Which human organ can regenerate itself?", "Liver"));

// Start game
quiz.start();
