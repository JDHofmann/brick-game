let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let message = document.querySelector("#message");
const start = document.querySelector('#start')
let ballRadius = 10;
let x = canvas.width/2;
let y = canvas.height-30;
let dx = 2;
let dy = -2;
let paddleHeight = 10;
let paddleWidth = 75;
let pdL = paddleWidth/3;
let pdC = pdL*2;
let pdR = paddleWidth;
let paddleX = (canvas.width-paddleWidth)/2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 3;
let brickColumnCount = 6;
let brickWidth = 70;
let brickHeight = 20;
let brickPadding = 5;
let brickOffsetTop = 30;
let brickOffsetLeft = 20;
let score = 0;
let lives = 3;
let level = 1;
let totalLevels = 3;
let continueDraw = true;

let bricks = [];
const makeBricks = () => {
  for(let c=0; c<brickColumnCount; c++) {
      bricks[c] = [];
      for(let r=0; r<brickRowCount; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false)

function keyDownHandler(e) {
  if(e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if(e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}


const drawBall = () => {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#00a0a0";
    ctx.fill();
    ctx.closePath();
}
const drawPaddle = () => {
  ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#00a0a0";
    ctx.fill();
  ctx.closePath();
}


function drawBricks() {
  for(let c=0; c<brickColumnCount; c++) {
      for(let r=0; r<brickRowCount; r++) {
        if(bricks[c][r].status == 1) {

          let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
          let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#00a0a0";
          ctx.fill();
          ctx.closePath();
        }
      }
  }
}

const draw = () => {
  if ( continueDraw ) {
    message.textContent = "";
    message.style.opacity = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawBricks();
    drawPaddle();
    calculateScore();
    drawLives();
    collisionDetection();

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius){
      // hits left of paddle
      if(x > paddleX && x < paddleX + pdL){
        dy = -dy;
        dx -= .5;
      }
      // hits center of paddle
      else if(x > (paddleX + pdL) && x < (paddleX + pdC)){
        dy = -dy;
      }
      // hits right of paddle
      else if(x > (paddleX + pdC) && x < (paddleX + pdR)){
        dy = -dy;
        dx += .5;
      }

      else {
        lives--;
        if(lives > 0){
          continueDraw = false;
          message.textContent = "YOU DIED";
          message.style.opacity = 1;
          setTimeout(function(){
            continueDraw = true;
            ballReset();
            
            paddleX = (canvas.width - paddleWidth)/2;
            console.log(continueDraw)
            draw()
          }, 2000)

        }
        else {
          continueDraw = false;
          message.textContent = "GAME OVER";
          message.style.opacity = 1;
          setTimeout(function(){
            document.location.reload();
          }, 5000)
        }

      }
    }

    if(rightPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if(leftPressed) {
        paddleX -= 7;
        if (paddleX < 0){
            paddleX = 0;
        }
    }
    
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
  }
}

const collisionDetection = () => {
  for(let c = 0; c < brickColumnCount; c++){
    for(let r = 0; r < brickRowCount; r++){
      let b = bricks[c][r];
      if(b.status == 1 ){
        if(x > b.x && x < (b.x + brickWidth) && y > b.y && y < (b.y + brickHeight)){
          b.status = 0;
          dy = -dy;
          score++;
          if(score == brickColumnCount*brickRowCount){
            continueDraw = false;
            message.style.transition = ".5s";
            message.textContent = `Level ${level} Complete`;
            message.style.opacity = 1;
            level += 1;
            if( level == 2){
              setTimeout(function(){
                continueDraw = true;
                score = 0;
                brickRowCount = 4;
                brickHeight = 17.5;
                ballReset();
                dx = 2.5;
                dy = -2.5;
                makeBricks();
                draw();
              }, 2000)
            }
            else if ( level == 3 ){
              setTimeout(function(){
                continueDraw = true;
                score = 0;
                brickRowCount = 5;
                brickColumnCount = 9;
                brickWidth = 45;
                brickHeight = 15;
                brickPadding = 5;
                ballReset();
                dx = 3;
                dy = -3;
                makeBricks();
                draw();
              }, 2000)
            }
            if(level > totalLevels){
              message.textContent = `You Win`;
              setTimeout(function(){
                document.location.reload();
              }, 5000)
            }
          }

        }
      }
    }
  }
}

const calculateScore = () => {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#00a0a0";
  ctx.fillText(`Score: ${score} / ${brickColumnCount*brickRowCount}`, 8, 20);
}

const drawLives = () => {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#00a0a0";
  ctx.fillText(`Lives: ${lives}`, (canvas.width - 75), 20);
}

const ballReset = () => {
  x = canvas.width/2;
  y = canvas.height-30;
}


start.addEventListener('click', e => {
  requestAnimationFrame(draw);
})
makeBricks();
drawBall();
drawBricks();
drawPaddle();