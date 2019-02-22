class Photo {
  constructor(id, title, caption, img) {
    this.id = id;
    this.title = title;
    this.caption = caption;
    this.img = img;
    this.favorite = false;
  }

  saveToStorage(albumArr) {
    localStorage.setItem('album', JSON.stringify(albumArr));
  }

  updatePhoto(id, type, content) {
    let albumArray = this.pullFromStorage();
    let photoFound = albumArray[this.findPhotoId(id)];
    (type === 'title')?
    photoFound.title = content
    : (type === 'caption')?
    photoFound.caption = content
    : (type === 'favorite')?
    photoFound.favorite = content
    : false; //check for image for the extra feature later
    this.saveToStorage(albumArray);
  }

  deleteFromStorage(id) {
    let albumArray = this.pullFromStorage();
    albumArray.splice(this.findPhotoId(id), 1);
    this.saveToStorage(albumArray);
  }

  pullFromStorage() {
    return JSON.parse(localStorage.getItem('album'));
  }

  findPhotoId(id) {
    let albumArray = this.pullFromStorage();
    return albumArray.findIndex(photo => photo.id === id);
  }
  ////NEW METHOD FOR PHOTO CONVERSION????
}


// TESTING CLASS CODE BELOW
const album = new Photo();

const albumArray = [
  {
  id: 1,
  title: 'Photo ONE',
  caption: 'A cool photo',
  favorite: false,
  img: 'work on this later'
  },
  {
  id: 2,
  title: 'Photo TWO',
  caption: 'A cool photo',
  favorite: false,
  img: 'work on this later'
  },
  {
  id: 3,
  title: 'Photo THREE',
  caption: 'A cool photo',
  favorite: false,
  img: 'work on this later'
  }
];

album.saveToStorage(albumArray);
album.deleteFromStorage(3);
album.updatePhoto(1, 'favorite', true);
album.updatePhoto(2, 'caption', 'A COOL CAT PHOTO');