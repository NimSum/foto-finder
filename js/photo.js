class Photo {
  constructor(id, title, caption, img) {
    this.id = id;
    this.title = title;
    this.caption = caption;
    this.img = img;
    this.favorite = 0;
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
    photoFound.favorite = content : false;
     //check for image for the extra feature later
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
  ////NEW METHOD FOR PHOTO CONVERSION????
}


// TESTING CLASS CODE BELOW
// const album = new Photo();

// const albumArray = [
//   {
//   id: 1,
//   title: 'Photo ONE',
//   caption: 'A cool photo',
//   favorite: false,
//   img: 'work on this later'
//   },
//   {
//   id: 2,
//   title: 'Photo TWO',
//   caption: 'A cool photo',
//   favorite: false,
//   img: 'work on this later'
//   },
//   {
//   id: 3,
//   title: 'Photo THREE',
//   caption: 'A cool photo',
//   favorite: false,
//   img: 'work on this later'
//   }
// ];

// album.saveToStorage(albumArray);
// // album.deleteFromStorage(3);
// album.updatePhoto(1, 'favorite', true);
// album.updatePhoto(1, 'title', 'A CAT PHOTO');
// album.updatePhoto(2, 'caption', 'A COOL DOGGO PHOTO');