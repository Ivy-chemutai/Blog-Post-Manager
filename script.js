const API_URL = 'http://localhost:3000/posts';

const postList = document.getElementById('post-list');
const postDetail = document.getElementById('post-detail');
const form = document.getElementById('post-form'); // ✅ fixed ID
const editForm = document.getElementById('edit-post-form');
const editTitle = document.getElementById('edit-title');
const editAuthor = document.getElementById('edit-author');
const editContent = document.getElementById('edit-content');
const cancelEditBtn = document.getElementById('cancel-edit');

let currentPost = null;

function displayPosts() {
  fetch(API_URL)
    .then(res => res.json())
    .then(posts => {
      postList.innerHTML = '';
      posts.forEach(post => {
        const li = document.createElement('li');
        li.textContent = post.title;
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => handlePostClick(post.id));
        postList.appendChild(li);
      });

      if (posts.length > 0) {
        handlePostClick(posts[0].id);
      } else {
        postDetail.innerHTML = '<h2>No posts available.</h2>';
      }
    })
    .catch(console.error);
}

function handlePostClick(postId) {
  fetch(`${API_URL}/${postId}`)
    .then(res => res.json())
    .then(post => {
      currentPost = post;
      postDetail.innerHTML = `
        <h2>${post.title}</h2>
        <p><strong>Author:</strong> ${post.author}</p>
        <p>${post.content}</p>
        <button id="edit-btn">Edit</button>
        <button id="delete-btn">Delete</button>
      `;

      editForm.classList.add('hidden');

      document.getElementById('edit-btn').addEventListener('click', () => showEditForm(post));
      document.getElementById('delete-btn').addEventListener('click', () => deletePost(post.id));
    })
    .catch(console.error);
}

function deletePost(postId) {
  fetch(`${API_URL}/${postId}`, { method: 'DELETE' })
    .then(() => {
      currentPost = null;
      displayPosts();
      postDetail.innerHTML = '<h2>Select a post to view details.</h2>';
      editForm.classList.add('hidden');
    })
    .catch(console.error);
}

function showEditForm(post) {
  editForm.classList.remove('hidden');
  editTitle.value = post.title;
  editAuthor.value = post.author;
  editContent.value = post.content;
}

editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!currentPost) return;

  const updatedPost = {
    title: editTitle.value,
    author: editAuthor.value,
    content: editContent.value
  };

  fetch(`${API_URL}/${currentPost.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedPost)
  })
    .then(res => res.json())
    .then(post => {
      currentPost = post;
      editForm.classList.add('hidden');
      displayPosts();
      handlePostClick(post.id);
    })
    .catch(console.error);
});

cancelEditBtn.addEventListener('click', () => {
  editForm.classList.add('hidden');
});

function addNewPostListener() {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const newPost = {
      title: form.querySelector('[name="title"]').value,
      author: form.querySelector('[name="author"]').value,
      content: form.querySelector('[name="content"]').value
    };

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(() => {
        displayPosts();
        form.reset();
      })
      .catch(console.error);
  });
}

function main() {
  displayPosts();
  addNewPostListener();
}

document.addEventListener('DOMContentLoaded', main);