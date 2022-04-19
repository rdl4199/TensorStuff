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
let lineCap;
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
let dragging = false;


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
  lineWidth = 1;
  strokeStyle = "black";
  fillStyle = "black";
  lineCap = "round";
  
  //set initial border
  drawBorder();
  
  document.querySelector("#draw-canvas").onmousedown = doMousedown;
  document.querySelector("#draw-canvas").onmousemove = doMousemove;
  document.querySelector("#draw-canvas").onmouseup = doMouseup;
  document.querySelector("#draw-canvas").onmouseout = doMouseout;

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

  // // vertical-flip
  // ctxMain.scale(1, -1);
  // ctxMain.translate(0, -canvas.height);
  // ctxMain.drawImage(video, 0, 0);
  // // reset the transform-matrix
  // ctxMain.setTransform(1, 0, 0, 1, 0, 0);

  //Adds 1px black border.
  drawBorder();
    

  // //circle border on width of drawing/erasing tool, dissapears when user begins to draw. (incomplete)
  // ctxDraw.save();
  // ctxDraw.strokeStyle = "black";
  // ctxDraw.arc(mouse.x, mouse.y, 1, 0, 2 * Math.PI);
  // ctxDraw.restore();


  //possible way to use JSON to store users current drawing,
  //then bring it back when they reload the page.
  //Would use the data.json file.

  //https://stackoverflow.com/questions/44806870/saving-canvas-to-json-and-loading-json-to-canvas

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

const drawBorder = e => {
    //Adds 1px black border.
    ctxDraw.save();
    ctxDraw.lineWidth = 1.0;
    ctxDraw.globalCompositeOperation="source-over";
    ctxDraw.strokeStyle = "black";
    ctxDraw.strokeRect(0,0,canvas.width, canvas.height);
    ctxDraw.restore();
}

/*Functions for UI*/
const doLineWidthChange = (evt) => {
  lineWidth = evt.target.value;
};

const doLineColorChange = (evt) => {
  strokeStyle = evt.target.value;
};

const doToolChange = (evt) => {

  let currentTool = document.querySelector("app-toolbar").shadowRoot.querySelector("#tool-chooser").value;

  switch(currentTool)
  {
    case "tool-pencil":
      //Ungreys out stroke color box
      document.querySelector("app-toolbar").shadowRoot.querySelectorAll("label")[1].querySelector("select").disabled = false;

      break;
    case "tool-eraser":
      //greys out stroke color box
      document.querySelector("app-toolbar").shadowRoot.querySelectorAll("label")[1].querySelector("select").disabled = true;


        //Adds 1px black border.
        drawBorder();

      break;
      case "tool-fill":
        //Ungreys out stroke color box
        document.querySelector("app-toolbar").shadowRoot.querySelectorAll("label")[1].querySelector("select").disabled = false;

        ctxDraw.fillStyle = document.querySelector("app-toolbar").shadowRoot.querySelector("#strokestyle-chooser").value;
        ctxDraw.fillRect(0,0,canvas.width,canvas.height);

        //reset back to pencil being selected.
        document.querySelector("app-toolbar").shadowRoot.querySelector("#tool-chooser").value = "tool-pencil";

      break;
  }
}

//Clears ctxDraw
const doClear = () => {

  //https://www.w3schools.com/js/js_popup.asp

  if (window.confirm("Clear the image?")) {
    ctxDraw.clearRect(0, 0, ctxDraw.canvas.width, ctxDraw.canvas.height);
    ctxUser.clearRect(0, 0, ctxUser.canvas.width, ctxUser.canvas.height);
    ctxMain.clearRect(0, 0, ctxMain.canvas.width, ctxMain.canvas.height);
  
    drawBorder();
  }
};

const doExport = () => {

  //https://www.w3schools.com/js/js_popup.asp

  if (window.confirm("Export the image?")) {
    // convert the canvas to a JPEG and download it
    // https://daily-dev-tips.com/posts/vanilla-javascript-save-canvas-as-an-image/
    const data = canvas.toDataURL("image/jpeg", 1.0);
    const link = document.createElement("a");
    link.download = "exported-image.jpg";
    link.href = data;
    link.click();
    link.remove();
  }
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
  //if on eraser, color will be disabled, make it white and thick
  if (document.querySelector("app-toolbar").shadowRoot.querySelectorAll("label")[1].querySelector("select").disabled) {
    ctxDraw.globalCompositeOperation="destination-out";
  }
  else {
    ctxDraw.globalCompositeOperation="source-over";
  }
  ctxDraw.strokeStyle = strokeStyle;
  ctxDraw.lineWidth = lineWidth;
  ctxDraw.lineCap = "round"; //default is "butt"

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