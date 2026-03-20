const cardList = [
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    image: 'images/book3.jpg',
    link: 'About this book',
    desciption:
      'Timeless lessons on wealth, greed, and happiness. How people think about money and behavior.'
  },
  {
    title: 'The Chronicles of Narnia',
    author: 'C. S. Lewis',
    image: 'images/book4.jpg',
    link: 'About this book',
    desciption:
      'Classic fantasy tales of children who discover the world of Narnia through the wardrobe. Adventure, allegory, and memorable talking beasts.'
  },
  {
    title: 'Shoe Dog',
    author: 'Phil Knight',
    image: 'images/book5.jpg',
    link: 'About this book',
    desciption:
      "A memoir by Nike's co-founder. The early struggles, risks, and hustle behind building a global brand from selling shoes out of a car trunk."
  }
];

const clickMe = () => {
  alert('Welcome to the Book Store. Hope you have a nice day!');
};

const addCards = (items) => {
  items.forEach((item) => {
    const itemToAppend =
      '<div class="col s4 center-align">' +
      '<div class="card medium">' +
      '<div class="card-image waves-effect waves-block waves-light">' +
      '<img class="activator" src="' +
      item.image +
      '">' +
      '</div>' +
      '<div class="card-content">' +
      '<span class="card-title grey-text text-darken-4">' +
      item.title +
      '</span>' +
      '<p class="card-hint grey-text">Click the cover or link below for details</p>' +
      '<p><a href="#!" class="activator waves-effect">' +
      item.link +
      '</a></p>' +
      '</div>' +
      '<div class="card-reveal">' +
      '<span class="card-title grey-text text-darken-4">' +
      item.title +
      '<i class="material-icons right">close</i></span>' +
      '<p class="card-author"><strong>Author</strong> — ' +
      item.author +
      '</p>' +
      '<p class="card-text">' +
      item.desciption +
      '</p>' +
      '</div>' +
      '</div>' +
      '</div>';
    $('#card-section').append(itemToAppend);
  });
};

$(document).ready(function () {
  $('.materialboxed').materialbox();
  $('.modal').modal();

  $('#clickMeButton').click(() => {
    clickMe();
  });

  addCards(cardList);

  $('#bookFormSubmit').click(() => {
    const title = $('#book_title').val();
    const image = $('#book_image').val();
    const description = $('#book_description').val();

    console.log('New book form data:');
    console.log('Title:', title);
    console.log('Image:', image);
    console.log('Description:', description);

    $('#bookFormModal').modal('close');
  });
}); 