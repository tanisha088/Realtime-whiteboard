// connect to socket server
const socket = io.connect("http://localhost:3000/");
// *********************************Basic Setup
// document => actual html

// so we will first get the canvas object and change the height and width of the area we want to work upon.
const board = document.querySelector(".board");
// browser tab=> window
// canvas dimensions= browser dimensions
board.height = window.innerHeight;
board.width = window.innerWidth;




// canvasRenderingContext2d=> tool (setting as 2-d will help drawing in 2 dimensional , else 3d also available)
// the canvas tag provides getContext as an interface to help draw in 2-d 
const ctx = board.getContext("2d");
// pencil color
ctx.strokeStyle = "blue";
//  drawing doen't pixelate on zoomin
ctx.imageSmoothingEnabled = true;

ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.miterLimit = 1;
ctx.imageSmoothingQuality = "high";
// width of pencil
ctx.lineWidth = 3;

// ************************Change Size**************************//
function sizeChange(value) {
  ctx.lineWidth = value;
  socket.emit("size", value);
}

// **tool Change***************************************************//
function handleLocaltoolChange(tool) {
  handleToolChange(tool);
  if (tool != "sticky");
  socket.emit("toolchange", tool);
}
// ******************handle color****************************
function handleColorChange(color) {
  ctx.strokeStyle = color;
  socket.emit("color", color);
}

const hamburger = document.querySelector(".hamburger");
const toolPanel = document.querySelector(".tool-panel");
hamburger.addEventListener("click", function() {
   handleHamburger() 

  socket.emit("hamburger");
});