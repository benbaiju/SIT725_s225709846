const apiOrigin =
  typeof window !== 'undefined' &&
  window.location.port === '3000' &&
  window.location.protocol !== 'file:'
    ? ''
    : 'http://localhost:3000';

const listEl = document.getElementById('booksList');
const listStatusEl = document.getElementById('listStatus');
const detailEl = document.getElementById('bookDetail');
const detailStatusEl = document.getElementById('detailStatus');
const detailTitleEl = document.getElementById('detailTitle');
const detailMetaEl = document.getElementById('detailMeta');
const detailSummaryEl = document.getElementById('detailSummary');
const toggleAllBtn = document.getElementById('toggleAllDetailsBtn');
const allDetailsPanel = document.getElementById('allDetailsPanel');

function showListStatus(message, isError) {
  listStatusEl.textContent = message;
  listStatusEl.classList.toggle('error', !!isError);
}

function showDetailStatus(message, isError) {
  detailStatusEl.textContent = message;
  detailStatusEl.classList.toggle('error', !!isError);
}

function clearDetail() {
  detailEl.hidden = true;
  detailTitleEl.textContent = '';
  detailMetaEl.textContent = '';
  detailSummaryEl.textContent = '';
}

function selectListItem(selectedLi) {
  listEl.querySelectorAll('li').forEach((li) => li.classList.remove('selected'));
  if (selectedLi) selectedLi.classList.add('selected');
}

function renderBookArticle(book) {
  const article = document.createElement('article');
  const h3 = document.createElement('h3');
  h3.textContent = book.title || '(untitled)';
  const meta = document.createElement('p');
  meta.className = 'meta';
  const year = book.year != null ? book.year : '—';
  const genre = book.genre || '—';
  meta.textContent = `by ${book.author || '—'} · ${year} · ${genre}`;
  const summary = document.createElement('p');
  summary.className = 'summary';
  summary.textContent = book.summary || 'No summary.';
  article.append(h3, meta, summary);
  return article;
}

function fillAllDetailsPanel(books) {
  allDetailsPanel.innerHTML = '';
  books.forEach((book) => {
    allDetailsPanel.appendChild(renderBookArticle(book));
  });
}

function isAllDetailsPanelOpen() {
  return !allDetailsPanel.classList.contains('is-collapsed');
}

function setAllDetailsPanelOpen(open) {
  allDetailsPanel.classList.toggle('is-collapsed', !open);
  syncAllDetailsButton();
}

function syncAllDetailsButton() {
  const open = isAllDetailsPanelOpen();
  toggleAllBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  toggleAllBtn.textContent = open ? 'Hide all book details' : 'Show all book details';
}

function toggleAllBookDetails() {
  if (toggleAllBtn.disabled || !allDetailsPanel.childElementCount) return;
  setAllDetailsPanelOpen(!isAllDetailsPanelOpen());
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
  showListStatus('Loading books…');
  clearDetail();
  showDetailStatus('');
  allDetailsPanel.innerHTML = '';
  setAllDetailsPanelOpen(false);
  toggleAllBtn.disabled = true;
  syncAllDetailsButton();

  try {
    const books = await fetchJson('/api/books');
    if (!Array.isArray(books)) {
      throw new Error('Unexpected response: expected a list of books.');
    }

    fillAllDetailsPanel(books);
    setAllDetailsPanelOpen(true);
    toggleAllBtn.disabled = false;
    syncAllDetailsButton();

    listEl.innerHTML = '';
    books.forEach((book) => {
      const li = document.createElement('li');
      li.tabIndex = 0;
      li.dataset.id = book.id;
      li.textContent = `${book.title} — ${book.author}`;
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
    allDetailsPanel.innerHTML = '';
    setAllDetailsPanelOpen(false);
    toggleAllBtn.disabled = true;
    syncAllDetailsButton();
  }
}

async function loadBookDetail(id, li) {
  selectListItem(li);
  clearDetail();
  showDetailStatus('Loading details…');

  try {
    const book = await fetchJson(`/api/books/${encodeURIComponent(id)}`);
    detailTitleEl.textContent = book.title || '(untitled)';
    const year = book.year != null ? book.year : '—';
    const genre = book.genre || '—';
    detailMetaEl.textContent = `by ${book.author || '—'} · ${year} · ${genre}`;
    detailSummaryEl.textContent = book.summary || 'No summary.';
    detailEl.hidden = false;
    showDetailStatus('');
  } catch (err) {
    showDetailStatus(err.message || 'Could not load book.', true);
  }
}

toggleAllBtn.addEventListener('click', toggleAllBookDetails);

loadBooks();
