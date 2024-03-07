const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const colisionCanvas = document.getElementById('colisionCanvas')
const colisionctx = colisionCanvas.getContext('2d');
colisionCanvas.width = window.innerWidth
colisionCanvas.height = window.innerHeight
ctx.font = '50px Impact'
let score = 0;
let timeToNextRaven = 0
let ravenInterval = 1000;
let lastTime = 0
var gameOver = false
let startTime = null
let ravens = []


screen.orientation.lock("portrait-primary");
class Raven {
    constructor() {
        this.spriteWidth = 271
        this.spriteHeight = 194
        this.sizeModifier = Math.random() * 0.6 + 0.4
        this.width = this.spriteWidth * this.sizeModifier
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width
        this.y = Math.random() * (canvas.height - this.height)
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5
        this.markedForDeletion = false;
        this.image = new Image()
        this.image.src = 'raven.png'
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0
        this.flapInterval = Math.random() * 50 + 50
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';
        this.hasTail = Math.random() > 0.6
    }
    update(deltaTime) {
        if (this.y < 0 || this.y > canvas.height - this.height) {
            this.directionY = this.directionY * -1
        }
        this.x -= this.directionX
        this.y -= this.directionY
        if (this.x < (0 - this.width)) this.markedForDeletion = true;

        this.timeSinceFlap += deltaTime
        if (this.timeSinceFlap > this.flapInterval) {
            if (this.frame > this.maxFrame) this.frame = 0
            else this.frame++
            this.timeSinceFlap = 0
            if (this.hasTail) {
                for (let i = 0; i < 5; i++) {
                    particles.push(new Particles(this.x, this.y, this.width, this.color))
                }

            }

        }
        if (this.x < 0 - this.width) gameOver = true

    }
    draw() {
        //   ravenInterval --
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);

        colisionctx.fillStyle = this.color

        colisionctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

let explosions = []
class Explosions {
    constructor(x, y, size) {
        this.image = new Image()
        this.image.src = 'boom.png'
        this.spriteWidth = 200
        this.spriteHeight = 179
        this.size = size
        this.x = x
        this.y = y
        this.frame = 0
        this.sound = new Audio()
        this.sound.src = 'boom.wav'
        this.timeSinceLastFrame = 0;
        this.frameInterval = 100;
        this.markedForDeletion = false;
    }
    update(deltaTime) {
        if (this.frame === 0) this.sound.play()
        this.timeSinceLastFrame += deltaTime
        if (this.timeSinceLastFrame > this.frameInterval) {
            this.frame++
            this.timeSinceLastFrame = 0;

        }
        if (this.frame > 5) this.markedForDeletion = true
    }
    draw() {
        // if(startTime == null) startTime = Date.now()

        ctx.drawImage(this.image, this.frame * this.spriteHeight, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size / 4, this.size, this.size)
    }
}

let particles = []

class Particles {
    constructor(x, y, size, color) {
        this.size = size
        this.x = x + this.size / 2;
        this.y = y + this.size / 3;
        this.radius = Math.random() * this.size / 10
        this.maxRadius = Math.random() * 20 + 35
        this.markedForDeletion = false
        this.speedX = Math.random() * 1 + 0.5
        this.color = color
    }
    update() {
        this.x += this.speedX
        this.radius += 0.5
        if (this.radius > this.maxRadius - 5) this.markedForDeletion = true
    }
    draw() {
        ctx.save()
        ctx.globalAlpha = 1 - this.radius / this.maxRadius;
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
    }
}

function drawScore() {
    // ctx.fillStyle = 'black';6
    // ctx.fillText('SCORE: ' + score, 50, 75)
    ctx.fillStyle = 'white';
    ctx.fillText('SCORE: ' + score, 105, 70)
    // console.log(score)

}

function drawGameOver() {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black'
    // ctx.fillText("Game Over, Your Score IS " + score, canvas.width / 2, canvas.height / 2)
    ctx.fillStyle = 'yellow'
    ctx.fillText("Game Over, Your Score IS " + score, canvas.width / 2 + 5, canvas.height / 2 + 5)
    let highScore = localStorage.getItem('highscore');
    if(!highScore || score > highScore) {
        localStorage.setItem('highscore', score);
    }
    // console.log(score)
    drawRestartButton();
    drawHighScore(highScore)

}

function drawHighScore(highScore) {
    // console.log(ctx.width)
    ctx.fillStyle = 'white';
    ctx.fillText('HIGHSCORE: ' + highScore, canvas.width-280, 80)
}

// drawHighScore(258)


// start button dimension 
const startButtonWidth = 300; // Width of the button
const startButtonHeight = 70; // Height of the button

// restart Button dimension
const restartButtonWidth = 320; // Width of the button
const restartButtonHeight = 70; // Height of the button

var isGameStart = false;
window.addEventListener('click', function (e) {
    if (!isGameStart) {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;

        // Check if the click is inside the Start button
        if (mouseX >= canvas.width / 2 + (-startButtonWidth / 2) && mouseX <= canvas.width / 2 + (-startButtonWidth / 2) + startButtonWidth &&
            mouseY >= canvas.height / 2 + (-startButtonHeight / 2) && mouseY <= canvas.height / 2 + (-startButtonHeight / 2) + startButtonHeight) {
            // console.log("reach here")
            // Call your desired function here
            startGame();
            // Clear the canvas to remove the button
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            isGameStart = true
        }
    }
    else {
        if (!gameOver) {
            ravenInterval -= 10 // to make level harder after every scire
            // console.log(ravenInterval)
            const detectPixelColor = colisionctx.getImageData(e.x, e.y, 1, 1)
            // console.log(detectPixelColor)
            const pc = detectPixelColor.data
            ravens.forEach(obj => {
                if (obj.randomColors[0] === pc[0] && obj.randomColors[1] === pc[1] && obj.randomColors[2] === pc[2]) {
                    obj.markedForDeletion = true;
                    score++
                    explosions.push(new Explosions(obj.x, obj.y, obj.width))
                }
            })
        }
        else {
            const mouseX = event.clientX - canvas.getBoundingClientRect().left;
            const mouseY = event.clientY - canvas.getBoundingClientRect().top;
            // Check if the click is inside the button
            if (mouseX >= canvas.width / 2 + (-restartButtonWidth / 2) && mouseX <= canvas.width / 2 + (-restartButtonWidth / 2) + restartButtonWidth &&
                mouseY >= canvas.height / 2 + 80 + (-restartButtonHeight / 2) && mouseY <= canvas.height / 2 + 80 + (-restartButtonHeight / 2) + restartButtonHeight) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    gameOver = false;
                    console.log(gameOver + "si reallt")
                    window.location.reload()
            }
        }
    }
})


function animate(timestamp) {
    colisionctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let deltaTime = timestamp - lastTime
    lastTime = timestamp
    timeToNextRaven += deltaTime

    if (timeToNextRaven > ravenInterval) {
        ravens.push(new Raven())
        timeToNextRaven = 0
        ravens.sort(function (a, b) {
            return a.width - b.width
        })
    }
    drawScore();
    [...ravens, ...explosions, ...particles].forEach(object => object.update(deltaTime));

    [...particles, ...ravens, ...explosions].forEach(object => object.draw());


    // loop to remove expired elemets working for me
    for (let i = 0; i < ravens.length; i++) {
        const element = ravens[i];
        if (element.markedForDeletion === true) {
            ravens.splice(i, 1)
            i--
        }
    }

    // loop to remove expired elemets working for me
    for (let i = 0; i < explosions.length; i++) {
        const element = explosions[i];
        if (element.markedForDeletion === true) {
            explosions.splice(i, 1)
            i--
        }
    }

    // loop to remove expired elemets working for me
    for (let i = 0; i < particles.length; i++) {
        const element = particles[i];
        if (element.markedForDeletion === true) {
            particles.splice(i, 1)
            i--
        }
    }



    //  not working for me 
    //    ravens = ravens.filter(obj =>{
    //     !obj.markedForDeletion
    //    })
    // console.log(particles)
    // if(Date.now() - startTime < 1000 * 60 *5)  ravenInterval = 500// increse speed
    // if(Date.now() - startTime >1000 * 60 *2)  ravenInterval = 500// increse speed
    // if(Date.now() - startTime >1000 * 60 *1)  ravenInterval = 500// increse speed

    if (!gameOver) requestAnimationFrame(animate);
    else drawGameOver();
}

// Start Game
function startGame() {
    // console.log("called somrthing")
    animate(0)
}

// Restart Button
function drawRestartButton() {
    // Button properties
    const buttonX = canvas.width / 2 + (-restartButtonWidth / 2) // X coordinate of the button
    const buttonY = canvas.height / 2 + 80 + (-restartButtonHeight / 2); // Y coordinate of the button
    const buttonText = 'Restart the Game'; // Text to display on the button

    // console.log(buttonX + " " + buttonY)

    // Draw the button shape
    ctx.fillStyle = 'Green';
    ctx.fillRect(buttonX, buttonY, restartButtonWidth + 30, restartButtonHeight);

    // Draw the button text
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(buttonText, buttonX+ 17 + restartButtonWidth / 2, buttonY + restartButtonHeight / 2);
}

// Show Start button 
function drawStartButton() {
    // Button properties
    const buttonX = canvas.width / 2 + (-startButtonWidth / 2) // X coordinate of the button
    const buttonY = canvas.height / 2 + (-startButtonHeight / 2); // Y coordinate of the button
    const buttonText = 'Start the Game'; // Text to display on the button

    // console.log(buttonX + " " + buttonY)

    // Draw the button shape
    ctx.fillStyle = 'red';
    ctx.fillRect(buttonX, buttonY, startButtonWidth, startButtonHeight);

    // Draw the button text
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(buttonText, buttonX + startButtonWidth / 2, buttonY + startButtonHeight / 2);
}
drawStartButton();

// // Add click event listener to the canvas
// canvas.addEventListener('click', function (event) {
//     console.log("io")

//     const mouseX = event.clientX - canvas.getBoundingClientRect().left;
//     const mouseY = event.clientY - canvas.getBoundingClientRect().top;

//     // Check if the click is inside the button
//     if (mouseX >= canvas.width / 3.25 && mouseX <= canvas.width / 3.25 + 300 &&
//         mouseY >= canvas.height / 2.77 && mouseY <= canvas.height / 2.77 + 70) {
//         // Call your desired function here
//         startGame();

//         // Clear the canvas to remove the button
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//     }
// });


// Call the drawButton function to show the button

// show Start button
// function drawButton() {
//     // Button properties
//     const buttonX = 100; // X coordinate of the button
//     const buttonY = 100; // Y coordinate of the button
//     const buttonWidth = 300; // Width of the button
//     const buttonHeight = 70; // Height of the button
//     const buttonText = 'Start the Game'; // Text to display on the button


//     // Draw the button shape
//     ctx.fillStyle = 'red';
//     // ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
//     ctx.fillRect(buttonX + canvas.width / 3.25, buttonY + canvas.height / 2.77, buttonWidth, buttonHeight);

//     // Draw the button text
//     ctx.fillStyle = 'white';
//     ctx.font = '40px Arial';
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';
//     ctx.fillText(buttonText, buttonX + canvas.width / 2.2, buttonY + canvas.height / 2.5);

//     // Make cursor pointer when hovering over the button
//     // ctx.style.cursor = 'pointer';
//     console.log("jk")
//     // Add click event listener to the canvas
//     canvas.addEventListener('click', function (event) {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         const mouseX = event.clientX - canvas.getBoundingClientRect().left;
//         const mouseY = event.clientY - canvas.getBoundingClientRect().top;
//         console.log("mouse x " + mouseX)
//         // Check if the click is inside the button
//         if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
//             mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
//             // Call your desired function here
//             startGame()

//             // Clear the canvas to remove the button
//         }
//     });

// }
// drawButton()
