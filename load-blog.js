import { db } from './firebase-config.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js';

const blogList = document.getElementById('blogList');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const loadMoreBtn = document.getElementById('loadMoreBtn');

const blogsRef = ref(db, 'blogs');
let allBlogs = [];
let displayedBlogs = [];
let currentIndex = 0;
const blogsPerPage = 6;

// Fetch and render blogs
onValue(blogsRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) {
    blogList.innerHTML = `<p class="text-muted">Belum ada blog.</p>`;
    return;
  }

  allBlogs = Object.entries(data).map(([id, blog]) => ({
    id,
    ...blog
  })).sort((a, b) => b.timestamp - a.timestamp);

  updateCategoryFilter();
  renderBlogs(true);
});

// Render filtered and paginated blogs
function renderBlogs(reset = false) {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  let filtered = allBlogs.filter(blog =>
    (blog.title.toLowerCase().includes(searchTerm) ||
     blog.content.toLowerCase().includes(searchTerm)) &&
    (!selectedCategory || blog.category === selectedCategory)
  );

  if (reset) {
    displayedBlogs = [];
    currentIndex = 0;
    blogList.innerHTML = '';
  }

  const nextBatch = filtered.slice(currentIndex, currentIndex + blogsPerPage);
  displayedBlogs.push(...nextBatch);
  currentIndex += blogsPerPage;

  if (displayedBlogs.length === 0) {
    blogList.innerHTML = `<p class="text-muted">Tidak ditemukan blog yang sesuai.</p>`;
    loadMoreBtn.classList.add('d-none');
    return;
  }

  blogList.innerHTML = displayedBlogs.map(renderBlogCard).join('');
  loadMoreBtn.classList.toggle('d-none', currentIndex >= filtered.length);
}

// Update dropdown kategori
function updateCategoryFilter() {
  const categories = [...new Set(allBlogs.map(blog => blog.category).filter(Boolean))];
  categoryFilter.innerHTML = `<option value="">Semua Kategori</option>`;
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// Template kartu blog
function renderBlogCard(blog) {
  const date = new Date(blog.timestamp).toLocaleString();
  return `
    <div class="col-md-6 mb-4">
      <div class="card shadow-sm h-100">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${escapeHtml(blog.title)}</h5>
          <h6 class="card-subtitle mb-1 text-muted">${date}</h6>
          ${blog.category ? `<span class="badge bg-secondary mb-2">${escapeHtml(blog.category)}</span>` : ''}
          <p class="card-text flex-grow-1">${escapeHtml(blog.content)}</p>
          ${blog.link ? `<a href="${escapeHtml(blog.link)}" class="mt-2 btn btn-sm btn-outline-primary" target="_blank">Baca Selengkapnya</a>` : ''}
        </div>
      </div>
    </div>
  `;
}

// Escape HTML untuk keamanan
function escapeHtml(text = '') {
  return text.replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
}

// Event listeners
searchInput.addEventListener('input', () => renderBlogs(true));
categoryFilter.addEventListener('change', () => renderBlogs(true));
loadMoreBtn.addEventListener('click', () => renderBlogs());
