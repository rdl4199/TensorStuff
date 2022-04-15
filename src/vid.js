let video;
let poseNet;
let pose;
let skeleton;

let canvas;

//delete later
let drawCanvas;

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
let doodleNet;
let viewResult
let results;



function setup() {
  
  canvas = document.querySelector("#main-canvas");
  ctxMain = canvas.getContext("2d");
  drawCanvas = document.querySelector("#draw-canvas")
  ctxDraw = drawCanvas.getContext("2d");
  canvas = document.querySelector("#user-canvas");
  ctxUser = canvas.getContext("2d");

  lastX = 300;
  lastY = 300;
  lastConfidence = 100;
  video = createCapture(VIDEO);
  //video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  move = true;
  lineWidth = 10;
  strokeStyle = "black";
  fillStyle = "black"
  doodleNet = ml5.imageClassifier("DoodleNet", doodleLoaded)
  viewResult = document.querySelector("#results");
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

function doodleLoaded() {
  console.log("Doodle Loaded");
}

function predict() {
  results = doodleNet.predict(drawCanvas, predictComplete);
  //console.log(results);
}

function predictComplete(error, results)
{
  if(error)
  {
    console.log(error);
  } else {
    //console.log(results);
    viewResult.innerHTML = `${results[0].label} with ${results[0].confidence.toFixed(4)} confidence`
  }
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
        doodleNet.classify(drawCanvas, predict);
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
    //ellipse(rightHand.x, rightHand.y, 32);
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