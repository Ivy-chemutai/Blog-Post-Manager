document.addEventListener('DOMContentLoaded', main);

const baseURL = "http://localhost:3000/posts";

function main() {
  displayPosts();
  addNewPostListener();
  addEditPostListener();
}

// Fetch and display all post titles
function displayPosts() {
  fetch(baseURL)
    .then(res => res.json())
    .then(posts => {
      const postList = document.getElementById('post-list');
      postList.innerHTML = ''; // Clear list

      posts.forEach(post => {
        const postItem = document.createElement('div');
        postItem.className = 'post-title';
        postItem.textContent = post.title;
        postItem.addEventListener('click', () => handlePostClick(post.id));
        postList.appendChild(postItem);
      });

      // Automatically load the first post
      if (posts.length > 0) {
        handlePostClick(posts[0].id);
      }
    });
}

// Fetch and display post details
function handlePostClick(postId) {
  fetch(`${baseURL}/${postId}`)
    .then(res => res.json())
    .then(post => {
      const detail = document.getElementById('post-detail');
      detail.innerHTML = `
        <h2>${post.title}</h2>
        <p><strong>By:</strong> ${post.author}</p>
        <img src="${post.image}" alt="${post.title}" />
        <p>${post.content}</p>
        <button id="edit-button">Edit</button>
        <button id="delete-button">Delete</button>
      `;

      // Edit button
      document.getElementById('edit-button').addEventListener('click', () => {
        const editForm = document.getElementById('edit-post-form');
        editForm.classList.remove('hidden');
        editForm.dataset.postId = post.id;
        document.getElementById('edit-title').value = post.title;
        document.getElementById('edit-content').value = post.content;
      });

      // Delete button
      document.getElementById('delete-button').addEventListener('click', () => {
        deletePost(post.id);
      });
    });
}

// Listen to new post form submit
function addNewPostListener() {
  const form = document.getElementById('new-post-form');
  form.addEventListener('submit', e => {
    e.preventDefault();

    const newPost = {
      title: document.getElementById('new-title').value,
      author: document.getElementById('new-author').value,
      image: document.getElementById('new-image').value,
      content: document.getElementById('new-content').value
    };

    fetch(baseURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(() => {
        displayPosts();
        form.reset();
      });
  });
}

// Listen to edit form submit
function addEditPostListener() {
  const editForm = document.getElementById('edit-post-form');

  editForm.addEventListener('submit', e => {
    e.preventDefault();
    const postId = editForm.dataset.postId;

    const updatedPost = {
      title: document.getElementById('edit-title').value,
      content: document.getElementById('edit-content').value
    };

    fetch(`${baseURL}/${postId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPost)
    })
      .then(res => res.json())
      .then(() => {
        displayPosts();
        handlePostClick(postId);
        editForm.classList.add('hidden');
      });
  });

  // Cancel edit
  document.getElementById('cancel-edit').addEventListener('click', () => {
    editForm.classList.add('hidden');
  });
}

// Delete post from server and update DOM
function deletePost(postId) {
  fetch(`${baseURL}/${postId}`, {
    method: 'DELETE'
  })
    .then(() => {
      displayPosts();
      const detail = document.getElementById('post-detail');
      detail.innerHTML = '<p>Select a post to view its details</p>';
      document.getElementById('edit-post-form').classList.add('hidden');
    });
}
