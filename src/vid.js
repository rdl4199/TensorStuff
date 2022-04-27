let video;
let poseNet;
let pose;
let skeleton;

let canvas;
let drawWords = ['aircraft_carrier', 'airplane', 'alarm_clock', 'ambulance', 'angel', 'animal_migration', 'ant', 'anvil', 'apple', 'arm', 'asparagus', 'axe',
  'backpack', 'banana', 'bandage', 'barn', 'baseball', 'baseball_bat', 'basket', 'basketball', 'bat', 'bathtub', 'beach', 'bear', 'beard', 'bed',
  'bee', 'belt', 'bench', 'bicycle', 'binoculars', 'bird', 'birthday_cake', 'blackberry', 'blueberry', 'book', 'boomerang', 'bottlecap', 'bowtie', 'bracelet', 'brain', 'bread', 'bridge', 'broccoli', 'broom', 'bucket', 'bulldozer', 'bus', 'bush', 'butterfly', 'cactus', 'cake', 'calculator', 'calendar', 'camel', 'camera', 'camouflage', 'campfire', 'candle', 'cannon', 'canoe', 'car', 'carrot', 'castle', 'cat', 'ceiling_fan', 'cello', 'cell_phone', 'chair', 'chandelier', 'church', 'circle', 'clarinet', 'clock', 'cloud', 'coffee_cup', 'compass', 'computer', 'cookie', 'cooler', 'couch', 'cow', 'crab', 'crayon', 'crocodile', 'crown', 'cruise_ship', 'cup', 'diamond', 'dishwasher', 'diving_board', 'dog', 'dolphin', 'donut', 'door', 'dragon', 'dresser', 'drill', 'drums', 'duck', 'dumbbell', 'ear', 'elbow', 'elephant', 'envelope', 'eraser', 'eye', 'eyeglasses', 'face', 'fan', 'feather', 'fence', 'finger', 'fire_hydrant', 'fireplace', 'firetruck', 'fish', 'flamingo', 'flashlight', 'flip_flops', 'floor_lamp', 'flower', 'flying_saucer', 'foot', 'fork', 'frog', 'frying_pan', 'garden', 'garden_hose', 'giraffe', 'goatee', 'golf_club', 'grapes', 'grass',
  'guitar', 'hamburger', 'hammer', 'hand', 'harp', 'hat', 'headphones', 'hedgehog', 'helicopter', 'helmet', 'hexagon', 'hockey_puck', 'hockey_stick', 'horse', 'hospital', 'hot_air_balloon', 'hot_dog', 'hot_tub', 'hourglass', 'house', 'house_plant', 'hurricane', 'ice_cream', 'jacket', 'jail', 'kangaroo', 'key', 'keyboard', 'knee', 'knife', 'ladder', 'lantern', 'laptop', 'leaf', 'leg', 'light_bulb', 'lighter', 'lighthouse', 'lightning', 'line', 'lion', 'lipstick', 'lobster', 'lollipop', 'mailbox', 'map', 'marker', 'matches', 'megaphone', 'mermaid', 'microphone', 'microwave', 'monkey', 'moon', 'mosquito', 'motorbike', 'mountain', 'mouse', 'moustache', 'mouth', 'mug', 'mushroom', 'nail', 'necklace', 'nose', 'ocean', 'octagon', 'octopus', 'onion', 'oven', 'owl', 'paintbrush', 'paint_can', 'palm_tree', 'panda', 'pants', 'paper_clip', 'parachute', 'parrot', 'passport', 'peanut', 'pear', 'peas', 'pencil', 'penguin', 'piano', 'pickup_truck', 'picture_frame', 'pig', 'pillow', 'pineapple', 'pizza', 'pliers', 'police_car', 'pond', 'pool', 'popsicle', 'postcard', 'potato', 'power_outlet', 'purse', 'rabbit', 'raccoon', 'radio', 'rain', 'rainbow', 'rake', 'remote_control', 'rhinoceros', 'rifle', 'river', 'roller_coaster', 'rollerskates', 'sailboat', 'sandwich', 'saw', 'saxophone', 'school_bus', 'scissors', 'scorpion', 'screwdriver', 'sea_turtle', 'see_saw', 'shark', 'sheep', 'shoe', 'shorts', 'shovel', 'sink', 'skateboard', 'skull', 'skyscraper', 'sleeping_bag', 'smiley_face', 'snail', 'snake', 'snorkel', 'snowflake', 'snowman', 'soccer_ball', 'sock', 'speedboat', 'spider', 'spoon', 'spreadsheet', 'square', 'squiggle', 'squirrel', 'stairs', 'star', 'steak', 'stereo', 'stethoscope', 'stitches', 'stop_sign', 'stove', 'strawberry', 'streetlight', 'string_bean', 'submarine', 'suitcase', 'sun', 'swan', 'sweater', 'swing_set', 'sword', 'syringe', 'table', 'teapot', 'teddy-bear', 'telephone', 'television', 'tennis_racquet', 'tent', 'The_Eiffel_Tower', 'The_Great_Wall_of_China', 'The_Mona_Lisa', 'tiger', 'toaster', 'toe', 'toilet', 'tooth', 'toothbrush', 'toothpaste', 'tornado', 'tractor', 'traffic_light', 'train', 'tree', 'triangle', 'trombone', 'truck', 'trumpet', 't-shirt', 'umbrella', 'underwear', 'van', 'vase', 'violin', 'washing_machine', 'watermelon', 'waterslide', 'whale', 'wheel', 'windmill', 'wine_bottle', 'wine_glass', 'wristwatch', 'yoga', 'zebra', 'zigzag'];
let ctxDraw;
let ctxUser;
let strokeStyle;
let fillStyle;
let lineWidth;
let lineCap;
let lastX;
let lastY;
let lastConfidence;
let lastView;
let move;
let resultsView;
let doodleClassifier;
let width = 640;
let height = 480;
let handpos = [];
let paused = false;
let dragging = false;
let amtOfLoads = 0;
let reader = new FileReader();

function setup() {
  canvas = document.querySelector("#draw-canvas");
  ctxDraw = canvas.getContext("2d");
  //vidCanvas = document.querySelector("#vid-canvas");
  //ctxVid = vidCanvas.getContext("2d");
  //ctxDraw.scale(1, -1);
  //ctxDraw.translate(0, -canvas.height);

  // reset the transform-matrix
  lastX = 0;
  lastY = 0;
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
  doodleClassifier = ml5.imageClassifier('DoodleNet', modelLoaded);

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
  ctxDraw.fillRect(0, 0, canvas.width, canvas.height);
}

function modelLoaded() {
  console.log('poseNet ready');

  //spinner until both canvas and handpose load.
  amtOfLoads++;
  if (amtOfLoads > 1) {
      document.querySelector(".loading").style.display = "none";
  }

  canvas.height = video.height;
  canvas.width = video.width;
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
  //console.log(handpos);
  // Show the first label and confidence
  //label.textContent = `Label: ${results[0].label}`;
  //confidence.textContent = `Confidence: ${results[0].confidence.toFixed(4)}`;
  lastView.innerHTML = `Results ${results[0].label} with Confidence: ${results[0].confidence.toFixed(4)}`;
}
function draw() {
  //ctxMain.drawImage(video, 0, 0, 640, 480);

  //Adds 1px black border.
  drawBorder();
    

  // //circle border on width of drawing/erasing tool, dissapears when user begins to draw. (incomplete)
  // ctxDraw.save();
  // ctxDraw.strokeStyle = "black";
  // ctxDraw.fillStyle = "none";
  // ctxDraw.lineWidth = 5;
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
    let ringTip = handpos[0].annotations.ringFinger[2];
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
        if(lastX == 0)
        {
          ctxDraw.moveTo((640 - fingerX), fingerY);
        }
        else
        {
          ctxDraw.moveTo(lastX, lastY);
        }
        move = false;
      }
      //figure it out
      else {
        ctxDraw.lineTo((640 - fingerX), fingerY);
        ctxDraw.stroke();
        lastX = (640 - fingerX);
        lastY = fingerY;
        move = true;
        classifyCanvas();
      }
    }
    // if ((Math.abs(thumbTip[0] - ringTip[0]) + Math.abs(thumbTip[1] - ringTip[1])) > 130) {
    //   paused = false;
    //   document.querySelector("#paused").innerHTML = "";
    //   lastX = indexFingerTip[0];
    //   lastY = indexFingerTip[1];
    // }
    console.log(move);

    //If the user touches their pinky and thumb together or atleast come close pause drawing
    //Not using pythagrorean theorem bc its not that important
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
      ctxDraw.fillRect(0, 0, canvas.width, canvas.height);
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
  }
  image.src = data.image; // data.image contains the data URL
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