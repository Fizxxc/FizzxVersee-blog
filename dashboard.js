import { db } from './firebase-config.js';
import { ref, push } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js';
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js';

const blogForm = document.getElementById('blogForm');

blogForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = blogForm.title.value.trim();
  const content = blogForm.content.value.trim();

  if (!title || !content) {
    Swal.fire('Error', 'Judul dan isi tidak boleh kosong!', 'error');
    return;
  }

  Swal.fire({ title: 'Menyimpan...', didOpen: () => Swal.showLoading() });

  try {
    const blogRef = ref(db, 'blogs');
    await push(blogRef, {
      title,
      content,
      timestamp: Date.now()
    });
    Swal.fire('Sukses', 'Blog berhasil disimpan!', 'success');
    blogForm.reset();
  } catch (error) {
    Swal.fire('Error', 'Gagal menyimpan blog: ' + error.message, 'error');
  }
});
