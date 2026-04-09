const apiOrigin =
  typeof window !== 'undefined' &&
  window.location.port === '3000' &&
  window.location.protocol !== 'file:'
    ? ''
    : 'http://localhost:3000';

const getAllBooksBtn = document.getElementById('getAllBooksBtn');
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

function showListStatus(message, isError) {
  listStatusEl.textContent = message;
  listStatusEl.classList.toggle('error', !!isError);
}

function showDetailStatus(message, isError) {
  detailStatusEl.textContent = message;
  detailStatusEl.classList.toggle('error', !!isError);
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

function clearDetail() {
  detailEl.hidden = true;
  detailTitleEl.textContent = '';
  detailAuthorEl.textContent = '';
  detailYearEl.textContent = '';
  detailGenreEl.textContent = '';
  detailSummaryEl.textContent = '';
  detailPriceEl.textContent = '';
}

function selectListItem(selectedLi) {
  listEl.querySelectorAll('li').forEach((li) => li.classList.remove('selected'));
  if (selectedLi) selectedLi.classList.add('selected');
}

async function fetchJson(path) {
  const response = await fetch(`${apiOrigin}${path}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const msg =
      typeof data.message === 'string'
        ? data.message
        : `Request failed (${response.status})`;
    throw new Error(msg);
  }
  return data;
}

async function loadBooks() {
  booksSection.hidden = false;
  bookDetailsSection.hidden = false;

  showListStatus('Loading books…');
  clearDetail();
  showDetailStatus('');

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
  selectListItem(li);
  clearDetail();
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
  } catch (err) {
    showDetailStatus(err.message || 'Could not load book.', true);
  }
}

getAllBooksBtn.addEventListener('click', loadBooks);
