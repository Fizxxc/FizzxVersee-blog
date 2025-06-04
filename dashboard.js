import { db, storage } from './firebase-config.js';
import { ref, push } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js';
import { ref as sRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js';

document.getElementById('blogForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const image = document.getElementById('image').files[0];

  Swal.fire({ title: 'Mengupload...', didOpen: () => Swal.showLoading() });

  // Bersihkan nama file dari karakter khusus, agar tidak error
  const cleanName = image.name.replace(/[^\w.-]/g, '_');

  // Buat reference dengan nama unik
  const imageRef = sRef(storage, 'blog-images/' + Date.now() + '-' + cleanName);

  // Upload file
  await uploadBytes(imageRef, image);

  // Ambil URL akses file
  const imageUrl = await getDownloadURL(imageRef);

  // Simpan data blog ke Realtime Database
  const blogRef = ref(db, 'blogs');
  await push(blogRef, { title, content, imageUrl, timestamp: Date.now() });

  Swal.fire('Sukses', 'Blog berhasil ditambahkan!', 'success');
  document.getElementById('blogForm').reset();
});
