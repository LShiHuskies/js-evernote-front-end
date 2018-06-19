document.addEventListener('DOMContentLoaded', function(event){

const notesURL = 'http://localhost:3000/api/v1/notes';
const usersURL = 'http://localhost:3000/api/v1/users';
const notesList = document.getElementById('notes-container');
const usersArray = [];



const notesForm = document.getElementById('new-note-form');
const notesTextTitle = document.getElementById('new-note-text-title');
const notesTextDescription = document.getElementById('new-note-text-description');
const usersSelection = document.createElement('SELECT');


const usersList = document.getElementById('users-container');
usersList.addEventListener('click', function(event){
  event.preventDefault();

  if (event.target.innerText == 'SHOW USER NOTES'){
    event.preventDefault();
    let userId = event.target.parentElement.id;
    notesList.innerHTML = '';
    getUsertoGetNotes(userId)
  } else if (event.target.innerText == 'Delete') {
    event.preventDefault();
    let userId = event.target.parentElement.id;
    removeUser(event, userId);
  } else if (event.target.innerText == 'Update') {
    event.preventDefault();
    let userId = event.target.parentElement.id;
    updateUserName(event, userId);
  } else if (event.target.innerText == 'Update User') {
    let userId = event.target.parentElement.parentElement.id;
    const updateText = document.getElementById('update-user-text');
    const updateName = updateText.value;
    patchupdateName(event, updateName, userId);
  } else if (event.target.innerText == 'Play Games') {

    const userId = event.target.id.slice(6)
    displayBoard(event, userId)
    // display tic tae toe board
  }

})

function displayBoard(event, userId) {

  const gamesContainer = document.getElementById('games');
  
  const toeOne = document.createElement('DIV');
  const toeTwo = document.createElement('DIV');
  const toeThree = document.createElement('DIV');
  const toeFour = document.createElement('DIV');
  const toeFive = document.createElement('DIV');
  const toeSix = document.createElement('DIV');
  const toeSeven = document.createElement('DIV');
  const toeEight = document.createElement('DIV');
  const toeNine = document.createElement('DIV');
//   #gamesContainer {
//   display: grid;
//   grid-template-columns: 20% 20% 20% 20% 20%;
//   grid-template-rows: 20% 20% 20% 20% 20%;
// }
  toeOne.setAttribute('id', 'toe-1');
  toeTwo.setAttribute('id', 'toe-2');
  toeThree.setAttribute('id', 'toe-3');
  toeFour.setAttribute('id', 'toe-4');
  toeFive.setAttribute('id', 'toe-5');
  toeSix.setAttribute('id', 'toe-6');
  toeSeven.setAttribute('id', 'toe-7');
  toeEight.setAttribute('id', 'toe-8');
  toeNine.setAttribute('id', 'toe-9');

  gamesContainer.appendChild(toeOne);
  gamesContainer.appendChild(toeTwo);
  gamesContainer.appendChild(toeThree);
  gamesContainer.appendChild(toeFour);
  gamesContainer.appendChild(toeFive);
  gamesContainer.appendChild(toeSix);
  gamesContainer.appendChild(toeSeven);
  gamesContainer.appendChild(toeEight);
  gamesContainer.appendChild(toeNine);
  var arr = Array.from(gamesContainer.children);
  arr.forEach(e => e.className = "TIC")


}


function updateUserName(event, userId) {

const li = document.getElementById(`${userId}`);
li.innerHTML += `<form id="update-user-form"> <label >Update User Name: <input id='update-user-text' type="text"></label>
<button id='submit'>Update User</button> </form>`


}

function patchupdateName(event, updateName, userId) {
  const body = {
    name: updateName
  };
  const config = {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body:JSON.stringify(body)
  };

  fetch(`${usersURL}/${userId}`, config).then(r=> r.json()).then(user => realtimetimeRemove(event, user, userId))
}

function realtimetimeRemove(event, user, userId) {

  event.target.parentElement.parentElement.innerHTML = `${user.name}<button id="Update User">Update</button><button id="Delete User">Delete</button><button id="notes">SHOW USER NOTES</button>`

}


function removeUser(event, userId) {
  fetch(`${usersURL}/${userId}`, {method: 'DELETE'}).then(r => r.json()).then(user => realtimeRemove(event, user, userId));

}

function realtimeRemove(event, user, userId) {
  event.target.parentElement.remove();

}



function getUsertoGetNotes(userId) {
  fetch(`${usersURL}/${userId}`).then(r => r.json()).then(user => operationWin(userId, user));
}

function operationWin(userId, user) {
  user.notes.map(note => displayNote(userId, note));
}

function displayNote(userId, note) {

  const notesList = document.getElementById('notes-container');
  const li = document.createElement('LI');
  li.setAttribute('id', `note-${note.id}`);
  const ptitle = document.createElement('P');
  ptitle.setAttribute('id', `title-${note.id}`);
  ptitle.innerText = `TITLE:
              ${note.title}`;
  const updateTitle = document.createElement('BUTTON');
  updateTitle.setAttribute('id', 'Update Title');
  updateTitle.innerText = "Update Title";
  ptitle.appendChild(updateTitle);

  const deleteTitle = document.createElement('BUTTON');
  deleteTitle.setAttribute('id', 'Delete Title');
  deleteTitle.innerText = "Delete Title";
  ptitle.appendChild(deleteTitle);

  const pbody = document.createElement('P');
  pbody.setAttribute('id', `body-${note.id}`);
  pbody.innerText = `DESCRIPTION:
                    ${note.body}`;


  const updateBody = document.createElement('BUTTON');
  updateBody.setAttribute('id', 'Update Body');
  updateBody.innerText = "Update Description";


  const deleteBody = document.createElement('BUTTON');
  deleteBody.setAttribute('id', 'Delete Body');
  deleteBody.innerText = "Delete Description";


  const deleteNote = document.createElement('BUTTON');
  deleteNote.setAttribute('id', 'Delete Note');
  deleteNote.innerText = "Delete Note";
  li.appendChild(deleteNote);
  pbody.appendChild(updateBody);
  pbody.appendChild(deleteBody);
  li.appendChild(ptitle);
  li.appendChild(pbody);
  notesList.appendChild(li);

}





fetch(usersURL).then(r => r.json()).then(getUsers);
const userForm = document.getElementById('new-user-form');
const userText = document.getElementById('new-user-text');

userForm.addEventListener('submit', function(event){
  event.preventDefault();
  const name = userText.value;
  createUser(name);
  userText.value = '';
})

function createUser(name) {
  const body = {
    name: name
  };
  const config = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body:JSON.stringify(body)
  };
  fetch(usersURL, config).then(r=> r.json()).then(displayUser)
}



function displayUser(user) {

  const usersContainer = document.getElementById('users-container');

  const li = document.createElement('LI');

  li.setAttribute('id', `${user.id}`);
  li.innerText = user.name;
  const buttonUpdate = document.createElement('BUTTON');
  buttonUpdate.setAttribute('id', 'Update User');
  buttonUpdate.innerText = 'Update';
  li.appendChild(buttonUpdate);
  const buttonDelete = document.createElement('BUTTON');
  buttonDelete.setAttribute('id', 'Delete User');
  buttonDelete.innerText = "Delete";
  li.appendChild(buttonDelete);
  const userNotes = document.createElement('BUTTON');
  userNotes.setAttribute('id', 'notes')
  userNotes.innerText = 'SHOW USER NOTES';
  li.appendChild(userNotes);
  usersContainer.appendChild(li);

}





notesForm.addEventListener('submit', function(event){
  event.preventDefault();
  const users_list = document.getElementById('users-list')
  var object;
  object = usersArray.filter(user => user.name == users_list.value)

  const title = notesTextTitle.value;
  const description = notesTextDescription.value;
  makePost(title, description, object);
  notesTextTitle.value = '';
  notesTextDescription.value = '';
})

notesList.addEventListener('click', function(event){
  event.preventDefault();
  if (event.target.innerText == "Delete Note") {
    // event.target.parentElement.id.slice(5)
    const noteId = event.target.parentElement.id.slice(5)
    destroyNote(event, noteId);
  } else if (event.target.innerText == "Delete Title") {
    const noteId = event.target.parentElement.id.slice(6)
    removeTitleFromNote(event, noteId)
  } else if (event.target.innerText == 'Delete Description') {
    const noteId = event.target.parentElement.id.slice(5)

    removeDescriptionFromNote(event, noteId)
  } else if (event.target.innerText == 'Update Title') {
    const noteId = event.target.parentElement.id.slice(6)
    updateTitleForm(noteId)
  } else if (event.target.innerText == 'Update Title Now') {
    // updateTitleFromNow()
    const noteId = event.target.parentElement.parentElement.id.slice(6);
    const titleText = document.getElementById('update-title-text');
    const titleValue = titleText.value;
    updateTitleFromNow(event, noteId, titleValue)
  } else if (event.target.innerText == 'Update Description') {
    const noteId = event.target.parentElement.id.slice(5);
    updateDescriptionForm(noteId);
  } else if (event.target.innerText == 'Update Description Now') {
    const noteId = event.target.parentElement.parentElement.id.slice(5)
    const bodyText = document.getElementById('update-body-text');
    const bodyValue = bodyText.value;
    updateDescriptionNow(event, noteId, bodyValue)

  }

})

function updateDescriptionNow (event, noteId, bodyValue) {
  const body = {
    "body": bodyValue
  };
  const config = {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body:JSON.stringify(body)
  }
  fetch(`${notesURL}/${noteId}`, config).then(r=> r.json()).then(note => displayUpdatedDescription(event, note))
}

function displayUpdatedDescription(event, note) {
  const p = document.getElementById(`body-${note.id}`)
  event.target.parentElement.parentElement.innerHTML = `<p id="body-${note.id}">DESCRIPTION: <br>              ${note.body}<button id="Update Description">Update Description</button><button id="Delete Description">Delete Description</button>`
}

function updateDescriptionForm(noteId) {
  const p = document.getElementById(`body-${noteId}`);
  p.innerHTML += `<form id="update-body-form"> <label >Update Description: <input id='update-body-text' type="text"></label>
  <button id='submit'>Update Description Now</button> </form>`
}

function updateTitleFromNow(event, noteId, titleValue) {
  const body = {
    "title": titleValue
  };
  const config = {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body:JSON.stringify(body)
  }
  fetch(`${notesURL}/${noteId}`, config).then(r=> r.json()).then(note => displayUpdatedTitle(event, note, titleValue))
}

function displayUpdatedTitle(event, note, titleValue) {
  const p = document.getElementById(`title-${note.id}`)
  event.target.parentElement.parentElement.innerHTML = `<p id="title-${note.id}">TITLE: <br>              ${note.title}<button id="Update Title">Update Title</button><button id="Delete Title">Delete Title</button>`
}

function updateTitleForm(noteId) {

  const p = document.getElementById(`title-${noteId}`);
  p.innerHTML += `<form id="update-title-form"> <label >Update Title: <input id='update-title-text' type="text"></label>
  <button id='submit'>Update Title Now</button> </form>`

}

function removeDescriptionFromNote(event, noteId) {
  const config = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({"body": ''})
  }
  fetch(`${notesURL}/${noteId}`, config).then(r=> r.json()).then(note => realTimeRemoveDescription(event, note))

}

function realTimeRemoveDescription(event, note) {
  event.target.parentElement.innerHTML = `DESCRIPTION:<br>              <button id="Update Description">Update Description</button><button id="Delete Description">Delete Description</button>`

}

function removeTitleFromNote(event, noteId) {

  const config = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({"title": ''})
  }
  fetch(`${notesURL}/${noteId}`, config).then(r=> r.json()).then(note => realTimeRemoveTitle(event, note))
}

function realTimeRemoveTitle(event, note) {
  event.target.parentElement.innerHTML = `TITLE:<br>              <button id="Update Title">Update Title</button><button id="Delete Title">Delete Title</button>`


}



function destroyNote(event, noteId) {
  fetch(`${notesURL}/${noteId}`, {method: 'DELETE'}).then(r => r.json()).then(note => realTimeRemoveNote(event, note))
}

function realTimeRemoveNote(event, note) {
  event.target.parentElement.remove();
}



function makePost(title, description, object) {
  const body = {
    "title": title,
    'body': description,
    'user_id': object[0].id
  };
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(body)
  }
fetch(notesURL, config).then(r => r.json()).then(note => operationAlert(note))
}

function operationAlert(note) {
  notesList.innerHTML = ''
}



// notesList.addEventListener('')

function getUsers(users) {
  users.map(getUser)
  users.forEach(user => usersArray.push(user));


  const usersSelection = document.createElement('SELECT');
  usersSelection.setAttribute('id', 'users-list')
  var list = usersArray.map(user => `<option id="users-${user.id}" value="${user.name}" selected="">
                            ${user.name}
                          </option>`)
  usersSelection.innerHTML = list;


  notesForm.appendChild(usersSelection)
}

function getUser(user) {
  const id = user.id
  const userList = document.getElementById('users-container');
  const li = document.createElement('LI');
  li.setAttribute('id', `${user.id}`);
  li.innerText = user.name;
  const buttonUpdate = document.createElement('BUTTON');
  buttonUpdate.setAttribute('id', 'Update User');
  buttonUpdate.innerText = 'Update';
  li.appendChild(buttonUpdate);
  const buttonDelete = document.createElement('BUTTON');
  buttonDelete.setAttribute('id', 'Delete User');
  buttonDelete.innerText = "Delete";
  li.appendChild(buttonDelete);
  const userNotes = document.createElement('BUTTON');
  userNotes.setAttribute('id', 'notes')
  userNotes.innerText = 'SHOW USER NOTES';
  li.appendChild(userNotes);
  const playGames = document.createElement('BUTTON');
  playGames.setAttribute('id', `Games-${id}`);
  playGames.innerText = "Play Games";
  li.appendChild(playGames)
  userList.appendChild(li);
  // user.notes.map(userNotes => getUserNotes(userNotes, id))
}

function getUserNotes(userNotes, id) {

  const notesList = document.getElementById('notes-container');
  const li = document.createElement('LI');
  li.setAttribute('id', `user-${id}`);
  const ptitle = document.createElement('P');
  ptitle.setAttribute('id', `title-${userNotes.id}`);
  ptitle.innerText = `TITLE:
              ${userNotes.title}`;
  const updateTitle = document.createElement('BUTTON');
  updateTitle.setAttribute('id', 'Update Title');
  updateTitle.innerText = "Update Title";
  ptitle.appendChild(updateTitle);

  const deleteTitle = document.createElement('BUTTON');
  deleteTitle.setAttribute('id', 'Delete Title');
  deleteTitle.innerText = "Delete Title";
  ptitle.appendChild(deleteTitle);

  const pbody = document.createElement('P');
  pbody.setAttribute('id', `body-${userNotes.id}`);
  pbody.innerText = `DESCRIPTION:
                    ${userNotes.body}`;




  const updateBody = document.createElement('BUTTON');
  updateBody.setAttribute('id', 'Update Body');
  updateBody.innerText = "Update Description";


  const deleteBody = document.createElement('BUTTON');
  deleteBody.setAttribute('id', 'Delete Body');
  deleteBody.innerText = "Delete Description";


  const deleteNote = document.createElement('BUTTON');
  deleteNote.setAttribute('id', 'Delete Note');
  deleteNote.innerText = "Delete Note";
  li.appendChild(deleteNote)
  pbody.appendChild(updateBody);
  pbody.appendChild(deleteBody);
  li.appendChild(ptitle);
  li.appendChild(pbody);
  notesList.appendChild(li)
}

})
