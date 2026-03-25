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

  $.getJSON("/api/books")
    .done(function (books) {
      addCards(books)
    })
    .fail(function () {
      console.error("Could not load books from the server. Is the app running (npm start)?")
    })

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