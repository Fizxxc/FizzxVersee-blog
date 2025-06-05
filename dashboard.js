if (localStorage.getItem('admin') !== 'true') {
  window.location.href = '/login';
}

import { db } from './firebase-config.js';
import {
  ref,
  push,
  update,
  remove,
  onValue
} from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js';
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm';

const blogForm = document.getElementById('blogForm');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const blogIdInput = document.getElementById('blogId');
const blogList = document.getElementById('blogList');

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('admin');
  window.location.href = '/login.html';
});

// Tambah/Edit Blog
blogForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const blogId = blogIdInput.value;

  if (!title || !content) {
    Swal.fire('Error', 'Judul dan konten wajib diisi!', 'error');
    return;
  }

  try {
    Swal.fire({
      title: blogId ? 'Mengupdate...' : 'Mengupload...',
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (blogId) {
      await update(ref(db, 'blogs/' + blogId), { title, content });
      Swal.fire('Sukses', 'Blog berhasil diperbarui!', 'success');
    } else {
      await push(ref(db, 'blogs'), {
        title,
        content,
        timestamp: Date.now()
      });
      Swal.fire('Sukses', 'Blog berhasil ditambahkan!', 'success');
    }

    blogForm.reset();
    blogIdInput.value = '';
  } catch (error) {
    Swal.fire('Error', 'Gagal menyimpan blog: ' + error.message, 'error');
  }
});

// Tampilkan Blog
const loadBlogs = () => {
  onValue(ref(db, 'blogs'), (snapshot) => {
    blogList.innerHTML = '';
    const data = snapshot.val();

    if (!data) {
      blogList.innerHTML = '<div class="text-muted">Belum ada blog.</div>';
      return;
    }

    Object.entries(data)
      .sort((a, b) => b[1].timestamp - a[1].timestamp)
      .forEach(([id, blog]) => {
        const item = document.createElement('div');
        item.className = 'list-group-item';

        item.innerHTML = `
          <h5>${blog.title}</h5>
          <p>${blog.content}</p>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-warning editBtn">Edit</button>
            <button class="btn btn-sm btn-danger deleteBtn">Hapus</button>
          </div>
        `;

        item.querySelector('.editBtn').onclick = () => {
          titleInput.value = blog.title;
          contentInput.value = blog.content;
          blogIdInput.value = id;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        item.querySelector('.deleteBtn').onclick = async () => {
          const confirm = await Swal.fire({
            title: 'Hapus blog ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
          });

          if (confirm.isConfirmed) {
            await remove(ref(db, 'blogs/' + id));
            Swal.fire('Terhapus', 'Blog berhasil dihapus.', 'success');
          }
        };

        blogList.appendChild(item);
      });
  });
};

loadBlogs();
