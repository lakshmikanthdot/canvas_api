const canvas = document.querySelector("canvas"),
 toolBtns = document.querySelectorAll(".tool"),
 fillColor = document.querySelector("#fillColor"),
 sizeSlider = document.querySelector("#sizeSlider"),
 colorBtns = document.querySelectorAll(".colors .option"),
 colorPicker = document.querySelector("#colorPicker"),
 clearCanvas = document.querySelector(".clearCanvas"),
 saveImg = document.querySelector(".saveImg"),
 ctx = canvas.getContext("2d"),
 undoButton = document.getElementById("undo"),
 redoButton = document.getElementById("redo");


//  console.log(ctx); // CanvasRenderingContex2D
//  console.log(canvas); // CanvasRenderingContex2D

let prevMouseX, prevMouseY, snapshot, isDrawing = false, selectedTool = "pencil", brushWidth = 5, selectedColor = "#000";
let history = [], historyStep = -1;

const setCanavsBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}

// canvas with proper height and width useing load method 
window,addEventListener("load",()=>{
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanavsBackground();
});

toolBtns.forEach((btn) =>{ 
    btn.addEventListener("click",()=>{
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        // console.log(selectedTool);
    });
});

const startDraw = (e)=>{
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;

    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawPencil= (e)=> {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.shadowBlur = 0;
    ctx.stroke();
}

const drawRectangle = (e) => {
    const width = prevMouseX - e.offsetX;
    const height = prevMouseY - e.offsetY;
    if(!fillColor.checked){
       return ctx.strokeRect(e.offsetX, e.offsetY, width, height)
    } 
    ctx.fillRect(e.offsetX, e.offsetY, width, height);
};

const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
};
const drawSquare = (e) => {
    const sideLength = Math.abs(prevMouseX - e.offsetX);
    ctx.beginPath();
    ctx.rect(e.offsetX, e.offsetY, sideLength, sideLength);
    fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawHexagon = (e) => {
    const sideLength = Math.abs(prevMouseX - e.offsetX);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = ((2 * Math.PI) / 6) * i;
        const x = e.offsetX + sideLength * Math.cos(angle);
        const y = e.offsetY + sideLength * Math.sin(angle);
        ctx.lineTo(x, y);
    }
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
};
const drawPentagon = (e) => {
    const sideLength = Math.abs(prevMouseX - e.offsetX);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = ((2 * Math.PI) / 5) * i - Math.PI/2;
        const x = e.offsetX + sideLength * Math.cos(angle);
        const y = e.offsetY + sideLength * Math.sin(angle);
        ctx.lineTo(x, y);
    }
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
};
const drawLine = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
};
const drawArrow = (e) => {
    const headlength = 15;
    const angle = Math.atan2(e.offsetY - prevMouseY, e.offsetX - prevMouseX);
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX-headlength*Math.cos(angle-Math.PI/6), e.offsetY-headlength*Math.sin(angle-Math.PI/6));
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(e.offsetX-headlength*Math.cos(angle+Math.PI/6), e.offsetY-headlength*Math.sin(angle+Math.PI/6));
    ctx.closePath();
    ctx.fill();
};
sizeSlider.addEventListener("change", ()=>{
    brushWidth = sizeSlider.value;
});

colorPicker.addEventListener("change", ()=>{
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

colorBtns.forEach((btn)=>{
    btn.addEventListener("click", ()=>{
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");    
    });
});



const drawBrush = (e) => {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.shadowColor = selectedColor;
    ctx.shadowBlur = 15;
    ctx.stroke();
};

const drawing = (e)=>{
    if(!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);
    if((selectedTool === "pencil" && selectedTool === "brush") || selectedTool === "eraser"){
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if(selectedTool === "rectangle"){   
        drawRectangle(e);   
    } else if(selectedTool === "circle"){  
        drawCircle(e);   
    } else if(selectedTool === "triangle"){ 
        drawTriangle(e);     
    } else if(selectedTool === "square"){      
        drawSquare(e);
    } else if(selectedTool === "hexagon"){ 
        drawHexagon(e);     
    } else if(selectedTool === "pentagon"){  
        drawPentagon(e);    
    } else if(selectedTool === "line"){   
        drawLine(e);   
    } else if(selectedTool === "arrow"){   
        drawArrow(e);      
    } else if(selectedTool === "brush"){      
        drawBrush(e);   
    }else {
        drawPencil(e);
    }    
};

function saveState(){
    history = history.slice(0, historyStep + 1);
    history.push(canvas.toDataURL())
    historyStep++;
    // console.log(history);

    
}

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup",()=>{
    isDrawing = false,
    saveState();
});

undoButton.addEventListener("click", ()=>{
    if(historyStep >= 0){
        historyStep--;
        const img = new Image();
        img.src = history[historyStep];
        img.onload = ()=>{
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img,0,0);
        }
    }
    if(historyStep == -1){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

redoButton.addEventListener("click", ()=>{
    if(historyStep < history.length - 1){
        historyStep++;
        const img = new Image();
        img.src = history[historyStep];
        img.onload = ()=>{
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img,0,0);
        }
    }
});

clearCanvas.addEventListener("click", ()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanavsBackground();
});

saveImg.addEventListener("click", ()=>{
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});


