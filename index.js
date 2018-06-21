document.addEventListener('DOMContentLoaded', function(event){

const notesURL = 'http://localhost:3000/api/v1/notes';
const usersURL = 'http://localhost:3000/api/v1/users';
const bjackAPI = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';

const notesList = document.getElementById('notes-container');
const usersArray = [];
const gamesContainer = document.getElementById('games');
const searchNote = document.getElementById('search-note-form');

var count = 0;
var num_count = 0;


const notesForm = document.getElementById('new-note-form');
const notesTextTitle = document.getElementById('new-note-text-title');
const notesTextDescription = document.getElementById('new-note-text-description');
const usersSelection = document.createElement('SELECT');

const blackjack = document.getElementById('blackjack');


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
    const userId = event.target.id.slice(6);
    const gamesContainer = document.getElementById('games')
    displayBoard(event, userId);
    // display tic tae toe board

  } else if (event.target.innerText == "Game In Progress") {
    count = 0;
    const gamesContainer = document.getElementById('games');
    var arr = Array.from(gamesContainer.children);
    arr.forEach(e => e.remove())
    // event.target.innerText = "Play Games"
    var things = document.getElementsByClassName('GAMES')
    var thingsArray = Array.from(things)
    thingsArray.forEach( e => e.innerText = "Play Games")
  } else if (event.target.innerText == "Play BLACKJACK") {
    var userId = event.target.parentElement.id;
    displayTable(userId, event);
  }

})



function displayTable(userId, event) {

  var theUser = usersArray.find(e => e.id == userId);


  fetch(bjackAPI).then(r=> r.json()).then(deck => getDeck(event, deck, theUser))

}


function getDeck(event, deck, theUser) {
  var idDeck = deck.deck_id;
  var remain = deck.remaining;
  fetch(`https://deckofcardsapi.com/api/deck/${idDeck}/draw/?count=2`).then(r => r.json()).then(cards => playerCards(event, theUser, cards, idDeck));
  fetch(`https://deckofcardsapi.com/api/deck/${idDeck}/draw/?count=2`).then(r => r.json()).then(cards => houseCards(event, cards, idDeck));
}

function playerCards(event, theUser, cards, idDeck) {
  const div = document.createElement('DIV');
  div.setAttribute('id', 'player');
  div.innerHTML += `${theUser.name} <div class="${idDeck}">
      <img src="${cards.cards[0].image}">
     <img src="${cards.cards[1].image}">
  </div> `
  blackjack.appendChild(div)

  if (cards.cards[0].value == "KING" || cards.cards[0].value == "JACK" || cards.cards[0].value == "QUEEN") {
    cards.cards[0].value = 10;
  } else if (cards.cards[0].value == "ACE") {
    cards.cards[0].value = 11;
  }

  if (cards.cards[1].value == "KING" || cards.cards[1].value == "JACK" || cards.cards[1].value == "QUEEN") {
    cards.cards[1].value = 10;
  } else if (cards.cards[1].value == "ACE") {
    cards.cards[1].value = 11;
  }
  var totalValue = Number(cards.cards[0].value) + Number(cards.cards[1].value);
  if (totalValue == 21) {
    alert(`congratulations ${theUser.name}, you got blackjack!!! The house needs to pay up.`)
  }
  // div.innerHTML += `${totalValue}`;
  const hitButton = document.createElement('BUTTON');
  hitButton.setAttribute('id', `HIT-${totalValue}`);
  hitButton.innerText = "HIT";
  div.appendChild(hitButton);
  const stayButton = document.createElement('BUTTON');
  stayButton.setAttribute('id', "STAY");
  stayButton.innerText = "STAY";
  div.appendChild(stayButton);


}

function houseCards(event, cards, idDeck) {
  const div = document.createElement('DIV');
  div.setAttribute('id', 'house');
  div.innerHTML += `The House <div class="${idDeck}">
      <img src="${cards.cards[0].image}">
     <img src="${cards.cards[1].image}">
  </div>`
  blackjack.appendChild(div)

  if (cards.cards[0].value == "ACE" && cards.cards[1].value == "ACE") {
    cards.cards[1].value = 11;
    cards.cards[0].value = 1;
  } else if (cards.cards[0].value == "KING" || cards.cards[0].value == "JACK" || cards.cards[0].value == "QUEEN") {
    cards.cards[0].value = 10;
  } else if (cards.cards[0].value == "ACE" && cards.cards[1].value !== "ACE") {
    cards.cards[0].value = 11;
  }

  if (cards.cards[1].value == "KING" || cards.cards[1].value == "JACK" || cards.cards[1].value == "QUEEN") {
    cards.cards[1].value = 10;
  } else if (cards.cards[1].value == "ACE") {
    cards.cards[1].value = 11;
  }

  var totalValue = Number(cards.cards[0].value) + Number(cards.cards[1].value);
  // div.innerHTML += `${totalValue}`;

  if (totalValue < 15) {
    fetch(`https://deckofcardsapi.com/api/deck/${idDeck}/draw/?count=1`).then(r => r.json()).then(card => showHouseCard(event, card, idDeck));
  }


}

function showHouseCard(event, card, idDeck) {
  var div = document.getElementById('house');
  div.innerHTML = `<img src="${card.cards[0].image}"> ${div.innerHTML}`
}



blackjack.addEventListener('click', function(event){
  if (event.target.innerText == "HIT") {
    const idDeck = event.target.parentElement.children[0].className
    fetch(`https://deckofcardsapi.com/api/deck/${idDeck}/draw/?count=1`).then(r => r.json()).then(card => hitCard(event, card, idDeck));
  } else if (event.target.innerText == "STAY") {
    const idDeck = event.target.parentElement.children[0].className;

  }
})


function hitCard (event, card, idDeck) {
  var totalValue = Number(event.target.id.slice(4));
  if (card.cards[0].value == "KING" || card.cards[0].value == "QUEEN" || card.cards[0].value == "JACK") {
    totalValue += 10;
  } else if (card.cards[0].value == "ACE") {
    (totalValue += 11) > 21 ? totalValue += 1 : totalValue += 11;
  } else {
    totalValue += Number(card.cards[0].value);
  }

  var div = document.getElementsByClassName(`${idDeck}`)[0];
  // div.appendChild(buttonHit);
  div.innerHTML = `<img src="${card.cards[0].image}"> ${div.innerHTML}`;
  event.target.id = `HIT-${totalValue}`;
  alert(`${totalValue}`)

  if (totalValue > 21) {
    alert('You have busted');
    const buttonstopGame = document.createElement('BUTTON');
    buttonstopGame.setAttribute('id', 'end');
    buttonstopGame.innerText = 'END';
    div.appendChild(buttonstopGame);
  }

}



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
  // event.target.innerText = "Game In Progress";
  var things = document.getElementsByClassName('GAMES')
  var thingsArray = Array.from(things)
  thingsArray.forEach( e => e.innerText = "Game In Progress")


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
  updateTitle.setAttribute('id', 'Update');
  updateTitle.innerText = "Update Title";
  ptitle.appendChild(updateTitle);

  const deleteTitle = document.createElement('BUTTON');
  deleteTitle.setAttribute('id', 'Delete');
  deleteTitle.innerText = "Delete Title";
  ptitle.appendChild(deleteTitle);

  const pbody = document.createElement('P');
  pbody.setAttribute('id', `body-${note.id}`);
  pbody.innerText = `DESCRIPTION:
                    ${note.body}`;


  const updateBody = document.createElement('BUTTON');
  updateBody.setAttribute('id', 'Update');
  updateBody.innerText = "Update Description";


  const deleteBody = document.createElement('BUTTON');
  deleteBody.setAttribute('id', 'Delete');
  deleteBody.innerText = "Delete Description";


  const deleteNote = document.createElement('BUTTON');
  deleteNote.setAttribute('id', 'Delete');
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
  buttonUpdate.setAttribute('id', 'Update');
  buttonUpdate.innerText = 'Update';
  li.appendChild(buttonUpdate);

  const buttonDelete = document.createElement('BUTTON');
  buttonDelete.setAttribute('id', 'Delete');
  buttonDelete.innerText = "Delete";
  li.appendChild(buttonDelete);
  const userNotes = document.createElement('BUTTON');
  userNotes.setAttribute('id', 'notes')
  userNotes.innerText = 'SHOW USER NOTES';
  li.appendChild(userNotes);
  const playGames = document.createElement('BUTTON');
  playGames.setAttribute('id', `Games-${user.id}`);
  playGames.setAttribute('class', 'GAMES');
  playGames.innerText = "Play Games";
  li.appendChild(playGames);
  const bjack = document.createElement('BUTTON');
  bjack.innerText = 'Play BLACKJACK';
  li.appendChild(bjack);
  usersContainer.appendChild(li);



}

searchNote.addEventListener('click', function(event) {
  event.preventDefault()
  if (notesList.children.length > 0) {
    var arr = Array.from(notesList.children)
    arr.forEach(e => e.remove())
  }
  if (event.target.innerText == 'Search Title Note') {
    const noteSearchText = document.getElementById('note-title');
    const search = noteSearchText.value;
    if (search !== '') {
      searchFindNoteTitle(search);
    }
    noteSearchText.value = '';
  } else if (event.target.innerText == 'Search Description Note') {
    const noteSearchText = document.getElementById('note-description');
    const search = noteSearchText.value;
    if (search !== '') {
      searchFindNoteBody(search);
    }
    noteSearchText.value = '';
  }
})

function searchFindNoteBody(search) {
  fetch(notesURL).then(r => r.json()).then(notes => getAllNotesBody(notes, search))
}

function getAllNotesBody(notes, search) {
  notes.map(note => getNoteInfoBody(note, search))
}

function getNoteInfoBody(note, search) {
  if (note.body.includes(search)) {
    if (note.user) {
      var id = note.user.id
      var name = note.user.name
    }

    const li = document.createElement('LI');
    li.setAttribute('id', `user-${id}`);
    const ptitle = document.createElement('P');
    ptitle.setAttribute('id', `title-${note.id}`);
    ptitle.innerText = `TITLE:
                ${note.title}`;
    const updateTitle = document.createElement('BUTTON');
    updateTitle.setAttribute('id', 'Update');
    updateTitle.innerText = "Update Title";
    ptitle.appendChild(updateTitle);

    const deleteTitle = document.createElement('BUTTON');
    deleteTitle.setAttribute('id', 'Delete');
    deleteTitle.innerText = "Delete Title";
    ptitle.appendChild(deleteTitle);

    const pbody = document.createElement('P');
    pbody.setAttribute('id', `body-${note.id}`);
    pbody.innerText = `DESCRIPTION:
                      ${note.body}`;


    const updateBody = document.createElement('BUTTON');
    updateBody.setAttribute('id', 'Update');
    updateBody.innerText = "Update Description";


    const deleteBody = document.createElement('BUTTON');
    deleteBody.setAttribute('id', 'Delete');
    deleteBody.innerText = "Delete Description";


    const deleteNote = document.createElement('BUTTON');
    deleteNote.setAttribute('id', 'Delete Note');
    deleteNote.innerText = "Delete Note";
    li.appendChild(deleteNote)
    pbody.appendChild(updateBody);
    pbody.appendChild(deleteBody);
    li.appendChild(ptitle);
    li.appendChild(pbody);

    const userName = document.createElement('BUTTON');
    userName.setAttribute('id', `USER`)
    if (name) {
        userName.innerText = `${name}

        `
    } else {
      userName.innerText = `This not does not belong to a user.

      `
    }
    li.appendChild(userName)
    notesList.appendChild(li)
  }
}



function searchFindNoteTitle(search) {
  fetch(notesURL).then(r => r.json()).then(notes => getAllNotes(notes, search))
}

function getAllNotes(notes, search) {
  notes.map(note => getNoteInfo(note, search))
}

function getNoteInfo(note, search) {
  const notesList = document.getElementById('notes-container');

  if (note.title.includes(search)) {
    if (note.user) {
      var id = note.user.id
      var name = note.user.name
    }

    const li = document.createElement('LI');
    li.setAttribute('id', `user-${id}`);
    const ptitle = document.createElement('P');
    ptitle.setAttribute('id', `title-${note.id}`);
    ptitle.innerText = `TITLE:
                ${note.title}`;
    const updateTitle = document.createElement('BUTTON');
    updateTitle.setAttribute('id', 'Update');
    updateTitle.innerText = "Update Title";
    ptitle.appendChild(updateTitle);

    const deleteTitle = document.createElement('BUTTON');
    deleteTitle.setAttribute('id', 'Delete');
    deleteTitle.innerText = "Delete Title";
    ptitle.appendChild(deleteTitle);

    const pbody = document.createElement('P');
    pbody.setAttribute('id', `body-${note.id}`);
    pbody.innerText = `DESCRIPTION:
                      ${note.body}`;


    const updateBody = document.createElement('BUTTON');
    updateBody.setAttribute('id', 'Update');
    updateBody.innerText = "Update Description";


    const deleteBody = document.createElement('BUTTON');
    deleteBody.setAttribute('id', 'Delete');
    deleteBody.innerText = "Delete Description";


    const deleteNote = document.createElement('BUTTON');
    deleteNote.setAttribute('id', 'Delete');
    deleteNote.innerText = "Delete Note";
    li.appendChild(deleteNote);
    pbody.appendChild(updateBody);
    pbody.appendChild(deleteBody);
    li.appendChild(ptitle);
    li.appendChild(pbody);

    const userName = document.createElement('BUTTON');
    userName.setAttribute('id', `USER`)
    if (name) {
        userName.innerText = `${name}

        `
    } else {
      userName.innerText = `This not does not belong to a user.

      `
    }
    li.appendChild(userName)

    notesList.appendChild(li)

  }

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
  event.target.parentElement.parentElement.innerHTML = `<p id="title-${note.id}">TITLE: <br>              ${note.title}<button id="Update">Update Title</button><button id="Delete">Delete Title</button>`
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
  event.target.parentElement.innerHTML = `DESCRIPTION:<br>              <button id="Update">Update Description</button><button id="Delete">Delete Description</button>`

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
  event.target.parentElement.innerHTML = `TITLE:<br>              <button id="Update">Update</button><button id="Delete">Delete</button>`
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
  buttonUpdate.setAttribute('id', 'Update');
  buttonUpdate.innerText = 'Update';
  li.appendChild(buttonUpdate);
  const buttonDelete = document.createElement('BUTTON');
  buttonDelete.setAttribute('id', 'Delete');
  buttonDelete.innerText = "Delete";
  li.appendChild(buttonDelete);
  const userNotes = document.createElement('BUTTON');
  userNotes.setAttribute('id', 'notes')
  userNotes.innerText = 'SHOW USER NOTES';
  li.appendChild(userNotes);
  const playGames = document.createElement('BUTTON');
  playGames.setAttribute('id', `Games-${id}`);
  playGames.setAttribute('class', 'GAMES');
  playGames.innerText = "Play Games";
  li.appendChild(playGames);
  const bjack = document.createElement('BUTTON');
  bjack.innerText = 'Play BLACKJACK';
  li.appendChild(bjack);
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
  updateTitle.setAttribute('id', 'Update');
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
  updateBody.setAttribute('id', 'Update');
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


gamesContainer.addEventListener('click', function(event) {

const toeOne = document.getElementById('toe-1');
const toeTwo = document.getElementById('toe-2');
const toeThree = document.getElementById('toe-3');
const toeFour = document.getElementById('toe-4');
const toeFive = document.getElementById('toe-5');
const toeSix = document.getElementById('toe-6');
const toeSeven = document.getElementById('toe-7');
const toeEight = document.getElementById('toe-8');
const toeNine = document.getElementById('toe-9');

  if (event.target.className == "TIC") {
    const toeId = event.target.id;
    var element = document.getElementById(toeId);
    if ((toeOne.innerHTML == "X" && toeTwo.innerHTML == "X" && toeThree.innerHTML == "X") ||
    (toeFour.innerHTML == "X" && toeFive.innerHTML == "X" && toeSix.innerHTML == "X") ||
    (toeSeven.innerHTML == "X" && toeEight.innerHTML == "X" && toeNine.innerHTML == "X") ||
    (toeOne.innerHTML == "X" && toeFour.innerHTML == "X" && toeSeven.innerHTML == "X") ||
    (toeTwo.innerHTML == "X" && toeFive.innerHTML == "X" && toeEight.innerHTML == "X") ||
    (toeThree.innerHTML == "X" && toeSix.innerHTML == "X" && toeNine.innerHTML == "X") ||
    (toeOne.innerHTML == "X" && toeFive.innerHTML == "X" && toeNine.innerHTML == "X") ||
    (toeThree.innerHTML == "X" && toeFive.innerHTML == "X" && toeSeven.innerHTML == "X"))  {
      alert('PLAYER X has WON THE GAME!')
      count = 0;
      const gamesContainer = document.getElementById('games');
      var arr = Array.from(gamesContainer.children);
      arr.forEach(e => e.remove())
      // event.target.innerText = "Play Games"
      var things = document.getElementsByClassName('GAMES')
      var thingsArray = Array.from(things)
      thingsArray.forEach( e => e.innerText = "Play Games")
    } else if ((toeOne.innerHTML == "O" && toeTwo.innerHTML == "O" && toeThree.innerHTML == "O") ||
    (toeFour.innerHTML == "O" && toeFive.innerHTML == "O" && toeSix.innerHTML == "O") ||
    (toeSeven.innerHTML == "O" && toeEight.innerHTML == "O" && toeNine.innerHTML == "O") ||
    (toeOne.innerHTML == "O" && toeFour.innerHTML == "O" && toeSeven.innerHTML == "O") ||
    (toeTwo.innerHTML == "O" && toeFive.innerHTML == "O" && toeEight.innerHTML == "O") ||
    (toeThree.innerHTML == "O" && toeSix.innerHTML == "O" && toeNine.innerHTML == "O") ||
    (toeOne.innerHTML == "O" && toeFive.innerHTML == "O" && toeNine.innerHTML == "O") ||
    (toeThree.innerHTML == "O" && toeFive.innerHTML == "O" && toeSeven.innerHTML == "O"))  {
      alert('PLAYER O has WON THE GAME!')
      count = 0;
      const gamesContainer = document.getElementById('games');
      var arr = Array.from(gamesContainer.children);
      arr.forEach(e => e.remove())
      // event.target.innerText = "Play Games"
      var things = document.getElementsByClassName('GAMES')
      var thingsArray = Array.from(things)
      thingsArray.forEach( e => e.innerText = "Play Games")
    } else if (element.innerHTML == '' && count % 2 == 0) {
      element.innerHTML = "X"
      count++;
    } else if (element.innerHTML == "" && count % 2 !== 0) {
      element.innerHTML = "O"
      count++;
    } else if (count == 9) {
      alert('game is a draw.')
      count = 0;
      const gamesContainer = document.getElementById('games');
      var arr = Array.from(gamesContainer.children);
      arr.forEach(e => e.remove());
      var things = document.getElementsByClassName('GAMES');
      var thingsArray = Array.from(things);
      thingsArray.forEach( e => e.innerText = "Play Games")
    }
  }

})









})
