window.addEventListener('load', () => {
  let albumArray = JSON.parse(localStorage.getItem('album')) || [];
  const queryElement = (id) => document.querySelector(`${id}`);
  mainEventHandler(queryElement);
  albumArray.length > 10 ? sliceAlbum() : reloadImages();
  countFavorites(1);
});

function mainEventHandler(query) {
  query('form').addEventListener('click', validateFields);
  query('#album-section').addEventListener('click', photoEventHandler);
  query('#view-fav-btn').addEventListener('click', (e) => {
    let filterSwitch = e.target.value ^= true;
    filterSwitch === 1 ? filterFavorites(1, e) : reloadImages(filterSwitch);
  });
  query('#search-input').addEventListener('keyup', (e) => {
    e.target.value ? filterAlbum(e) :  reloadImages();
  });
  query('#showMoreLess').addEventListener('click', (e) => {
    let moreLessSwitch = e.target.value ^= true;
    moreLessSwitch === 1 ? reloadImages(moreLessSwitch) : sliceAlbum();
  })
}

function sliceAlbum() {
  let albumArray = JSON.parse(localStorage.getItem('album'))
  document.querySelector('#album-section').innerHTML = '';
  albumArray.slice(albumArray.length - 10).forEach(photo => photoTemplate(photo));
  document.querySelector('#showMoreLess').style.display = 'block';
  document.querySelector('#showMoreLess').textContent = 'Show More';
}

function reloadImages(onOff) {
  let albumArray = JSON.parse(localStorage.getItem('album'))
  document.querySelector('#album-section').innerHTML = '';
  albumArray.forEach(photo => photoTemplate(photo));
  onOff === 0 ?  countFavorites(1) 
  : document.querySelector('#showMoreLess').textContent = 'Show Less';
}

function savePhoto(obj) {
  const reader = new FileReader();
  reader.readAsDataURL(obj.imgInput);
  reader.onload = () => {
    let albumArray = JSON.parse(localStorage.getItem('album')) || [];
    const albumInstance = new Photo(Date.now(), obj.titleInput, obj.captionInput, reader.result);
    albumArray.push(albumInstance);
    albumInstance.saveToStorage(albumArray);
    photoTemplate(albumInstance);
  }
  document.querySelector('form').reset();
  document.querySelector('#upload-btn').textContent = 'Choose File'
}

function validateFields(e) {
  const inputField = {
  titleInput : document.querySelector('#photo-title').value,
  captionInput : document.querySelector('#photo-caption').value,
  imgInput : document.querySelector('#upload-input').files[0],
  }
  inputField.titleInput && inputField.captionInput && inputField.imgInput && e.target.id === 'create-photo-btn'?  
  savePhoto(inputField) : insertError(e, inputField);
  const isPickleRick = new Set(['pickle', 'rick']);
  isPickleRick.has(inputField.titleInput) || isPickleRick.has(inputField.captionInput) ? pickleRickkkk() : false;
}

function insertError(e, obj) {
  document.querySelector('#upload-input').addEventListener('change', (e) => {
    document.querySelector('#upload-btn').textContent = '1 Image Chosen';
    obj.titleInput && obj.captionInput ? submitBtn.textContent = 'Add to Album' : false;
  })
  let submitBtn = document.querySelector('#create-photo-btn');
  obj.titleInput && obj.captionInput && obj.imgInput? 
  submitBtn.textContent = 'Add to Album' :  submitBtn.textContent = 'Fields Required';
}

function photoTemplate(obj) {
  let section = document.querySelector('#album-section');
  section.innerHTML += 
  `<article data-id="${obj.id}">
    <p id="photoTitle" contenteditable="true">${obj.title}</p>
    <div class="img-container hover-state">
      <label for="upload-input"><img class="hover-state-click" id="img-elem" src="${obj.img}"></label>
      <span class="edit-img-indicator">Change Image</span>
    </div>
    <p id="photoCaption" contenteditable="true">${obj.caption}</p>
    <div class="trash-fav-icon-container">
      <img id="delete-photo-btn" class="icons-album hover-state-click" src="images/delete.svg" alt="trash icon">
      <img id="favorite-photo-btn" class="icons-album hover-state-click" 
      src="${obj.favorite === 1 ? 'images/favorite-active.svg' : 'images/favorite.svg'}" 
      alt="favorite icon">
    </div>
  </article>`;
}

function photoEventHandler(e) {
  let photoClass = new Photo();
  e.target.id === 'photoTitle' || e.target.id === 'photoCaption' ?
    editPhotoText(e, photoClass)
    : e.target.id === 'delete-photo-btn' || e.target.id === 'favorite-photo-btn' ?
    favOrDeletePhoto(e, photoClass)
    : e.target.parentElement.parentElement.classList.contains('img-container') ?
    editImage(e, photoClass) : false;
}

function editPhotoText(e, methods) {
  const photoID = parseInt(e.target.parentElement.dataset.id);
  e.target.addEventListener('keyup', () => {
    console.log('yello');
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
      e.target.src = 'images/favorite-active.svg'  
    : e.target.src = 'images/favorite.svg' ;
  }
  e.target.id === 'delete-photo-btn' ?  deletePhoto() : favoritePhoto();
  countFavorites(1);
}

function filterAlbum(e) {
  let albumArray = JSON.parse(localStorage.getItem('album'));
  let searchValue = e.target.value.toUpperCase();
  const isPickleRick = new Set(['PICKLE', 'RICK']);
  isPickleRick.has(searchValue) ? pickleRickkkk() : false;
  let section = document.querySelector('#album-section');
  section.innerHTML = '';
  const filterResult = albumArray.filter(photo => 
    photo.title.toUpperCase().indexOf(searchValue) === 0  
    || photo.caption.toUpperCase().indexOf(searchValue) === 0
  );
  filterResult.forEach(photo => photoTemplate(photo))
}

function filterFavorites(value, e) {
  let albumArray = JSON.parse(localStorage.getItem('album'));
  const favoritePhotos = albumArray.filter( photo =>
  photo.favorite.toString().indexOf(value.toString()) === 0)
  let section = document.querySelector('#album-section');
  section.innerHTML = '';
  favoritePhotos.forEach(photo => photoTemplate(photo));
  e.target.textContent = 'View All';
}

function countFavorites(value) {
  let albumArray = JSON.parse(localStorage.getItem('album'));
  const favoritePhotos = albumArray.filter( photo => 
  photo.favorite.toString().indexOf(value.toString()) === 0)
  document.querySelector('#view-fav-btn').textContent = 
  `View ${favoritePhotos.length.toString()} Favorites`;
}

function editImage(e) {
  const photoID = parseInt(e.target.parentElement.parentElement.parentElement.dataset.id);
  let photoTarget = e.target;
  document.querySelector('#upload-input').addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      const albumInstance = new Photo();
      albumInstance.updatePhoto(photoID, 'image', reader.result);
      photoTarget.src = reader.result;
    }
  })
}

function pickleRickkkk() {
  document.querySelector('#search-input').value = '';
  let seconds = 0;
  const pickleRickAudio = new Audio('images/pickle-rick/pickle-rickkkk.mp3');
  pickleRickAudio.play();
  const countSecs = () => {
    seconds++;
    seconds === 8 ? pickle.style.display = 'none' : false;
    seconds === 9 ? clearInterval(timer) : false;
  }
  let timer = setInterval(countSecs, 1000)
  const pickle = document.querySelector('.pickle-rick');
  pickle.style.display = 'block';
}