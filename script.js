let canvas = document.querySelector("canvas");
// canvas dimension -> screen dimensions
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const tool = canvas.getContext("2d");
// color-> black 
// x,y,width,height
// rectangle
// tool.fillRect(0, 0, canvas.width, canvas.height);
// tool.fillStyle = "white";
// tool.strokeStyle = "red";
// tool.lineWidth = 10;
// tool.strokeRect(10, 10, canvas.width / 2, canvas.height / 2);
// tool.fillRect(10, 10, canvas.width / 2, canvas.height / 2);
// // line draw

// see line_drawing image in script.js_images
// tool.beginPath();
// tool.moveTo(canvas.width / 2, canvas.height / 2);
// tool.lineTo(canvas.width / 2 + 100, canvas.height / 2 + 100);
// tool.lineTo(canvas.width / 2 + 200, canvas.height / 2 + 100)
// tool.lineTo(canvas.width / 2 + 200, canvas.height / 2 + 200);

// This will close the path 
// // tool.closePath();
// tool.stroke();


// Now what we want to achieve is that wherever we press at particular point it starts to draw till the point
// we are not leaving the pointer 

// the mousedown event is used when we need to clickExecute a JavaScript when pressing a mouse button over a stretch of area:
let undoStack = [];
let redoStack = [];
let isMouseDown = false;

// This takes as an input as even e,  and e.clientX and e.clientY is used to get the co-ordinates of the place 
// from where the pressing of the button has started and so we use tool.beginPath to place the cursor at the start
// and then mouseup is used for the point wherein we have left the cursor and here we can call line to and draw the line
// But this is not the correct way to do this as we need to draw the path between these two lines are made by the user and so 
// we use mousemove 

// So now what will happen is that we will get the cordinates of the point where the mouse has been clicked, then we will make
// isMouseDown = true . After that mousemove will be called(which gets called whenever we move our mouse) and then
// in this we will check if our isMouseDown is true or not --> if it is then we will get the cordinates of that point
// and make a lineto that point using lineTo and stroke and then when we realease the cursor , then we will make 
// isMouseDown = false . This is because , when releasing the cursor , we will get to know that now on moving the mouse
// we don't need to draw a line , else if it was not made false, then on moving the cursor , mousemove functionality would be
// called and it will keep drawing the line.

canvas.addEventListener("mousedown", function (e) {
    console.log("mouse down event", "x: ", e.clientX, "y: ", e.clientY);
    tool.beginPath();
    let x = e.clientX, y = getCoordinates(e.clientY);
    tool.moveTo(x, y);
    isMouseDown = true;
    let pointDesc = {
        x: x,
        y: y,
        desc: "md"
    }
    undoStack.push(pointDesc);
})
//debouncing 
canvas.addEventListener("mousemove", function (e) {
    // console.log("mouse move event", "x: ", e.clientX, "y: ", e.clientY);
    if (isMouseDown) {
        let x = e.clientX, y = getCoordinates(e.clientY);
        tool.lineTo(x, y);
        tool.stroke();
        let pointDesc = {
            x: x,
            y: y,
            desc: "mm"
        }
        undoStack.push(pointDesc);
    }
})
canvas.addEventListener("mouseup", function (e) {
    isMouseDown = false;
})


// Now, as it can be seen in the index.html file , we needed to add the tools and for that we made the 
// tool-bar class -> and inside that the tool class for all the images of the different tools -> and then the
// canvas . Now, when we do this , we have 3 diff area , one for tool-bar class, inside that diff area for each
// tool and then below the tool-bar class , we have the canvas section . Now, what will happen here is that
// whenever we will be drawing something, if the canvas area is starting from 0,3 instead of 0,0(due to the tool-bar)
// class , so now , when the line will be drawn , e.g. if we click at x,y -> then e.clientX/Y , will take
// the co-ordinates of that point with respect to 0,0 and so if we draw something at 5,10 it will be taken 
// as cordinates as 5,10 ... and so printed at 5,13 since that canvas area started at 0,3 so tool.begin from
/// 0,3 and hence from there a line at dist of 10 will be drawn and we don't want this and so , what we will 
/// do is remove the starting cord of y from the obtained value using bounds.y.. which will give us the bounds
// of the canvas we are having. Else , what will happen is that we will be making our line somewhere 3 steps below
// from where are pointer is currently present . // ### THIS IS THE ISSUE FACED.
function getCoordinates(y) {

    let bounds = canvas.getBoundingClientRect();
    return y - bounds.y
}

// NOW, what we will do is create the tools using querySelectorAll, with tools-image as class -->
//The Document method querySelectorAll() returns a static (not live) 
//NodeList representing a list of the document's elements that match the specified group of selectors.
// So this tools object will be having the info of the elements inside the tool image class -> now
// whenever we click on any of the tools images , then this addEventListener will capture that click as
// with every tools[i] we have attached this functionality --> and now, what will happen is we will get the 
// target on which it was clicked -> we will retrieve its id -> if it is pencil -> then make the strokestyle of
// tool as black and hence now , whenever tool is used, line drawn will be of black color and so on for others.
let tools = document.querySelectorAll(".tool-image");
for (let i = 0; i < tools.length; i++) {
    tools[i].addEventListener("click", function (e) {
        let cTool = e.currentTarget;
        let name = cTool.getAttribute("id");
        if (name == "pencil") {
            tool.strokeStyle = "black";
        } else if (name == "eraser") {
            tool.strokeStyle = "white";
        } else if (name == "sticky") {
            createSticky();
        } else if (name == "undo") {
            undomaker();
        } else if (name == "redo") {
            redomaker();
        } else if (name == "download") {
            downloadBoard();
        } else if (name == "upload") {
            uploadFile();
        }
    })
}

// This is the function to create the box for the sticky note -> In this , what will happen is that first we will
// create this stickypad , navBar etc. and then we will set the respective classes for all of these and then
// what we will do is find the initialX and intialY and take 2 booleans for isStickyDown and isMinimized 
// NOw, we will add the functionality of mouse down on the navBar , so that whenever we press the button on
//it we will get the initial X and intial Y and then in the mousemove, till the point the boolean isStickyDown = false
// we will keep calculating the distance of the final and the initial position of the X and Y and hence calculate the diff
// in their intial and final positions and thus we set the final top and left of the sticky note . We needed to do this,
// since in this case we were moving the whole object body from one place to other and not a line and hence when it
// reached to the new position , it was set as that of the new position. We needed to calculate the prior
// distance since these cordinates are set acc to the theme of the browser , but the object body needs to 
// be set differently. 
function createBox() {
    let stickyPad = document.createElement("div");
    let navBar = document.createElement("div");
    let close = document.createElement("div");
    let minimize = document.createElement("div");
    let textArea = document.createElement("div");
    //    add classes
    stickyPad.setAttribute("class", "stickypad");
    navBar.setAttribute("class", "nav-bar");
    close.setAttribute("class", "close");
    minimize.setAttribute("class", "minimize");
    textArea.setAttribute("class", "text-area");
    navBar.appendChild(minimize);
    navBar.appendChild(close);
    stickyPad.appendChild(navBar);
    stickyPad.appendChild(textArea);
    document.body.appendChild(stickyPad);
    let initialX = null;
    let initialY = null;
    let isStickyDown = false;
    let isMinimized = false;

    // sticky code 
    navBar.addEventListener("mousedown", function (e) {
        // initial point
        initialX = e.clientX
        initialY = e.clientY
        isStickyDown = true;
    })

    canvas.addEventListener("mousemove", function (e) {
        if (isStickyDown == true) {
            // final point 
            let finalX = e.clientX;
            let finalY = e.clientY;
            //  distance
            let dx = finalX - initialX;
            let dy = finalY - initialY;
            //  move sticky
            //original top left
            let { top, left } = stickyPad.getBoundingClientRect()
            // stickyPad.style.top=10+"px";
            stickyPad.style.top = top + dy + "px";
            stickyPad.style.left = left + dx + "px";
            initialX = finalX;
            initialY = finalY;
        }
    })

    // Leaving the mouse will make the isStickyDown = true. 
    window.addEventListener("mouseup", function () {
        isStickyDown = false;
    })

    // In the minimimize fn , we add the functionality , that if isMinimized is true , then 
    // the minimized button has been clicked and hence we need to display nothing (none) and
    // if it is closed, then the display will be showing the whole block                  
    minimize.addEventListener("click", function () {
        if (isMinimized) {
            textArea.style.display = "none";
        } else {
            textArea.style.display = "block";

        }
        isMinimized = !isMinimized
    })
                       
    // On clicking the close button,the remove functionality will be used to remove the body of the object. 
    close.addEventListener("click", function () {
        stickyPad.remove();
    })
    return textArea;

}



// ***********sticky******************
function createSticky() {


    // Created the whole stickynote and then added the textbox appending it to the textArea
    let textArea = createBox();
    let textBox = document.createElement("textarea");
    textBox.setAttribute("class", "textarea");
    // create subtree
    textArea.appendChild(textBox);
    // add subtree to page


}

// *********undo ****************
// In this , we take the elements one by one from the stack , (which are basically what have been created due to the holding of the
//mouse from one point to another) , for each of the object if the descriptor is "mm" then we push it to the redo stack and if "md" then we break
// from this loop. This is because, when we were pushing the objects or cordinates to the stack , then at that time, firstly the 
// initial cordinates were pushed and then, all cordinates formed by moving the cursor were pushed. So getting the 
// md description proves that we have reached the point where we started to push the mouse button to start drawing.
// So what we do is first clear the whole board of canvas (not the tool section) and then , till the time we don't
// get a "md" , pop the elements from the undoStack and then, push it to the redoStack. Now, what one undo does
// is to remove 1 line drawn by one pressing and then moving and so this is done. Now, since we initially 
//cleared the whole setup , we now draw everything back using redraw and undostack , i.e. with the left
//over lines and hence we now have everything except the last made line.
function undomaker() {
    // clear board
    tool.clearRect(0, 0, canvas.width, canvas.height);
    // pop last point
    // undoStack.pop();
    while (undoStack.length > 0) {
        let curObj = undoStack[undoStack.length - 1];
        if (curObj.desc == "md") {
            redoStack.push(undoStack.pop());
            break;
        } else if (curObj.desc == "mm") {
            redoStack.push(undoStack.pop());
        }
    }
    // redraw
    redraw();
}
// ************redo*************
//So, similar to above, we vanish everything , and then push everything from redo to undo stack and then
// draw everything present in the undo stack.
function redomaker() {
    tool.clearRect(0, 0, canvas.width, canvas.height);
    while (redoStack.length > 0) {
        let curObj = redoStack[redoStack.length - 1];
        if (curObj.desc == "md") {
            undoStack.push(redoStack.pop());
            break;
        } else if (curObj.desc == "mm") {
            undoStack.push(redoStack.pop());
        }
    }
    redraw();
}
function redraw() {
    for (let i = 0; i < undoStack.length; i++) {
        let { x, y, desc } = undoStack[i];
        if (desc == "md") {
            tool.beginPath();
            tool.moveTo(x, y);
        } else if (desc == "mm") {
            tool.lineTo(x, y);
            tool.stroke();
        }
    }
}
// let a = document.querySelector("#godownAchor");
// a.addEventListener("click",function(e){
// // e.preventDefault();
// //  set filename to it's download attribute
// a.download = "file.png";
// //  convert board to url 
// let url = canvas.toDataURL("image/png;base64");
// //  set as href of anchor
// a.href = url;
// a.click();
// })

// EVERY asset can be converted to a 64bit string or url 
// Now, in order to download the board what we did was to create a anchor tag, add the file name with which
// it will be downloaded if downloaded... then we will convert the current browser image present into a 
// 64 bit string which will act as the URL for that and hence, we will set the url of the anchor tag with it
// and after that we will add the click functionality to it.

function downloadBoard() {
    //  create an anchor
    // e.preventDefault();
    let a = document.createElement("a");
    //  set filename to it's download attribute
    a.download = "file.png";
    //  convert board to url 
    let url = canvas.toDataURL("image/jpeg;base64");
    //  set as href of anchor
    a.href = url;
    // click the anchor
    a.click();
    // //  reload behaviour does not get triggerd
    // a.remove();
}
// upload download image
let imgInput = document.querySelector("#acceptImg");
// dialog box open
function uploadFile() {
    // dialog box select ok 

    // FIrstly with the click functionality on upload file ,we get the new small window from which we can
    // get the required image and then from here when we choose the image required , then this change
    // functionality gets triggered and then we get the image object and then convert it to url and then
    // we create a new element img and then set its class and then set the src of that image as the url
    // we got and hence we can now append this image to the text BOX and then , we can get the image similar to 
    // the form of the sticky note with minimize and close button.
imgInput.click();
    imgInput.addEventListener("change", function () {
        console.log(imgInput.files);
        let imgObj = imgInput.files[0];
        // console.log(imgObj);
        // img => link 
        let imgLink = URL.createObjectURL(imgObj);
        let textBox = createBox();
        let img = document.createElement("img");
        img.setAttribute("class", "upload-img");
        img.src = imgLink;
        textBox.appendChild(img);
    })
}