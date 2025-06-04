// dashboard.js
import { db, ref, push } from './firebase-config.js'; // Pastikan ini sudah export dengan benar
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm';

document.getElementById('blogForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();

  if (!title || !content) {
    Swal.fire('Error', 'Judul dan konten wajib diisi!', 'error');
    return;
  }

  try {
    Swal.fire({
      title: 'Mengupload...',
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    const blogRef = ref(db, 'blogs');
    await push(blogRef, {
      title,
      content,
      timestamp: Date.now()
    });

    Swal.fire('Sukses', 'Blog berhasil ditambahkan!', 'success');
    document.getElementById('blogForm').reset();
  } catch (error) {
    Swal.fire('Error', 'Gagal menambahkan blog: ' + error.message, 'error');
  }
});
