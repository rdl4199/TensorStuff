//Video and Posenet
let video;
let poseNet;
let pose;
let skeleton;
let handpos = [];

let canvas;

//Words that doodlenet can guess. Probably take some weird ones out
let drawWords;
let guessWord;
let ctxDraw;
let ctxUser;
let ctxView;
let videoElement;
let canvasView;
let score = 0;

//Canvas settings
let strokeStyle;
let fillStyle;
let lineWidth;
let lineCap;

//Draw Helper variables
let lastX;
let lastY;
let lastConfidence;
let lastView;
let move;


let resultsView;
let doodleClassifier;
let width = 640;
let height = 480;
let paused = false;
let dragging = false;
let amtOfLoads = 0;
let reader = new FileReader();

//Basic setup stuff 
function setup() {  
  fetch("./data/data.json")
    .then(response => response.json())
    .then(data => {
      drawWords = data.words;
      console.log(data);
      OnFinishedLoad();
    })
}

//After JSON is gotten.
function OnFinishedLoad() {

  canvas = document.querySelector("#draw-canvas");
  ctxDraw = canvas.getContext("2d");
  canvasView = document.querySelector("#view-canvas");
  ctxView = canvasView.getContext("2d");

  // reset the transform-matrix
  lastX = 0;
  lastY = 0;
  lastConfidence = 100;
  video = createCapture(VIDEO);
  //document.querySelector("#canvas-video") = createCapture(VIDEO);
  //video.hide();
  
  poseNet = ml5.handpose(video, modelLoaded);
  poseNet.on('hand', results => {
    handpos = results;
  });
  move = true;
  lineWidth = 20;
  strokeStyle = "black";
  fillStyle = "black";
  lineCap = "round";
  //canvasElement = document.querySelector('canvas'); 
  //ctx = canvas.getContext('2d');
  videoElement = document.querySelector('video');
  width = videoElement.clientWidth;
  height = videoElement.clientHeight;
  canvas.width = video.width;
  canvas.height = videoElement.clientHeight;

  canvas.onmousedown = doMousedown;
  canvas.onmousemove = doMousemove;
  canvas.onmouseup = doMouseup;
  canvas.onmouseout = doMouseout;

  lastView = document.querySelector("#results");
  doodleClassifier = ml5.imageClassifier('DoodleNet', modelLoaded);
  canvas.height = videoElement.clientHeight;
  canvas.width = videoElement.clientWidth;
  guessWord = drawWords[Math.floor(Math.random() * drawWords.length)];
  document.querySelector("#current-guess").innerHTML = `Draw : ${guessWord}`
  clearCanvas();
  //requestAnimationFrame(draw);

  //set initial border
  drawBorder();
}

//After the user manages to draw the certain thing given to them give them another and clear the canvas
function newGuess() {
  guessWord = drawWords[Math.floor(Math.random() * drawWords.length)];
  clearCanvas();
  score++;
  document.querySelector("#score").innerHTML = `Score: ${score}`;
  document.querySelector("#current-guess").innerHTML = `${guessWord}`;
}

function clearCanvas() {
  ctxDraw.save();
  ctxDraw.globalCompositeOperation = "source-over";
  ctxDraw.fillStyle = "#ebedef";
  ctxDraw.beginPath();
  ctxDraw.rect(0, 0, video.width, video.height)
  ctxDraw.fill();
  ctxDraw.restore();
}

//When doodlenet loads set canvas height and width
function modelLoaded() {
  console.log('poseNet ready');

  //spinner until both canvas and handpose load.
  amtOfLoads++;
  if (amtOfLoads > 1) {
    document.querySelector(".loading").style.display = "none";
    document.querySelector("#canvas-holder").appendChild(document.querySelector("video"));
  }

  canvas.height = video.height;
  canvas.width = video.width;
  clearCanvas();

  drawBorder();
}

//Classify the canvas
function classifyCanvas() {
  doodleClassifier.classify(canvas, gotResult);
}

//Whenever Canvas gets classify this is the callback
//Make the innerHTML reflect the results
function gotResult(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  }
  // The results are in an array ordered by confidence.
  // Show the first label and confidence
  lastView.innerHTML = `Best Guess: ${results[0].label} with Confidence: ${results[0].confidence.toFixed(4)}`;
  if (guessWord == results[0].label) {
    newGuess();
  }
  else if (guessWord == results[1].label) {
    newGuess();
  }
  else if (guessWord == results[2].label) {
    newGuess();
  }
  else if (guessWord == results[3].label) {
    newGuess();
  }
}
function draw() {
  //possible way to use JSON to store users current drawing,
  //then bring it back when they reload the page.
  //Would use the data.json file.

  //https://stackoverflow.com/questions/44806870/saving-canvas-to-json-and-loading-json-to-canvas
  //console.log(handpos);
  if (handpos.length > 0) {
    //Get all needed hand points
    let indexFingerTip = handpos[0].annotations.indexFinger[0];
    let thumbTip = handpos[0].annotations.thumb[0];
    //let PinkyTip = handpos[0].annotations.pinky[0];
    let ringTip = handpos[0].annotations.ringFinger[2];
    let fingerX = indexFingerTip[0];
    let fingerY = indexFingerTip[1] - 80;

    //Set the draw settings
    lineWidth = document.querySelector("app-toolbar").shadowRoot.querySelector("#linewidth-chooser").value;
    ctxDraw.lineWidth = lineWidth;
    ctxDraw.strokeStyle = strokeStyle;
    ctxDraw.fillStyle = fillStyle;
    ctxDraw.lineCap = "round";

    //If the user is not pausing
    if ((Math.abs(thumbTip[0] - ringTip[0]) + Math.abs(thumbTip[1] - ringTip[1])) > 130) {
      if (paused) {
        paused = false;
        lastX = (640 - fingerX);
        lastY = fingerY;
        afterPaused = true;
      }
      document.querySelector("#paused").innerHTML = "";
    }

    //User puts thier thumb on their ring finger
    if ((Math.abs(thumbTip[0] - ringTip[0]) + Math.abs(thumbTip[1] - ringTip[1])) < 80) {
      if (!move && !paused) {
        move = true;
        ctxDraw.lineTo((640 - fingerX), fingerY);
        ctxDraw.stroke();
        paused = true;
        document.querySelector("#paused").innerHTML = "Paused";
      }
      else if (!paused) {
        move = false;
        ctxDraw.beginPath();
        ctxDraw.moveTo((640 - fingerX), fingerY);
        paused = true;
        document.querySelector("#paused").innerHTML = "Paused";
      }
      document.querySelector("#paused").innerHTML = "Paused";
    }
    if (!paused) {
      if (move) {
        ctxDraw.beginPath();
        if (lastX == 0) {
          ctxDraw.moveTo((640 - fingerX), fingerY);
        }
        else {
          ctxDraw.moveTo(lastX, lastY);
        }
        move = false;
      }
      //figure it out
      //Since ctx uses the last point and then goes to current point when false can lead to long line strokes
      //Unwanted
      else {
        if (afterPaused) {
          ctxDraw.strokeStyle = "rgba(0,0,0,0)";
        }
        ctxDraw.lineTo((640 - fingerX), fingerY);
        ctxDraw.stroke();
        lastX = (640 - fingerX);
        lastY = fingerY;
        move = true;
      }
    }
    afterPaused = false;
    ctxDraw.strokeStyle = strokeStyle;
    classifyCanvas();
  }
  else {
    paused = true;
    document.querySelector("#paused").innerHTML = "Paused";
  }
}

const drawBorder = () => {
  //Adds 1px black border.
  ctxDraw.save();
  ctxDraw.lineWidth = 1.0;
  ctxDraw.globalCompositeOperation = "source-over";
  ctxDraw.strokeStyle = "black";
  ctxDraw.beginPath();
  ctxDraw.rect(0,0,canvas.width,canvas.height);
  ctxDraw.stroke();
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
      document.querySelector("app-toolbar").shadowRoot.querySelectorAll("label")[1].querySelector("input").disabled = false;

      break;
    case "tool-eraser":
      //greys out stroke color box
      document.querySelector("app-toolbar").shadowRoot.querySelectorAll("label")[1].querySelector("input").disabled = true;


      //Adds 1px black border.
      drawBorder();

      break;
    case "tool-fill":
      //Ungreys out stroke color box
      document.querySelector("app-toolbar").shadowRoot.querySelectorAll("label")[1].querySelector("input").disabled = false;

      ctxDraw.save();
      ctxDraw.fillStyle = document.querySelector("app-toolbar").shadowRoot.querySelector("#strokestyle-chooser").value;
      ctxDraw.globalCompositeOperation = "source-over";
      ctxDraw.beginPath();
      ctxDraw.rect(0, 0, canvas.width, canvas.height);
      ctxDraw.fill();
      ctxDraw.restore();

      //reset back to pencil being selected.
      document.querySelector("app-toolbar").shadowRoot.querySelector("#tool-chooser").value = "tool-pencil";

      break;
  }
};

//Clears ctxDraw
const doClear = () => {

  //https://www.w3schools.com/js/js_popup.asp

  if (window.confirm("Clear the image?")) {
    clearCanvas();
    drawBorder();
  }
};

const doExport = () => {

  //https://www.w3schools.com/js/js_popup.asp
  let fileName = prompt("Exported File Name:");

  if (fileName == null)
    return;
  if (fileName == "")
    fileName = "canvas-drawing";

  // convert the canvas to a JPEG and download it
  // https://daily-dev-tips.com/posts/vanilla-javascript-save-canvas-as-an-image/
  const data = canvas.toDataURL("image/jpeg", 1.0);
  const link = document.createElement("a");
  link.download = fileName + ".jpg";
  link.href = data;
  link.click();
  link.remove();
};

//https://stackoverflow.com/questions/44806870/saving-canvas-to-json-and-loading-json-to-canvas
const doSave = () => {

  let fileName = prompt("File Name:");

  if (fileName == null)
    return;
  if (fileName == "")
    fileName = "canvas-image";

  // retrieve the canvas data
  let canvasContents = canvas.toDataURL(); // a data URL of the current canvas image
  let data = { image: canvasContents, date: Date.now() };
  let string = JSON.stringify(data);

  // create a blob object representing the data as a JSON string
  let file = new Blob([string], {
    type: 'application/json'
  });

  // trigger a click event on an <a> tag to open the file explorer
  let a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

//https://stackoverflow.com/questions/44806870/saving-canvas-to-json-and-loading-json-to-canvas
const doLoad = () => {
  if (document.querySelector('app-toolbar').shadowRoot.querySelector("#btn-load").files[0]) {
    // read the contents of the first file in the <input type="file">
    //https://stackoverflow.com/questions/16002412/check-file-extension-and-alert-user-if-isnt-image-file
    if (!document.querySelector('app-toolbar').shadowRoot.querySelector("#btn-load").files[0].name.match(/.(json)$/i))
      alert('File given does not have the \'.json\. extension.');
    else
      reader.readAsText(document.querySelector('app-toolbar').shadowRoot.querySelector("#btn-load").files[0]);
  }
};

// this function executes when the contents of the file have been fetched
reader.onload = function () {
  let data = JSON.parse(reader.result);
  let image = new Image();
  image.onload = function () {
    ctxDraw.clearRect(0, 0, canvas.width, canvas.height);
    ctxDraw.drawImage(image, 0, 0); // draw the new image to the screen
  };
  image.src = data.image; // data.image contains the data URL
};
/*End Functions for UI*/


//Functions for using the mouse to draw.
//https://www.geeksforgeeks.org/how-to-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/
const getMouse = (evt) => {
  const mouse = {};
  let rect = canvas.getBoundingClientRect();

  mouse.x = evt.pageX - rect.left;
  mouse.y = evt.pageY - rect.top;

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
  if (document.querySelector("app-toolbar").shadowRoot.querySelectorAll("label")[1].querySelector("input").disabled) {
    ctxDraw.globalCompositeOperation = "destination-out";
  }
  else {
    ctxDraw.globalCompositeOperation = "source-over";
  }
  ctxDraw.strokeStyle = strokeStyle;
  ctxDraw.lineWidth = lineWidth;
  ctxDraw.lineCap = "round"; //default is "butt"

  //draw line to x,y
  ctxDraw.lineTo(mouse.x, mouse.y);

  //stoke line
  ctxDraw.stroke();

  //use doodlenet for regular drawing.
  classifyCanvas();
};

const doMouseup = () => {
  dragging = false;
  ctxDraw.closePath();
};

// if the user drags out of the canvas
const doMouseout = () => {
  dragging = false;
  ctxDraw.closePath();
};
//End Functions for using the mouse to draw.