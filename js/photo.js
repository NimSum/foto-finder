class Photo {
  constructor(id, title, caption, img) {
    this.id = id;
    this.title = title;
    this.caption = caption;
    this.favorite = 0;
    this.img = img;
  }

  saveToStorage(albumArr) {
    localStorage.setItem('album', JSON.stringify(albumArr));
  }

  updatePhoto(id, type, content) {
    let albumArray = JSON.parse(localStorage.getItem('album'));
    let photoFound = albumArray[this.findPhotoIndex(id)];
    (type === 'title')?
    photoFound.title = content
    : (type === 'caption')?
    photoFound.caption = content
    : (type === 'favorite')?
    photoFound.favorite = content 
    : (type === 'image')?
    photoFound.img = content  : false;
    this.saveToStorage(albumArray);
  }

  deleteFromStorage(id) {
    let albumArray = JSON.parse(localStorage.getItem('album'));
    albumArray.splice(this.findPhotoIndex(id), 1);
    this.saveToStorage(albumArray);
  }

  findPhotoIndex(photoID) {
    let albumArray = JSON.parse(localStorage.getItem('album'));
    return albumArray.findIndex(photo => photo.id === photoID);
  }
}