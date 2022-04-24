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
let afterPaused = false;
let dragging = false;


async function setup() {
  canvas = document.querySelector("#draw-canvas");
  ctxDraw = canvas.getContext("2d");
  document.querySelector("#btn-clear").className = "button px-5 mx-2 is-pulled-right is-danger is-loading";
  document.querySelector("#btn-export").className = "button px-5 mx-1 is-pulled-right is-primary is-loading"

  canvas.className = "is-loading";
  // reset the transform-matrix
  lastX = 50;
  lastY = 50;
  lastConfidence = 100;
  video = createCapture(VIDEO);
  //video.hide();
  poseNet = ml5.handpose(video);
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
  canvas.height = video.height;
  canvas.width = video.width;
  canvas.className = "";
  clearCanvas();
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
  console.log(handpos);
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
    //console.log((Math.abs(thumbTip[0] - ringTip[0]) + Math.abs(thumbTip[1] - ringTip[1])));
    if ((Math.abs(thumbTip[0] - ringTip[0]) + Math.abs(thumbTip[1] - ringTip[1])) > 130) {
      if(paused)
      {
        paused = false;
        lastX = (640 - fingerX);
        lastY = fingerY;
        afterPaused = true;
      }
      document.querySelector("#paused").innerHTML = "";
    }
    if ((Math.abs(thumbTip[0] - ringTip[0]) + Math.abs(thumbTip[1] - ringTip[1])) < 80) {
      
      if (!move && !paused) {
        move = true;
        ctxDraw.lineTo((640 - fingerX), fingerY);
        ctxDraw.stroke();
        classifyCanvas();
        paused = true;
        document.querySelector("#paused").innerHTML = "Paused";
      }
      else if(!paused){
        move = false;
        ctxDraw.beginPath();
        ctxDraw.moveTo((640 - fingerX), fingerY)
        paused = true;
        document.querySelector("#paused").innerHTML = "Paused";
      }
    }
    if (!paused) {
      if (move) {
        ctxDraw.beginPath();
        ctxDraw.moveTo(lastX, lastY);
        move = false;
      }
      //figure it out
      //Since ctx uses the last point and then goes to current point when false can lead to long line strokes
      //Unwanted
      else {
        if(afterPaused)
        {
          ctxDraw.strokeStyle = "rgba(0,0,0,0)";
        }
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
    afterPaused = false;
    ctxDraw.strokeStyle = strokeStyle;
    // if ((Math.abs(thumbTip[0] - ringTip[0]) + Math.abs(thumbTip[1] - ringTip[1])) > 130) {
    //   paused = false;
    //   document.querySelector("#paused").innerHTML = "";
    //   lastX = indexFingerTip[0];
    //   lastY = indexFingerTip[1];
    // }
    //console.log(move);

    //If the user touches their pinky and thumb together or atleast come close pause drawing
    //Not using pythagrorean theorem bc its not that important
  }
  else
  {
    paused = true;
  }
}

const drawBorder = () => {
    //Adds 1px black border.
    ctxDraw.save();
    ctxDraw.lineWidth = 1.0;
    ctxDraw.globalCompositeOperation="source-over";
    ctxDraw.strokeStyle = "black";
    ctxDraw.strokeRect(0,0,canvas.width, canvas.height);
    ctxDraw.restore();
};

/*Functions for UI*/
const doLineWidthChange = (evt) => {
  lineWidth = evt.target.value;
};

const doLineColorChange = (evt) => {
  strokeStyle = evt.target.value;
};

const doToolChange = () => {

  let currentTool = document.querySelector("app-toolbar").shadowRoot.querySelector("#tool-chooser").value;

  switch (currentTool) {
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
      ctxDraw.fillRect(0, 0, canvas.width, canvas.height);

      //reset back to pencil being selected.
      document.querySelector("app-toolbar").shadowRoot.querySelector("#tool-chooser").value = "tool-pencil";

      break;
  }
};

//Clears ctxDraw
const doClear = () => {

  //https://www.w3schools.com/js/js_popup.asp

  if (window.confirm("Clear the image?")) {
    ctxDraw.clearRect(0, 0, ctxDraw.canvas.width, ctxDraw.canvas.height);
    ctxUser.clearRect(0, 0, ctxUser.canvas.width, ctxUser.canvas.height);
    //ctxMain.clearRect(0, 0, ctxMain.canvas.width, ctxMain.canvas.height);
  
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

    // for (let i = 0; i < skeleton.length; i++) {
    //   let a = skeleton[i][0];
    //   let b = skeleton[i][1];
    //   strokeWeight(2);
    //   stroke(255);
    //   line(a.position.x, a.position.y, b.position.x, b.position.y);
    // }
  }
}