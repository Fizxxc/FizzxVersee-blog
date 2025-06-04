import { db, storage } from './firebase-config.js';
import { ref, push } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';
import { ref as sRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';

document.getElementById('blogForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const image = document.getElementById('image').files[0];

  Swal.fire({ title: 'Mengupload...', didOpen: () => Swal.showLoading() });

  const imageRef = sRef(storage, 'blog-images/' + Date.now() + '-' + image.name);
  await uploadBytes(imageRef, image);
  const imageUrl = await getDownloadURL(imageRef);

  await push(ref(db, 'blogs'), { title, content, imageUrl, timestamp: Date.now() });

  Swal.fire('Sukses', 'Blog berhasil ditambahkan!', 'success');
  document.getElementById('blogForm').reset();
});
