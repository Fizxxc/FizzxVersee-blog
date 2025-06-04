import { db } from './firebase-config.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';

const blogList = document.getElementById('blogList');
const blogsRef = ref(db, 'blogs');

onValue(blogsRef, (snapshot) => {
  blogList.innerHTML = '';
  snapshot.forEach((child) => {
    const data = child.val();
    const card = `
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm h-100">
          <img src="${data.imageUrl}" class="card-img-top" style="object-fit:cover; height:200px;" />
          <div class="card-body">
            <h5 class="card-title">${data.title}</h5>
            <p class="card-text">${data.content.slice(0, 100)}...</p>
          </div>
        </div>
      </div>`;
    blogList.innerHTML += card;
  });
});
