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

  let html = '';
  for (const key in data) {
    const blog = data[key];
    const date = new Date(blog.timestamp).toLocaleString();
    html += `
      <div class="col-md-6 mb-4">
        <div class="card shadow-sm h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${escapeHtml(blog.title)}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${date}</h6>
            <p class="card-text flex-grow-1">${escapeHtml(blog.content)}</p>
          </div>
        </div>
      </div>
    `;
  }
  blogList.innerHTML = html;
});

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
