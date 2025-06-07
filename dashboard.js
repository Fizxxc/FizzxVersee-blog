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
        // Maintenance Setup
const maintenanceForm = document.getElementById('maintenanceForm');
const daysInput = document.getElementById('days');
const hoursInput = document.getElementById('hours');
const secondsInput = document.getElementById('seconds');

maintenanceForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const days = parseInt(daysInput.value) || 0;
  const hours = parseInt(hoursInput.value) || 0;
  const seconds = parseInt(secondsInput.value) || 0;

  const totalMs = (days * 24 * 60 * 60 + hours * 60 * 60 + seconds) * 1000;
  const maintenanceTimestamp = Date.now() + totalMs;

  try {
    await update(ref(db, 'maintenance'), {
      days, hours, seconds,
      timestamp: maintenanceTimestamp
    });

    Swal.fire({
      icon: 'success',
      title: 'Jadwal Maintenance Disimpan',
      html: `Halaman akan masuk mode maintenance dalam <b>${days} hari</b>, <b>${hours} jam</b>, <b>${seconds} detik</b>.`,
      timer: 4000,
      timerProgressBar: true,
    });

    maintenanceForm.reset();
  } catch (err) {
    Swal.fire('Error', 'Gagal menyimpan jadwal: ' + err.message, 'error');
  }
});
// end maintance
        blogList.appendChild(item);
      });
  });
};

loadBlogs();
