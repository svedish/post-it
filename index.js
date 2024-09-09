// POSt-IT app by Svedish (2024)


// *** SETTING UP THE ENVIRONMENT *** //

let storedNotes = [];
const button = document.querySelector("button");
let counter = 1;
let isDragging = false;
let selectedElement;
let maxZindex;

if(localStorage.getItem("maxZindex") !== null && JSON.parse(localStorage.getItem("notes")) && JSON.parse(localStorage.getItem("notes")).length > 0) {
  maxZindex = JSON.parse(localStorage.getItem("maxZindex"));
}

else {
  maxZindex = 1;
  localStorage.setItem("maxZindex", JSON.stringify(maxZindex));
}

const colors = ["d3e9ff", "beffe9", "f0d6ff", "f9ffb6", "ffc5c5", "efefef"];


// If there are notes in the Local Storage build render them
if (localStorage.notes) {
  storedNotes = JSON.parse(localStorage.getItem("notes"));
  buildNotesFromStorage(storedNotes);
}

// Listen for CTRL-W key combos to close the selected Note
// NEEDS SOME WORK TO AUTOMATICALLY SELECT THE NEXT NOTE IN THE zINDEX WHEN CLOSING ONE
window.addEventListener("keydown", (event) => {
  console.log(event.code);
  if(event.ctrlKey && event.code === "KeyW") {
    selectedElement.remove();
    const indexToRemove = storedNotes.findIndex((note) => note.id === selectedElement.id);
      if (indexToRemove !== -1) {
        // Remove the object from the array using splice
        storedNotes.splice(indexToRemove, 1);
        localStorage.setItem("notes", JSON.stringify(storedNotes));
      }
  };
});

// Create a new note on Plus button click
button.addEventListener("click", createNote);

// Move any note when selected
document.addEventListener('mousemove', (e) => {
  
  //Does not move the item if the mouse is not down and inside the handle
  // CLEVER TRICK!
  if (!isDragging) return;

  selectedElement.style.left = e.clientX - offsetX + 'px';
  selectedElement.style.top = e.clientY - offsetY + 'px';
});







// ****************************************************************** //
// ********************* FUNCTIONS FROM HERE HERE ******************* //
// ****************************************************************** //




// *** THE createNote() FUNCTION *** //

function createNote() {
  
  const noteId = `note_${counter}`;
  const noteColor = colors[Math.floor(Math.random() * 6)];
  let randomLeft = 100 + Math.floor(Math.random() * 100 + 10);
  let randomTop = 100 + Math.floor(Math.random() * 100 + 10);

  const noteDiv = document.createElement("div");
  noteDiv.setAttribute("id", noteId);
  noteDiv.classList.add("note");
  noteDiv.style.background = `#${noteColor}`;
  
  noteDiv.style.left = randomLeft + "px";
  noteDiv.style.top = randomTop + "px";
  if(noteDiv.style.zIndex < maxZindex) { noteDiv.style.zIndex = maxZindex = maxZindex + 1; };
  document.body.appendChild(noteDiv);

  selectedElement = noteDiv;
  counter++;
  
  const handleDiv = document.createElement("div");
  handleDiv.classList.add("handle");
  noteDiv.appendChild(handleDiv);
  
  const closeBtnDiv = document.createElement("div");
  closeBtnDiv.classList.add("close_button");
  handleDiv.appendChild(closeBtnDiv);
  
  const noteTextDiv = document.createElement("div");
  noteTextDiv.classList.add("note_text");
  noteTextDiv.setAttribute("contentEditable", "true");
  noteTextDiv.setAttribute("spellcheck", "false");
  noteDiv.appendChild(noteTextDiv);
  
  console.log(counter);
  
  storedNotes.push({"id": `${noteId}`, "props": {"left": noteDiv.getBoundingClientRect().left, "top": noteDiv.getBoundingClientRect().top, "color": noteColor, "zindex": noteDiv.style.zIndex, "text": noteTextDiv.innerText}
  });
  // console.log(storedNotes);
  localStorage.setItem("notes", JSON.stringify(storedNotes));
  localStorage.setItem("maxZindex", JSON.stringify(maxZindex));
  console.log(`The length of stoedNotes is: ${storedNotes.length}`);
 


  // createNote() Event listeners
  
  noteDiv.addEventListener("click", (e) => {
    if(noteDiv.style.zIndex < maxZindex) { noteDiv.style.zIndex = maxZindex = maxZindex + 1; };
    selectedElement = noteDiv;
    console.log(typeof maxZindex);
    localStorage.setItem("maxZindex", JSON.stringify(maxZindex));
    updateStoredZindex(e);
    console.log(`maxZindex from created note click listener is: ${maxZindex}`);
  });

  /*
  noteDiv.addEventListener("touchmove", (e) => {
    let touchLocation = e.targetTouches[0];
    
    // assign box new coordinates based on the touch.
    noteDiv.style.left = touchLocation.pageX + 'px';
    noteDiv.style.top = touchLocation.pageY + 'px';
  });

  noteDiv.addEventListener("touchend", (e) => {
    // current box position.
    var x = parseInt(noteDiv.style.left);
    var y = parseInt(noteDiv.style.top);
  });

  */

  handleDiv.addEventListener("mousedown", (e) => {
    if(noteDiv.style.zIndex < maxZindex) { noteDiv.style.zIndex = maxZindex = maxZindex + 1; };
    // console.log(elem.style.zIndex);
    handleDiv.style.cursor = "grabbing";
    //e.preventDefault(); // Prevent text selection during drag

    isDragging = true;
    selectedElement = noteDiv;
  
    offsetX = e.clientX - noteDiv.getBoundingClientRect().left;
    offsetY = e.clientY - noteDiv.getBoundingClientRect().top;
    
  });

  
  
  handleDiv.addEventListener("mouseup", (event) => {
    isDragging = false;
    selectedElement = noteDiv;
    handleDiv.style.cursor = "auto";
    console.log(noteDiv.getBoundingClientRect().left, noteDiv.getBoundingClientRect().top);
    updateStoredPosition();
  });
  
  closeBtnDiv.addEventListener("click", (e) => {
    noteDiv.remove();
    const indexToRemove = storedNotes.findIndex((note) => note.id === noteId);
      if (indexToRemove !== -1) {
        // Remove the object from the array using splice
        storedNotes.splice(indexToRemove, 1);
        localStorage.setItem("notes", JSON.stringify(storedNotes));
      }
  });
 
  

  noteTextDiv.addEventListener("blur", updateCompletetext);

}




// *** THE buildNotesFromStorage() FUNCTION *** //


function buildNotesFromStorage(notesDataArray) {
  
  // Just double check that the storeed data is an array
  if (Array.isArray(notesDataArray) === false) { return };
  
  notesDataArray.forEach((note) => {
  
    const noteId = note.id;
    const noteDiv = document.createElement("div");
    noteDiv.setAttribute("id", noteId);
    noteDiv.classList.add("note");
    noteDiv.style.background = `#${note.props.color}`;
    noteDiv.style.left = `${note.props.left}px`;
    noteDiv.style.top = `${note.props.top}px`;
    noteDiv.style.zIndex = `${note.props.zindex}`;
   
    document.body.appendChild(noteDiv);
    counter++;
    selectedElement = noteDiv;
  
    const handleDiv = document.createElement("div");
    handleDiv.classList.add("handle");
    noteDiv.appendChild(handleDiv);
  
    const closeBtnDiv = document.createElement("div");
    closeBtnDiv.classList.add("close_button");
    handleDiv.appendChild(closeBtnDiv);
  
    const noteTextDiv = document.createElement("div");
    noteTextDiv.classList.add("note_text");
    noteTextDiv.setAttribute("contentEditable", "true");
    noteTextDiv.setAttribute("spellcheck", "false");
    noteTextDiv.innerText = note.props.text;
    noteDiv.appendChild(noteTextDiv);
    


    // buildNotesFromStorage() Event listeners

    noteDiv.addEventListener("click", (e) => {
      if(noteDiv.style.zIndex < maxZindex) { noteDiv.style.zIndex = maxZindex = maxZindex + 1; };
      selectedElement = noteDiv;
      console.log(typeof maxZindex);
      localStorage.setItem("maxZindex", JSON.stringify(maxZindex));
      console.log(`maxZindex from REBUILT note click listener is: ${maxZindex}`);
      updateStoredZindex(e);
    });

    handleDiv.addEventListener("mousedown", (e) => {
      if(noteDiv.style.zIndex < maxZindex) { noteDiv.style.zIndex = maxZindex = maxZindex + 1; };
      // console.log(elem.style.zIndex);
      handleDiv.style.cursor = "grabbing";
      //e.preventDefault(); // Prevent text selection during drag
      
      isDragging = true;
      selectedElement = noteDiv;
      
      offsetX = e.clientX - noteDiv.getBoundingClientRect().left;
      offsetY = e.clientY - noteDiv.getBoundingClientRect().top;
    });
    
    handleDiv.addEventListener("mouseup", (event) => {
      isDragging = false;
      selectedElement = noteDiv;
      handleDiv.style.cursor = "auto";
      //console.log(noteDiv.getBoundingClientRect().left, noteDiv.getBoundingClientRect().top);
      updateStoredPosition();
    });
    
    closeBtnDiv.addEventListener("click", (e) => {
      noteDiv.remove();
      const indexToRemove = storedNotes.findIndex((note) => note.id === noteId);
      if (indexToRemove !== -1) {
        // Remove the object from the array using splice
        storedNotes.splice(indexToRemove, 1);
        localStorage.setItem("notes", JSON.stringify(storedNotes));
      }
    });


    noteTextDiv.addEventListener("blur", updateCompletetext);

  
  }); // END FOR EACH

}

/*
function updateStoredText(event) {
  const indexToUpdate = storedNotes.findIndex((note) => note.id === selectedElement.id);
    if (indexToUpdate !== -1) {      
      storedNotes[indexToUpdate].props.text += event.data;
      localStorage.setItem("notes", JSON.stringify(storedNotes));
    }
}
*/

function updateCompletetext(event) {
  const indexToUpdate = storedNotes.findIndex((note) => note.id === selectedElement.id);
    if (indexToUpdate !== -1) {      
      storedNotes[indexToUpdate].props.text = event.target.innerText;
      localStorage.setItem("notes", JSON.stringify(storedNotes));
    }
}

function updateStoredPosition() {
  const indexToUpdate = storedNotes.findIndex((note) => note.id === selectedElement.id);
    if (indexToUpdate !== -1) {
      //console.log(selectedElement.getBoundingClientRect().left, selectedElement.getBoundingClientRect().top);
      storedNotes[indexToUpdate].props.left = selectedElement.getBoundingClientRect().left;
      storedNotes[indexToUpdate].props.top = selectedElement.getBoundingClientRect().top;
      localStorage.setItem("notes", JSON.stringify(storedNotes));
    }
}

function updateStoredZindex(event) {
  const indexToUpdate = storedNotes.findIndex((note) => note.id === selectedElement.id);
    if (indexToUpdate !== -1) {      
      storedNotes[indexToUpdate].props.zindex = event.currentTarget.style.zIndex;
      console.log('The currentTarget zIndex is: ' + event.currentTarget.style.zIndex);
      localStorage.setItem("notes", JSON.stringify(storedNotes));
    }
}
