function loadPosts(containerId) {
  const postList = document.getElementById(containerId);
  if (!postList) return;

  const posts = JSON.parse(localStorage.getItem('vatsep_posts') || '[]');
  postList.innerHTML = '';

  if (posts.length === 0) {
    postList.innerHTML = '<p style="text-align:center;">Henüz gönderi yok.</p>';
    return;
  }

  posts.reverse().forEach(post => {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `
      <div><strong>${post.username}</strong></div>
      <p>${post.text}</p>
      ${post.image ? `<img src="${post.image}">` : ''}
      <small>${new Date(post.date).toLocaleString('tr-TR')}</small>
    `;
    postList.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const logout = document.getElementById("logoutBtn");
  if (logout) {
    logout.addEventListener("click", e => {
      e.preventDefault();
      localStorage.removeItem("vatsep_logged_in");
      window.location.href = "index.html";
    });
  }
});
