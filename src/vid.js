let video;
let poseNet;
let pose;
let skeleton;

let canvas;
let ctxMain;
let ctxDraw;
let ctxUser;
let strokeStyle;
let fillStyle;
let lineWidth;
let lastX;
let laxtY;
let lastConfidence;
let move;
let dragging = false;

function setup() {
  createCanvas(640, 480);
  canvas = document.querySelector("#main-canvas");
  ctxMain = canvas.getContext("2d");
  canvas = document.querySelector("#draw-canvas");
  ctxDraw = canvas.getContext("2d");
  canvas = document.querySelector("#user-canvas");
  ctxUser = canvas.getContext("2d");

  lastX = 320;
  lastY = 240;
  lastConfidence = 100;
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  move = true;
  lineWidth = 1.0;
  strokeStyle = "black";
  fillStyle = "black";
  
  
  document.querySelector("#draw-canvas").onmousedown = doMousedown;
  document.querySelector("#draw-canvas").onmousemove = doMousemove;
  document.querySelector("#draw-canvas").onmouseup = doMouseup;
  document.querySelector("#draw-canvas").onmouseout = doMouseout;
}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  //ctxMain.drawImage(video, 0, 0, 640, 480);

  if (pose) {
    let rightHand = pose.rightWrist;
    let leftHand = pose.leftWrist;
    ctxDraw.lineWidth = lineWidth;
    ctxDraw.strokeStyle = strokeStyle;
    ctxDraw.fillStyle = fillStyle;
    if(move)
    {
      ctxDraw.beginPath();
      ctxDraw.moveTo(lastX, lastY);
      move = false;
    }
    else
    {
      lastConfidence = rightHand.confidence;
      if(lastConfidence > .75)
      {
        ctxDraw.lineTo(rightHand.x, rightHand.y);
        ctxDraw.stroke();
        lastX = rightHand.x;
        lastY = rightHand.y;
        move = true;
      }
    }
    //https://www.section.io/engineering-education/machine-learning-image-classification-with-javascript-and-nyckel/
    //console.log(rightHand);
    // let eyeR = pose.rightEye;
    // let eyeL = pose.leftEye;
    // let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    // fill(255, 0, 0);
    // ellipse(pose.nose.x, pose.nose.y, d);
    // fill(0, 0, 255);
    // ellipse(rightHand.x, rightHand.y, 32);
    // ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);

    // for (let i = 0; i < pose.keypoints.length; i++) {
    //   let x = pose.keypoints[i].position.x;
    //   let y = pose.keypoints[i].position.y;
    //   fill(0, 255, 0);
    //   ellipse(x, y, 16, 16);
    // }

    // for (let i = 0; i < skeleton.length; i++) {
    //   let a = skeleton[i][0];
    //   let b = skeleton[i][1];
    //   strokeWeight(2);
    //   stroke(255);
    //   line(a.position.x, a.position.y, b.position.x, b.position.y);
    // }
  }
}

/*Functions for UI*/
const doLineWidthChange = (evt) => {
  lineWidth = evt.target.value;
};

const doLineColorChange = (evt) => {
  strokeStyle = evt.target.value;
};

//Clears ctxDraw
const doClear = () => {
  ctxDraw.clearRect(0, 0, ctxDraw.canvas.width, ctxDraw.canvas.height);
  ctxUser.clearRect(0, 0, ctxUser.canvas.width, ctxUser.canvas.height);
  ctxMain.clearRect(0, 0, ctxMain.canvas.width, ctxMain.canvas.height);
};

const doExport = () => {
  // convert the canvas to a JPEG and download it
  // https://daily-dev-tips.com/posts/vanilla-javascript-save-canvas-as-an-image/
  const data = canvas.toDataURL("image/jpeg", 1.0);
  const link = document.createElement("a");
  link.download = "exported-image.jpg";
  link.href = data;
  link.click();
  link.remove();
};
/*End Functions for UI*/


//Functions for using the mouse to draw.
const getMouse = (evt) => {
	const mouse = {};
	mouse.x = evt.pageX - evt.target.offsetLeft;
	mouse.y = evt.pageY - evt.target.offsetTop;
	return mouse;
};

const doMousedown = (evt) => {
  dragging = true;

  //get mouse location in canvas coords
  const mouse = getMouse(evt);

  //pencil
  ctxDraw.beginPath();

  //move to x,y of mouse
  ctxDraw.lineTo(mouse.x, mouse.y);
};

const doMousemove = (evt) => {
  //if mouse not down, bail
  if (!dragging) return;

  //get mouse location
  const mouse = getMouse(evt);

  //pencil
  ctxDraw.strokeStyle = strokeStyle;
  ctxDraw.lineWidth = lineWidth;

  //draw line to x,y
  ctxDraw.lineTo(mouse.x, mouse.y);

  //stoke line
  ctxDraw.stroke();
};

const doMouseup = (evt) => {
  dragging = false;
  ctxDraw.closePath();
};

// if the user drags out of the canvas
const doMouseout = (evt) => {
  dragging = false;
  ctxDraw.closePath();
};
//End Functions for using the mouse to draw.