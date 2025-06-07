import { db } from './firebase-config.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js';

const blogList = document.getElementById('blogList');
const blogsRef = ref(db, 'blogs');

onValue(blogsRef, (snapshot) => {
  const data = snapshot.val();

  if (!data) {
    blogList.innerHTML = `<p class="text-muted">Belum ada blog.</p>`;
    return;
  }

  // Urutkan berdasarkan timestamp terbaru
  const sortedBlogs = Object.entries(data).sort((a, b) => b[1].timestamp - a[1].timestamp);

  let html = '';
  for (const [key, blog] of sortedBlogs) {
    const date = new Date(blog.timestamp).toLocaleString();

    html += `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card shadow-sm h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${escapeHtml(blog.title)}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${date}</h6>
            ${blog.categories ? `<span class="badge bg-secondary mb-2">${escapeHtml(blog.categories)}</span>` : ''}
            ${blog.link ? `<a href="${escapeHtml(blog.link)}" class="d-block mb-2 text-decoration-none text-primary" target="_blank">🔗 Lihat Tautan</a>` : ''}
            <p class="card-text flex-grow-1">${escapeHtml(blog.content)}</p>
          </div>
        </div>
      </div>
    `;
  }

  blogList.innerHTML = html;
});

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
