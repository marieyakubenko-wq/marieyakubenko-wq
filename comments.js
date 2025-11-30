const form = document.getElementById("commentForm");
const commentsDiv = document.getElementById("comments");

const page = window.location.pathname; // уникально для каждой страницы
const savedComments = JSON.parse(localStorage.getItem(page) || "[]");

function renderComments() {
  commentsDiv.innerHTML = "";
  savedComments.forEach(c => {
    const el = document.createElement("div");
    el.className = "comment";
    el.innerHTML = `<b>${c.name}</b>: ${c.text}`;
    commentsDiv.appendChild(el);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("username").value;
  const text = document.getElementById("commentText").value;

  if (name && text) {
    savedComments.push({ name, text });
    localStorage.setItem(page, JSON.stringify(savedComments));
    renderComments();
    form.reset();
  }
});

renderComments();