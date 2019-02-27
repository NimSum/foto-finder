window.addEventListener('load', loadEverything);

function loadEverything() {
  let albumArray = JSON.parse(localStorage.getItem('album')) || [];
  albumArray.length > 10 ? sliceAlbum() : false;
  albumArray.length ? reloadImages() : document.querySelector('.no-image-error').style.display = 'block';
  mainEventHandler();
  countFavorites(1);
}

function mainEventHandler() {
  document.querySelector('form').addEventListener('click', validateFields);
  document.querySelector('#album-section').addEventListener('click', photoEventHandler);
  document.querySelector('#view-fav-btn').addEventListener('click', toggleFavorites);
  document.querySelector('#show-more-less').addEventListener('click', toggleShowMoreLess);
  document.querySelector('#search-input').addEventListener('keyup', (e) => {
    e.target.value.length >= 1 ? filterAlbum(e) :  reloadImages();
  });
}

function toggleFavorites(e) {
  let filterSwitch = e.target.dataset.onoff ^= 1;
  filterSwitch === 1 ? filterFavorites(true) : reloadImages();
  filterSwitch === 0 ? countFavorites(true) : e.target.textContent = 'Show All';
}

function toggleShowMoreLess(e) {
  let onOrOff = e.target.dataset.onOff ^= true;
  onOrOff === 1 ? reloadImages() : sliceAlbum();
  onOrOff === 0 ? true : document.querySelector('#show-more-less').textContent = 'Show Less';
}

function sliceAlbum() {
  let albumArray = JSON.parse(localStorage.getItem('album'));
  clearAlbumSection();
  albumArray.slice(albumArray.length - 10).forEach(photo => photoTemplate(photo));
  document.querySelector('#show-more-less').style.display = 'block';
  document.querySelector('#show-more-less').textContent = 'Show More';
}

function reloadImages() {
  let albumArray = JSON.parse(localStorage.getItem('album'));
  clearAlbumSection();
  albumArray.forEach(photo => photoTemplate(photo));
  document.querySelector('main').style.display = '';
}

function validateFields(e) {
  const inputField = {
    titleInput : document.querySelector('#photo-title').value,
    captionInput : document.querySelector('#photo-caption').value,
    imgInput : document.querySelector('#upload-input').files[0],
  }
  inputField.titleInput && inputField.captionInput && inputField.imgInput && e.target.id === 'create-photo-btn' ?  
    convertPhoto(inputField) 
    : uploadBtnCheck(inputField);
}

function uploadBtnCheck(obj) {
  const textInputs = obj.titleInput && obj.captionInput;
  textInputs && obj.imgInput ? uploadBtnOnOff(1) : false;
  document.querySelector('#upload-input').addEventListener('change', (e) => {
    document.querySelector('#upload-btn').textContent = `Image Chosen: ${e.target.files[0].name}`;
    textInputs ? uploadBtnOnOff(1) : false;
  });
}

function uploadBtnOnOff(onOff) {
  let btn = document.querySelector('#create-photo-btn');
  const disable = () => {
    btn.classList.remove('hover-state');
    btn.classList.add('gray-txt');
  }
  const enable = () => {
    btn.classList.add('hover-state');
    btn.classList.remove('gray-txt');
  }
  onOff === 1 ? enable() : disable();
}

function convertPhoto(obj) {
  const reader = new FileReader();
  reader.readAsDataURL(obj.imgInput);
  reader.onload = () =>  createAndSaveImg(reader.result, obj);
  document.querySelector('form').reset();
  document.querySelector('#upload-btn').textContent = 'Choose File';
  document.querySelector('.no-image-error').style.display = '';
  uploadBtnOnOff(0);
}

function createAndSaveImg(result, obj) {
  let albumArray = JSON.parse(localStorage.getItem('album')) || [];
  const albumInstance = new Photo(Date.now(), obj.titleInput, obj.captionInput, result);
  albumArray.push(albumInstance);
  albumInstance.saveToStorage(albumArray);
  photoTemplate(albumInstance);
}

function photoTemplate(obj) {
  document.querySelector('#album-section').innerHTML += 
  `<article data-id="${obj.id}">
    <p id="photoTitle" contenteditable="true">${obj.title}</p>
    <div class="img-container hover-state">
      <label for="upload-input"><img id="img-elem" src="${obj.img}"></label>
      <span class="edit-img-indicator">Change Image</span>
    </div>
    <p id="photoCaption" class="no-margin-top" contenteditable="true">${obj.caption}</p>
    <div class="trash-fav-icon-container">
      <img id="delete-photo-btn" class="photo-icons" src="images/delete.svg" alt="trash icon">
      <img id="favorite-photo-btn" class="photo-icons animate-heart"
      src="${obj.favorite === true ? 'images/favorite-active.svg' : 'images/favorite.svg'}" alt="favorite icon">
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
  convertNewImg(e) : false;
}

function editPhotoText(e, photoMethods) {
  const photoID = parseInt(e.target.parentElement.dataset.id);
  e.target.addEventListener('keyup', () => {
  e.target.id === 'photoTitle' ?
  photoMethods.updatePhoto(photoID, 'title', e.target.textContent)
  : e.target.id === 'photoCaption' ? 
    photoMethods.updatePhoto(photoID, 'caption', e.target.textContent)
  : false;
  })
}

function favOrDeletePhoto(e, photoMethods) {
  const photoParentID = parseInt(e.target.parentElement.parentElement.dataset.id);
  const deletePhoto = () => {
    photoMethods.deleteFromStorage(photoParentID);
    e.target.parentElement.parentElement.remove();
  }
  e.target.id === 'delete-photo-btn' ?  
  deletePhoto() : favoritePhoto(e, photoMethods, photoParentID);
}

function favoritePhoto(e, photoMethods, id) {
  let favSwitch = e.target.dataset.favorite ^= 1;
  photoMethods.updatePhoto(id, 'favorite',  favSwitch === 1 ? true : false);
  favSwitch === 1 ? 
    e.target.src = 'images/favorite-active.svg'  
  : e.target.src = 'images/favorite.svg';

  countFavorites(true);
}

function filterAlbum(e) {
  let albumArray = JSON.parse(localStorage.getItem('album'));
  clearAlbumSection();
  const filterResult = albumArray.filter(photo => 
    photo.title.toUpperCase().indexOf(e.target.value.toUpperCase()) === 0  
    || photo.caption.toUpperCase().indexOf(e.target.value.toUpperCase()) === 0
  );
  filterResult.length === 0 ? document.querySelector('.no-result-error').style.display = 'block' : false;  
  filterResult.forEach(photo => photoTemplate(photo));
  document.querySelector('main').style.display = 'none';
  e.target.value.toUpperCase() === 'PICKLE' ? pickleRickkkk() : false;
}

function filterFavorites(value) {
  clearAlbumSection();
  let albumArray = JSON.parse(localStorage.getItem('album'));
  const favoritePhotos = albumArray.filter( photo => 
    photo.favorite.toString().indexOf(value.toString()) === 0);
  favoritePhotos.forEach(photo => photoTemplate(photo));
}

function clearAlbumSection() {
  document.querySelector('#album-section').innerHTML = '';
  document.querySelector('.no-result-error').style.display = '';
}

function countFavorites(value) {
  let albumArray = JSON.parse(localStorage.getItem('album'));
  const favoritePhotos = albumArray.filter(photo => photo.favorite.toString().indexOf(value.toString()) === 0)
  document.querySelector('#view-fav-btn').textContent = `View ${favoritePhotos.length.toString()} Favorites`; 
}

function convertNewImg(e) {
  const photoID = parseInt(e.target.parentElement.parentElement.parentElement.dataset.id);
  let photoTarget = e.target;
  document.querySelector('#upload-input').addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => insertAndSaveImg(reader.result, photoID, photoTarget);
  }) 
}

function insertAndSaveImg(img, id, imgsrc) {
  const albumInstance = new Photo();
  albumInstance.updatePhoto(id, 'image', img);
  imgsrc.src = img;
  document.querySelector('#upload-btn').textContent = 'Choose File';
}

function pickleRickkkk() {
  pickleRickkkkkkkkkk();
  let seconds = 0;
  const countSecs = () => {
    seconds++
    seconds === 8 ? document.querySelector('.pickle-rick').style.display = 'none' : false;
    seconds === 9 ? clearInterval(timer) : false;
  }
  let timer = setInterval(countSecs, 1000)
}

function pickleRickkkkkkkkkk() {
  const pickleRickAudio = new Audio('images/pickle-rick/pickle-rickkkk.mp3');
  pickleRickAudio.play();
  document.querySelector('#search-input').value = '';
  document.querySelector('.pickle-rick').style.display = 'block';
}
