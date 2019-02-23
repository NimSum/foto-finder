window.addEventListener('load', () => {
  let albumArray = JSON.parse(localStorage.getItem('album')) || [];
  const queryElement = (id) => document.querySelector(`${id}`);
  mainEventHandler(queryElement);
  albumArray.forEach(photo => photoTemplate(photo));
});

function mainEventHandler(query) {
    query('#create-photo-btn').addEventListener('click', validateFields);
    query('#album-section').addEventListener('click', photoEventHandler);
  // query('#search-input').addEventListener('keyup', randomFunction);
  // query('#view-fav-btn').addEventListener('click', randomFunction);
}

function validateFields() {
  const queryElement = (id) => document.querySelector(`${id}`);
  const inputField = {
  titleInput : queryElement('#photo-title').value,
  captionInput : queryElement('#photo-caption').value,
  imgInput : queryElement('#upload-input').files[0],
  }
  inputField.titleInput && inputField.captionInput && inputField.imgInput ? 
  savePhoto(inputField)
  : false;
}

function savePhoto(obj) {
  const reader = new FileReader();
  reader.readAsDataURL(obj.imgInput);
  reader.onload = () => {
    let timeStamp = Date.now();
    let albumArray = JSON.parse(localStorage.getItem('album')) || [];
    const albumInstance = new Photo(timeStamp, obj.titleInput, obj.captionInput, reader.result);
    albumArray.push(albumInstance);
    albumInstance.saveToStorage(albumArray);
    photoTemplate(albumInstance);
  }
}

function photoTemplate(obj) {
  let section = document.querySelector('#album-section');
  section.innerHTML += 
  `<article data-id="${obj.id}">
    <p id="photoTitle" contenteditable="true">${obj.title}</p>
    <div class="img-container"><img src="${obj.img}"></div>
    <p id="photoCaption" contenteditable="true">${obj.caption}</p>
    <div class="trash-fav-icon-container">
      <img id="delete-photo-btn" class="icons-album" src="images/delete.svg" alt="trash icon">
      <img id="favorite-photo-btn" class="icons-album" data-favorite="${obj.favorite}" 
      src="${obj.favorite === 1 ? 'images/favorite-active.svg' 
      : 'images/favorite.svg'}" alt="favorite icon">
    </div>
  </article>`;
}

function photoEventHandler(e) {
  let photoClass = new Photo();
  (e.target.id === 'photoTitle' || e.target.id === 'photoCaption')?
    editPhotoText(e, photoClass)
    : (e.target.id === 'delete-photo-btn' || e.target.id === 'favorite-photo-btn') ?
    favOrDeletePhoto(e, photoClass)
    : false
}

function editPhotoText(e, methods) {
  const photoID = parseInt(e.target.parentElement.dataset.id);
  e.target.addEventListener('keyup', () => {
    let newContent = e.target.textContent;
    e.target.id === 'photoTitle' ? 
    methods.updatePhoto(photoID, 'title', newContent)
    : e.target.id === 'photoCaption' ? 
    methods.updatePhoto(photoID, 'caption', newContent)
    : false;
  })
}

function favOrDeletePhoto(e, methods) {
  const photoParentID = parseInt(e.target.parentElement.parentElement.dataset.id);
  const deletePhoto = () => {
    methods.deleteFromStorage(photoParentID);
    e.target.parentElement.parentElement.remove();
  }
  const favoritePhoto = () => {
    let favSwitch = e.target.dataset.favorite ^= true;
    methods.updatePhoto(photoParentID, 'favorite', favSwitch);
    favSwitch === 1 ? 
    e.target.src = "images/favorite-active.svg" 
    : e.target.src = "images/favorite.svg" ;
  }
  (e.target.id === 'delete-photo-btn')?  deletePhoto() : favoritePhoto();
}
// const imgId = e.target.parentElement.parentElement.dataset.id;  

// e.target.addEventListener('keyup', () => {
//   let newContent = e.target.textContent;
//   e.target.id === 'photoTitle' ? 
//   editPhotoText(photoID, 'title', newContent)
//   : e.target.id === 'photoCaption' ? 
//   editPhotoText(photoID, 'caption', newContent)
//   : false;
// })
// }

// function editPhotoText(id, type, content) {
// let tempInstance = new Photo();
// tempInstance.updatePhoto(parseInt(id), type, content);
// }