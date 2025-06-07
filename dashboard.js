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

// Ambil elemen
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const categoryInput = document.getElementById('category');
const linkInput = document.getElementById('link');
const blogIdInput = document.getElementById('blogId');
const blogList = document.getElementById('blogList');
const blogForm = document.getElementById('blogForm'); // pastikan ini ada

// Tambah/Edit Blog
blogForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const category = categoryInput.value.trim();
  const link = linkInput.value.trim();
  const blogId = blogIdInput.value;

  if (!title || !content) {
    Swal.fire('Error', 'Judul dan konten wajib diisi!', 'error');
    return;
  }

  const blogData = {
    title,
    content,
    category, // gunakan field "category"
    link,
    timestamp: Date.now()
  };

  try {
    Swal.fire({
      title: blogId ? 'Mengupdate...' : 'Mengupload...',
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (blogId) {
      await update(ref(db, 'blogs/' + blogId), blogData);
      Swal.fire('Sukses', 'Blog berhasil diperbarui!', 'success');
    } else {
      await push(ref(db, 'blogs'), blogData);
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
          ${blog.category ? `<small class="text-muted">Kategori: ${blog.category}</small><br>` : ''}
          ${blog.link ? `<a href="${blog.link}" target="_blank">Kunjungi Link</a><br>` : ''}
          <p>${blog.content}</p>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-warning editBtn">Edit</button>
            <button class="btn btn-sm btn-danger deleteBtn">Hapus</button>
          </div>
        `;

        item.querySelector('.editBtn').onclick = () => {
          titleInput.value = blog.title;
          contentInput.value = blog.content;
          categoryInput.value = blog.category || ''; // konsisten
          linkInput.value = blog.link || '';
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

        // maintance
document.getElementById('setMaintenance').addEventListener('click', () => {
  const days = parseInt(document.getElementById('days').value) || 0;
  const hours = parseInt(document.getElementById('hours').value) || 0;
  const seconds = parseInt(document.getElementById('seconds').value) || 0;
  const message = document.getElementById('message').value || 'Situs sedang dalam perbaikan';

  const duration = (days * 86400 + hours * 3600 + seconds); // total detik
  const endTime = Date.now() + duration * 1000;

  const maintenanceData = {
    status: true,
    message: message,
    endTime: endTime
  };

  set(ref(db, 'maintenance'), maintenanceData)
    .then(() => {
      Swal.fire('Berhasil', 'Maintenance berhasil dijadwalkan!', 'success');
    })
    .catch((err) => {
      Swal.fire('Gagal', 'Gagal menyimpan data: ' + err.message, 'error');
    });
});
// end maintance
        blogList.appendChild(item);
      });
  });
};

loadBlogs();
