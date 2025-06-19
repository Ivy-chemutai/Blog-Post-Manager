# Code-Challenge 3
# Blog Manager App
A simple frontend blog manager app that allows users to view, add, edit, and delete blog posts using a mock REST API powered by [JSON Server].
---

##  Features

- Fetch and display blog post titles from a mock API
- Click on a title to see full post details (title, author, content)
- Add a new blog post using a form
- Edit post content using an editable form
-  Delete posts
-  All updates (add, edit, delete) persist to the JSON backend

---

##  Learning Goals

- Access information from an API using a GET request and use it to update the DOM
- Listen for user events and update the DOM in response
- (Advanced) Send data to an API using POST, PATCH, and DELETE requests

---

##  Technologies Used

- HTML5
- CSS
- JavaScript 
- [JSON Server]

---

##  Project Structure

project-folder/

- index.html # Main HTML file
- styles.css # Stylesheet
-script.js # JavaScript logic
- db.json # Mock backend data
- README.md # You're reading this :
---

## Setup Instructions

### 1. Clone the Repository
git clone https://github.com/Ivy-chemutai/Blog-Post-Manager.git
cd blog-manager
### 2. Install and Start JSON Server
Make sure you have Node.js installed. Then:
-npm install -g json-server@0.17.4
- npx json-server --watch db.json
This will start the backend at:
http://localhost:3000/posts
### 3. Run the Frontend
Use Live Server (or open index.html manually in your browser).
### Demo Preview
Below is a preview of the Blog Manager app in action:
 This demo shows:
 - A list of blog post titles loading on the left
 - Clicking a title displays full post details (title, author, content)
 - Adding a new post using the form at the bottom
 - Editing a post using the Edit button
 - Deleting a post using the Delete button

---
### API Endpoints
GET /posts – Fetch all posts

GET /posts/:id – Fetch a specific post

POST /posts – Create a new post

PATCH /posts/:id – Edit an existing post

DELETE /posts/:id – Delete a post


## Author 
Ivvy Joy,

## License
MIT license
