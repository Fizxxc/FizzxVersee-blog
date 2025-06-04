import { db, storage } from './firebase-config.js';
import { ref, push } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js';
import { ref as sRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js';

document.getElementById('blogForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const image = document.getElementById('image').files[0];

  if (!image) {
    Swal.fire('Gagal', 'Silakan pilih gambar terlebih dahulu.', 'error');
    return;
  }

  Swal.fire({ title: 'Mengupload...', didOpen: () => Swal.showLoading() });

  try {
    // Bersihkan nama file dari karakter aneh
    const cleanName = image.name.replace(/[^\w.]+/g, '_');
    const filename = Date.now() + '-' + cleanName;

    // Buat referensi file
    const imageRef = sRef(storage, 'blog-images/' + filename);

    // Upload file ke Firebase Storage
    await uploadBytes(imageRef, image);

    // Ambil URL download
    const imageUrl = await getDownloadURL(imageRef);

    // Simpan data ke Realtime Database
    const blogRef = ref(db, 'blogs');
    await push(blogRef, {
      title,
      content,
      imageUrl,
      timestamp: Date.now(),
    });

    Swal.fire('Sukses', 'Blog berhasil ditambahkan!', 'success');
    document.getElementById('blogForm').reset();
  } catch (error) {
    console.error('Upload error:', error);
    Swal.fire('Gagal', error.message, 'error');
  }
});
