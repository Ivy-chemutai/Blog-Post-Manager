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
      if (!postList) return;
      postList.innerHTML = '';

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
    })
    .catch(error => {
      console.error('Error fetching posts:', error);
    });
}

// Fetch and display a single post's details
function handlePostClick(postId) {
  fetch(`${baseURL}/${postId}`)
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(post => {
      const detail = document.getElementById('post-detail');
      if (!detail) return;
      detail.innerHTML = `
        <h2>${post.title}</h2>
        <p><strong>By:</strong> ${post.author}</p>
        <img src="${post.image}" alt="${post.title}" />
        <p>${post.content}</p>
        <button id="edit-button">Edit</button>
        <button id="delete-button">Delete</button>
      `;

      // Edit button
      const editBtn = document.getElementById('edit-button');
      if (editBtn) {
        editBtn.addEventListener('click', () => {
          const editForm = document.getElementById('edit-post-form');
          if (!editForm) return;
          editForm.classList.remove('hidden');
          editForm.dataset.postId = post.id;
          document.getElementById('edit-title').value = post.title;
          document.getElementById('edit-content').value = post.content;
        });
      }

      // Delete button
      const deleteBtn = document.getElementById('delete-button');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          if (confirm('Are you sure you want to delete this post?')) {
            deletePost(post.id);
          }
        });
      }
    })
    .catch(error => {
      console.error('Error fetching post:', error);
    });
}

// Listen to new post form submit
function addNewPostListener() {
  const form = document.getElementById('new-post-form');
  if (!form) return;
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
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(() => {
        displayPosts();
        form.reset();
      })
      .catch(error => {
        console.error('Error creating post:', error);
        alert('Error creating post.');
      });
  });
}

// Listen to edit form submit
function addEditPostListener() {
  const editForm = document.getElementById('edit-post-form');
  if (!editForm) return;

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
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(() => {
        displayPosts();
        handlePostClick(postId);
        editForm.classList.add('hidden');
      })
      .catch(error => {
        console.error('Error updating post:', error);
        alert('Error updating post.');
      });
  });

  // Cancel edit
  const cancelBtn = document.getElementById('cancel-edit');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      editForm.classList.add('hidden');
    });
  }
}

// Delete post from server and update DOM
function deletePost(postId) {
  fetch(`${baseURL}/${postId}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      displayPosts();
      const detail = document.getElementById('post-detail');
      if (detail) detail.innerHTML = '<p>Select a post to view its details</p>';
      const editForm = document.getElementById('edit-post-form');
      if (editForm) editForm.classList.add('hidden');
    })
    .catch(error => {
      console.error('Error deleting post:', error);
      alert('Error deleting post.');
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
