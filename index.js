const draggable = document.querySelectorAll('.draggable');
console.log(Array.isArray(draggable));
let selectedElement;
let maxZindex = 1;
let isDragging = false;
let offsetX, offsetY;

initializeEditor("Enter text");



draggable.forEach((elem) => {

  elem.addEventListener("mousedown", (e) => {
    elem.style.zIndex = maxZindex = maxZindex + 1;
    // console.log(elem.style.zIndex);
    elem.classList.add("dragged_bg");
    elem.style.cursor = "grabbing";
    //e.preventDefault(); // Prevent text selection during drag

    isDragging = true;
    selectedElement = elem;
  
    
    offsetX = e.clientX - elem.getBoundingClientRect().left;
    offsetY = e.clientY - elem.getBoundingClientRect().top;
    
  })
});

document.addEventListener('mousemove', (e) => {
  
  //Does not move the item if the mouse is not down and inside the block
  if (!isDragging) return;

  selectedElement.style.left = e.clientX - offsetX + 'px';
  selectedElement.style.top = e.clientY - offsetY + 'px';

  // console.log(e.clientX - offsetX);
  // console.log(e.clientY - offsetY);

});

document.addEventListener('mouseup', () => {
  
  isDragging = false;

  draggable.forEach((elem) => {
    elem.style.cursor = "auto";
    elem.classList.remove("dragged_bg");
  }); 

});

document.getElementById("editor").addEventListener("input", (event) => {
  localStorage.setItem("editor", document.getElementById("editor").textContent);
  console.log(event.data);
});







// Functions

function initializeEditor(welcomeText) {
  if(!localStorage.editor) {
    document.getElementById("editor").textContent = welcomeText;
}

else {
    document.getElementById("editor").textContent = localStorage.getItem("editor");
}
}