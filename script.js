const BASE_URL = "http://localhost:3000/posts";
let posts = [];

// Load posts on start
loadPosts();

function loadPosts() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(data => {
      posts = data;
      renderPostTitles();
      if (posts.length > 0) {
        showPostDetail(posts[0]);
      } else {
        clearPostDetail();
      }
    })
    .catch(() => {
      showMessage("Failed to load posts.");
    });
}

function renderPostTitles() {
  const postTitles = document.getElementById('post-titles');
  postTitles.innerHTML = '';

  posts.forEach(post => {
    const li = document.createElement('li');
    li.className = "text-gray-600 cursor-pointer hover:text-blue-600 transition-colors duration-200 flex justify-between items-center";
    li.setAttribute('data-id', post.id);
    li.innerHTML = `
      <span class="flex-1">${post.title}</span>
      <button class="delete-btn ml-2 text-red-500 hover:text-red-700 font-bold" data-id="${post.id}">&times;</button>
    `;
    postTitles.appendChild(li);

    
  });

  // Update post count
  document.querySelector('#post-list p').textContent = `${posts.length} post${posts.length !== 1 ? 's' : ''}`;

  attachTitleListeners();
  attachDeleteListeners();
}

function attachTitleListeners() {
  document.querySelectorAll('#post-titles li span').forEach(span => {
    span.addEventListener('click', function () {
      const postId = Number(this.parentElement.getAttribute('data-id'));
      const post = posts.find(p => p.id === postId);
      if (post) {
        showPostDetail(post);
        // Optional: Highlight selected post
        document.querySelectorAll('#post-titles li').forEach(li => li.classList.remove('font-bold', 'text-blue-700'));
        this.parentElement.classList.add('font-bold', 'text-blue-700');
      }
    });
  });
}



function attachDeleteListeners() {
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const postId = Number(this.getAttribute('data-id'));
      fetch(`${BASE_URL}/${postId}`, { method: "DELETE" })
        .then(() => {
          posts = posts.filter(p => p.id !== postId);
          renderPostTitles();
          clearPostDetail();
          showMessage('Post deleted.');
        })
        .catch(() => showMessage('Error deleting post.'));
    });
  });
}

function showPostDetail(post) {
  if (!post || typeof post !== 'object') {
    document.getElementById('post-detail').innerHTML = `<p class="text-gray-500">Invalid post data.</p>`;
    return;
  }
  document.getElementById('post-detail').innerHTML = `
    <h3 class="text-xl font-bold text-gray-800">${post.title ? post.title : 'Untitled'}</h3>
    <p class="text-gray-600 mb-2">By <span class="font-medium">${post.author ? post.author : 'Unknown'}</span></p>
    ${post.image ? `<img src="${post.image}" alt="${post.title ? post.title : 'Post image'}" onerror="this.style.display='none'" class="w-full max-w-md rounded mb-4">` : ''}
    <p class="text-gray-700">${post.content ? post.content : ''}</p>
    <button id="edit-post-btn" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
  `;
  attachEditButton(post);
}

function clearPostDetail() {
  document.getElementById('post-detail').innerHTML = `<p class="text-gray-500">Click on a post title to view details.</p>`;
}

function attachEditButton(post) {
  document.getElementById('edit-post-btn').addEventListener('click', () => {
    const editForm = document.getElementById('edit-post-form');
    editForm.classList.remove('hidden');
    document.getElementById('edit-post-id').value = post.id;
    document.getElementById('edit-title').value = post.title;
    document.getElementById('edit-content').value = post.content;

    document.getElementById('cancel-edit').addEventListener('click', () => {
      editForm.classList.add('hidden');
    });
  });
}

// Edit post
const editPostForm = document.getElementById('edit-post-form');
if (editPostForm) {
  editPostForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const id = Number(document.getElementById('edit-post-id').value);
    const title = document.getElementById('edit-title').value.trim();
    const content = document.getElementById('edit-content').value.trim();

    if (!title || !content) {
      showMessage("Please fill in both title and content.");
      return;
    }

    fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    })
      .then(res => res.json())
      .then(updated => {
        const index = posts.findIndex(p => p.id === id);
        posts[index] = updated;
        renderPostTitles();
        showPostDetail(updated);
        showMessage("Post updated!");
        document.getElementById('edit-post-form').classList.add('hidden');
      })
      .catch(() => showMessage("Failed to update post."));
  });
}

// Add new post
const newPostForm = document.getElementById('new-post-form');
if (newPostForm) {
  newPostForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('new-title').value.trim();
    const content = document.getElementById('new-content').value.trim();
    const author = document.getElementById('new-author').value.trim();
    const image = document.getElementById('new-image').value.trim();

    if (!title || !content || !author) {
      showMessage('Please fill in all required fields.');
      return;
    }

    const newPost = { title, content, author, image };

    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(post => {
        posts.push(post);
        renderPostTitles();
        showPostDetail(post);
        this.reset();
        showMessage('New post added!');
      })
      .catch(() => showMessage("Failed to add post."));
  });
}

// Show messages
function showMessage(msg) {
  const box = document.getElementById('message-box');
  if (!box) return;
  const msgText = document.getElementById('message-text');
  if (msgText) msgText.textContent = msg;
  box.classList.remove('hidden');
  box.style.opacity = 1;
  setTimeout(() => {
    box.style.opacity = 0;
    setTimeout(() => box.classList.add('hidden'), 300);
  }, 2000);
}

const closeMsgBtn = document.getElementById('close-message');
if (closeMsgBtn) {
  closeMsgBtn.onclick = function () {
    const msgBox = document.getElementById('message-box');
    if (msgBox) msgBox.classList.add('hidden');
  };
}
