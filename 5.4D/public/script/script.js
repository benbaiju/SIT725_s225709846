const apiOrigin =
  typeof window !== 'undefined' &&
  window.location.port === '3000' &&
  window.location.protocol !== 'file:'
    ? ''
    : 'http://localhost:3000';

const getAllBooksBtn = document.getElementById('getAllBooksBtn');
const toggleAddBookBtn = document.getElementById('toggleAddBookBtn');
const toggleEditBookBtn = document.getElementById('toggleEditBookBtn');
const toggleDeleteBookBtn = document.getElementById('toggleDeleteBookBtn');
const addBookSection = document.getElementById('addBookSection');
const editBookSection = document.getElementById('editBookSection');
const deleteBookSection = document.getElementById('deleteBookSection');
const deleteBookIdDisplay = document.getElementById('deleteBookIdDisplay');
const deleteBookStatusEl = document.getElementById('deleteBookStatus');
const deleteConfirmBtn = document.getElementById('deleteConfirmBtn');
const booksSection = document.getElementById('booksSection');
const bookDetailsSection = document.getElementById('bookDetailsSection');
const listEl = document.getElementById('booksList');
const listStatusEl = document.getElementById('listStatus');
const detailEl = document.getElementById('bookDetail');
const detailStatusEl = document.getElementById('detailStatus');
const detailTitleEl = document.getElementById('detailTitle');
const detailAuthorEl = document.getElementById('detailAuthor');
const detailYearEl = document.getElementById('detailYear');
const detailGenreEl = document.getElementById('detailGenre');
const detailSummaryEl = document.getElementById('detailSummary');
const detailPriceEl = document.getElementById('detailPrice');

const addBookForm = document.getElementById('addBookForm');
const addBookStatusEl = document.getElementById('addBookStatus');
const editBookForm = document.getElementById('editBookForm');
const editBookStatusEl = document.getElementById('editBookStatus');
const editBookIdDisplay = document.getElementById('editBookIdDisplay');
const editBookSubmitBtn = document.getElementById('editBookSubmitBtn');

let selectedBookId = null;
let booksLoadedOnce = false;

function applyYearMax() {
  const y = String(new Date().getFullYear());
  document.querySelectorAll('input[name="year"]').forEach((el) => {
    el.max = y;
  });
}

applyYearMax();

function showListStatus(message, isError) {
  listStatusEl.textContent = message;
  listStatusEl.classList.toggle('error', !!isError);
}

function showDetailStatus(message, isError) {
  detailStatusEl.textContent = message;
  detailStatusEl.classList.toggle('error', !!isError);
}

function showAddBookStatus(message, isError) {
  addBookStatusEl.textContent = message;
  addBookStatusEl.classList.toggle('error', !!isError);
}

function showEditBookStatus(message, isError) {
  editBookStatusEl.textContent = message;
  editBookStatusEl.classList.toggle('error', !!isError);
}

function showDeleteBookStatus(message, isError) {
  deleteBookStatusEl.textContent = message;
  deleteBookStatusEl.classList.toggle('error', !!isError);
}

function syncDeletePanel() {
  deleteBookIdDisplay.textContent = selectedBookId || '—';
  deleteConfirmBtn.disabled = !selectedBookId;
}

function formatAudPrice(price) {
  if (price == null || price === '') return '—';
  return `${price} AUD`;
}

function listLineText(book) {
  const title = book.title || '(untitled)';
  const pricePart =
    book.price != null && book.price !== '' ? String(book.price) : '—';
  return `${title} ${pricePart} AUD`;
}

function resetEditFormState() {
  selectedBookId = null;
  editBookIdDisplay.textContent = '—';
  editBookSubmitBtn.disabled = true;
  editBookForm.reset();
  showEditBookStatus('');
  syncDeletePanel();
}

function clearDetailView() {
  detailEl.hidden = true;
  detailTitleEl.textContent = '';
  detailAuthorEl.textContent = '';
  detailYearEl.textContent = '';
  detailGenreEl.textContent = '';
  detailSummaryEl.textContent = '';
  detailPriceEl.textContent = '';
}

function clearDetail() {
  clearDetailView();
  resetEditFormState();
}

function selectListItem(selectedLi) {
  listEl.querySelectorAll('li').forEach((li) => li.classList.remove('selected'));
  if (selectedLi) selectedLi.classList.add('selected');
}

function findLiByBookId(id) {
  return [...listEl.querySelectorAll('li')].find((li) => li.dataset.id === id);
}

function populateEditForm(book) {
  editBookForm.title.value = book.title || '';
  editBookForm.author.value = book.author || '';
  editBookForm.year.value = book.year != null ? String(book.year) : '';
  editBookForm.genre.value = book.genre || '';
  editBookForm.summary.value = book.summary || '';
  const p = book.price != null && book.price !== '' ? String(book.price).replace(/\s*AUD\s*$/i, '') : '';
  editBookForm.price.value = p;
}

function httpErrorMessage(data, status, path) {
  if (typeof data.message === 'string') return data.message;
  if (Array.isArray(data.errors) && data.errors.length) return data.errors.join('; ');
  if (status === 404) {
    return `Not found (${path}). If this is not "Book not found"`;
  }
  return `Request failed (${status})`;
}

async function fetchJson(path) {
  const response = await fetch(`${apiOrigin}${path}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(httpErrorMessage(data, response.status, path));
  }
  return data;
}

async function apiJson(method, path, body) {
  const response = await fetch(`${apiOrigin}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(httpErrorMessage(data, response.status, path));
  }
  return data;
}

async function apiDelete(path) {
  const response = await fetch(`${apiOrigin}${path}`, { method: 'DELETE' });
  if (response.status === 204) {
    return;
  }
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
  }
  if (text.includes('Cannot DELETE')) {
    throw new Error(
      'This server does not handle DELETE for books. Stop whatever is on this port (often 5.3C) and run npm start from the 5.4D folder—check the terminal for “Books API: … DELETE”.'
    );
  }
  throw new Error(httpErrorMessage(data, response.status, path));
}

async function loadBooks() {
  booksSection.hidden = false;
  bookDetailsSection.hidden = true;

  showListStatus('Loading books…');
  clearDetail();
  showDetailStatus('');
  booksLoadedOnce = true;

  try {
    const books = await fetchJson('/api/books');
    if (!Array.isArray(books)) {
      throw new Error('Unexpected response: expected a list of books.');
    }

    listEl.innerHTML = '';
    books.forEach((book) => {
      const li = document.createElement('li');
      li.tabIndex = 0;
      li.dataset.id = book.id;
      li.textContent = listLineText(book);
      li.addEventListener('click', () => loadBookDetail(book.id, li));
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          loadBookDetail(book.id, li);
        }
      });
      listEl.appendChild(li);
    });

    showListStatus(books.length ? '' : 'No books returned.');
  } catch (err) {
    showListStatus(err.message || 'Could not load books.', true);
    listEl.innerHTML = '';
  }
}

async function loadBookDetail(id, li) {
  if (id == null || id === '') return;

  bookDetailsSection.hidden = false;
  selectListItem(li);
  clearDetailView();
  selectedBookId = id;
  editBookIdDisplay.textContent = id;
  editBookSubmitBtn.disabled = true;
  editBookForm.reset();
  showEditBookStatus('');
  syncDeletePanel();

  showDetailStatus('Loading details…');

  try {
    const book = await fetchJson(`/api/books/${encodeURIComponent(id)}`);
    detailTitleEl.textContent = book.title || '(untitled)';
    detailAuthorEl.textContent = book.author || '—';
    detailYearEl.textContent = book.year != null ? String(book.year) : '—';
    detailGenreEl.textContent = book.genre || '—';
    detailSummaryEl.textContent = book.summary || 'No summary.';
    detailPriceEl.textContent = formatAudPrice(book.price);
    detailEl.hidden = false;
    showDetailStatus('');

    populateEditForm(book);
    editBookSubmitBtn.disabled = false;
    showEditBookStatus('');
    syncDeletePanel();
  } catch (err) {
    showDetailStatus(err.message || 'Could not load book.', true);
    clearDetail();
  }
}

addBookForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  showAddBookStatus('Saving…');

  const fd = new FormData(addBookForm);
  const body = {
    id: String(fd.get('id') || '').trim(),
    title: String(fd.get('title') || '').trim(),
    author: String(fd.get('author') || '').trim(),
    year: Number(fd.get('year')),
    genre: String(fd.get('genre') || ''),
    summary: String(fd.get('summary') || '').trim(),
    price: String(fd.get('price') || '').trim()
  };

  try {
    await apiJson('POST', '/api/books', body);
    showAddBookStatus('Created successfully.');
    addBookForm.reset();
    if (booksLoadedOnce && !booksSection.hidden) {
      await loadBooks();
    }
  } catch (err) {
    showAddBookStatus(err.message || 'Create failed.', true);
  }
});

editBookForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!selectedBookId) return;

  showEditBookStatus('Saving…');

  const fd = new FormData(editBookForm);
  const body = {
    title: String(fd.get('title') || '').trim(),
    author: String(fd.get('author') || '').trim(),
    year: Number(fd.get('year')),
    genre: String(fd.get('genre') || ''),
    summary: String(fd.get('summary') || '').trim(),
    price: String(fd.get('price') || '').trim()
  };

  const bookId = selectedBookId;
  try {
    await apiJson('PUT', `/api/books/${encodeURIComponent(bookId)}`, body);
    showEditBookStatus('Updated successfully.');
    if (booksLoadedOnce && !booksSection.hidden) {
      await loadBooks();
    }
    const li = findLiByBookId(bookId);
    await loadBookDetail(bookId, li || undefined);
  } catch (err) {
    showEditBookStatus(err.message || 'Update failed.', true);
  }
});

function closeFormPanelsExcept(keep) {
  if (keep !== 'add') {
    addBookSection.hidden = true;
    toggleAddBookBtn.setAttribute('aria-expanded', 'false');
  }
  if (keep !== 'edit') {
    editBookSection.hidden = true;
    toggleEditBookBtn.setAttribute('aria-expanded', 'false');
  }
  if (keep !== 'delete') {
    deleteBookSection.hidden = true;
    toggleDeleteBookBtn.setAttribute('aria-expanded', 'false');
  }
}

toggleAddBookBtn.addEventListener('click', () => {
  const opening = addBookSection.hidden;
  addBookSection.hidden = !opening ? true : false;
  if (!addBookSection.hidden) {
    closeFormPanelsExcept('add');
  }
  toggleAddBookBtn.setAttribute('aria-expanded', String(!addBookSection.hidden));
});

toggleEditBookBtn.addEventListener('click', () => {
  const opening = editBookSection.hidden;
  editBookSection.hidden = !opening ? true : false;
  if (!editBookSection.hidden) {
    closeFormPanelsExcept('edit');
    if (!selectedBookId) {
      showEditBookStatus('Use Get all books, then click a book in the list to enable Save.');
    }
  }
  toggleEditBookBtn.setAttribute('aria-expanded', String(!editBookSection.hidden));
});

toggleDeleteBookBtn.addEventListener('click', () => {
  const opening = deleteBookSection.hidden;
  deleteBookSection.hidden = !opening ? true : false;
  if (!deleteBookSection.hidden) {
    closeFormPanelsExcept('delete');
    syncDeletePanel();
    if (!selectedBookId) {
      showDeleteBookStatus('Use Get all books, then click a book in the list to enable Delete.');
    } else {
      showDeleteBookStatus('');
    }
  }
  toggleDeleteBookBtn.setAttribute('aria-expanded', String(!deleteBookSection.hidden));
});

deleteConfirmBtn.addEventListener('click', async () => {
  if (!selectedBookId) return;
  if (!window.confirm(`Delete book "${selectedBookId}"? This cannot be undone.`)) return;
  showDeleteBookStatus('Deleting…');
  try {
    await apiDelete(`/api/books/${encodeURIComponent(selectedBookId)}`);
    showDeleteBookStatus('Deleted successfully.');
    deleteBookSection.hidden = true;
    toggleDeleteBookBtn.setAttribute('aria-expanded', 'false');
    bookDetailsSection.hidden = true;
    clearDetail();
    if (booksLoadedOnce && !booksSection.hidden) {
      await loadBooks();
    }
  } catch (err) {
    showDeleteBookStatus(err.message || 'Delete failed.', true);
  }
});

getAllBooksBtn.addEventListener('click', loadBooks);

syncDeletePanel();
