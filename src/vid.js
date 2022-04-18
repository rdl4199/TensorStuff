let video;
let poseNet;
let pose;
let skeleton;

let canvas;
//let vidCanvas;
//let ctxVid;
let ctxDraw;
let ctxUser;
let strokeStyle;
let fillStyle;
let lineWidth;
let lastX;
let laxtY;
let lastConfidence;
let move;
let resultsView;
let doodleClassifier;
let width = 640;
let height = 480;
let handpos = [];
let paused = false;


async function setup() {
  canvas = document.querySelector("#draw-canvas");
  ctxDraw = canvas.getContext("2d");
  //vidCanvas = document.querySelector("#vid-canvas");
  //ctxVid = vidCanvas.getContext("2d");
  //ctxDraw.scale(1, -1);
  //ctxDraw.translate(0, -canvas.height);

  // reset the transform-matrix
  lastX = 50;
  lastY = 50;
  lastConfidence = 100;
  video = createCapture(VIDEO);
  //video.hide();
  poseNet = ml5.handpose(video, modelLoaded);
  poseNet.on('hand', results => {
    handpos = results;
  });
  move = true;
  lineWidth = 10;
  strokeStyle = "black";
  fillStyle = "black"
  lastView = document.querySelector("#results");
  doodleClassifier = await ml5.imageClassifier('DoodleNet', modelLoaded);

  clearCanvas();
  //requestAnimationFrame(draw);
}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function clearCanvas() {
  ctxDraw.fillStyle = "#ebedef";
  ctxDraw.fillRect(0, 0, width, height);
}

function modelLoaded() {
  console.log('poseNet ready');
}

function classifyCanvas() {
  doodleClassifier.classify(canvas, gotResult);
}
function gotResult(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  }
  // The results are in an array ordered by confidence.
  //console.log(handpos);
  // Show the first label and confidence
  //label.textContent = `Label: ${results[0].label}`;
  //confidence.textContent = `Confidence: ${results[0].confidence.toFixed(4)}`;
  lastView.innerHTML = `Results ${results[0].label} with Confidence: ${results[0].confidence.toFixed(4)}`;
}
function draw() {
  //ctxMain.drawImage(video, 0, 0, 640, 480);
  //console.log(handpos);
  if (handpos.length > 0) {

    let indexFingerTip = handpos[0].annotations.indexFinger[0];
    let thumbTip = handpos[0].annotations.thumb[0];
    let PinkyTip = handpos[0].annotations.pinky[0];
    let ringTip = handpos[0].annotations.ringFinger[0];
    let fingerX = indexFingerTip[0];
    let fingerY = indexFingerTip[1];
    ctxDraw.lineWidth = lineWidth;
    ctxDraw.strokeStyle = strokeStyle;
    ctxDraw.fillStyle = fillStyle;
    ctxDraw.lineCap = "round";
    if (!paused) {
      if (move) {
        ctxDraw.beginPath();
        ctxDraw.moveTo(lastX, lastY);
        move = false;
      }
      else {
        //lastConfidence = rightHand.confidence;
        //if(lastConfidence > .8)
        //{
        ctxDraw.lineTo((640 - fingerX), fingerY);
        ctxDraw.stroke();
        lastX = (640 - fingerX);
        lastY = fingerY;
        move = true;
        classifyCanvas();
        //}
      }
    }
    else {
      if ((Math.abs(ringTip[0] - PinkyTip[0]) + Math.abs(ringTip[1] - PinkyTip[1])) < 20) {
        paused = false;
        document.querySelector("#paused").innerHTML = "";
      }
    }

    //If the user touches their pinky and thumb together or atleast come close pause drawing
    //Not using pythagrorean theorem bc its not that important
    console.log((Math.abs(thumbTip[0] - PinkyTip[0]) + Math.abs(thumbTip[1] - PinkyTip[1])));
    if ((Math.abs(thumbTip[0] - PinkyTip[0]) + Math.abs(thumbTip[1] - PinkyTip[1])) < 20) {
      paused = true;
      document.querySelector("#paused").innerHTML = "Paused";
    }
    //https://www.section.io/engineering-education/machine-learning-image-classification-with-javascript-and-nyckel/
    // console.log(rightHand);
    // let eyeR = pose.rightEye;
    // let eyeL = pose.leftEye;
    // let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    // fill(255, 0, 0);
    // ellipse(pose.nose.x, pose.nose.y, d);
    // fill(0, 0, 255);
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