
// Sayfalar arası geçiş ve form işlemleri

document.addEventListener('DOMContentLoaded', () => {

  // Giriş ve kayıt formları toggle
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const showRegister = document.getElementById('showRegister');
  const showLogin = document.getElementById('showLogin');

  if(showRegister) {
    showRegister.addEventListener('click', e => {
      e.preventDefault();
      loginForm.classList.remove('active');
      registerForm.classList.add('active');
    });
  }
  if(showLogin) {
    showLogin.addEventListener('click', e => {
      e.preventDefault();
      registerForm.classList.remove('active');
      loginForm.classList.add('active');
    });
  }

  // Kayıt ve giriş işlemleri (mock - localStorage)
  if(loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      const userData = JSON.parse(localStorage.getItem('vatsep_user_' + email));
      if(userData && userData.password === password) {
        localStorage.setItem('vatsep_logged_in', email);
        window.location.href = 'profile.html';
      } else {
        alert('Hatalı giriş bilgileri!');
      }
    });
  }

  if(registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const username = document.getElementById('registerUsername').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;

      if(localStorage.getItem('vatsep_user_' + email)) {
        alert('Bu e-posta zaten kayıtlı!');
        return;
      }
      const userObj = { username, email, password, bio: '', interests: '', photo: '' };
      localStorage.setItem('vatsep_user_' + email, JSON.stringify(userObj));
      alert('Kayıt başarılı! Giriş yapabilirsiniz.');
      registerForm.reset();
      registerForm.classList.remove('active');
      loginForm.classList.add('active');
    });
  }

  // Profil sayfası
  if(document.getElementById('profileForm')) {
    const profileForm = document.getElementById('profileForm');
    const profilePhotoInput = document.getElementById('profilePhoto');
    const profilePhotoPreview = document.getElementById('profilePhotoPreview');
    const usernameInput = document.getElementById('profileUsername');
    const bioInput = document.getElementById('profileBio');
    const interestsInput = document.getElementById('profileInterests');

    // Kullanıcı kontrolü
    const loggedInEmail = localStorage.getItem('vatsep_logged_in');
    if(!loggedInEmail) {
      alert('Önce giriş yapmalısınız!');
      window.location.href = 'index.html';
      return;
    }
    let currentUser = JSON.parse(localStorage.getItem('vatsep_user_' + loggedInEmail));
    if(!currentUser) {
      alert('Kullanıcı bulunamadı!');
      window.location.href = 'index.html';
      return;
    }

    // Profil bilgilerini doldur
    usernameInput.value = currentUser.username || '';
    bioInput.value = currentUser.bio || '';
    interestsInput.value = currentUser.interests || '';
    if(currentUser.photo) profilePhotoPreview.src = currentUser.photo;

    // Fotoğraf seçimi ve önizleme
    profilePhotoInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        profilePhotoPreview.src = reader.result;
      };
      reader.readAsDataURL(file);
    });

    profileForm.addEventListener('submit', e => {
      e.preventDefault();
      currentUser.username = usernameInput.value;
      currentUser.bio = bioInput.value;
      currentUser.interests = interestsInput.value;
      currentUser.photo = profilePhotoPreview.src;
      localStorage.setItem('vatsep_user_' + loggedInEmail, JSON.stringify(currentUser));
      alert('Profil güncellendi!');
      window.location.href = 'explore.html';
    });
  }

  // Keşfet sayfası
  if(document.getElementById('exploreList')) {
    const exploreList = document.getElementById('exploreList');
    const loggedInEmail = localStorage.getItem('vatsep_logged_in');
    if(!loggedInEmail) {
      alert('Önce giriş yapmalısınız!');
      window.location.href = 'index.html';
      return;
    }

    // Kullanıcıları listele (localStorage'daki tüm vatsep_user_ ile başlayanları bul)
    const users = [];
    for(let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if(key.startsWith('vatsep_user_')) {
        let user = JSON.parse(localStorage.getItem(key));
        if(user.email !== loggedInEmail) users.push(user);
      }
    }

    // Listeyi HTML'ye ekle
    if(users.length === 0) {
      exploreList.innerHTML = '<p>Keşfetmek için başka kullanıcı bulunamadı.</p>';
    } else {
      users.forEach(user => {
        const card = document.createElement('div');
        card.className = 'explore-card';
        card.innerHTML = `
          <img src="${user.photo || 'default-profile.png'}" alt="Profil Fotoğrafı" />
          <h3>${user.username}</h3>
          <p>${user.bio || ''}</p>
          <p><small>İlgi Alanları: ${user.interests || ''}</small></p>
          <button>Arkadaş Ekle</button>
        `;
        exploreList.appendChild(card);
      });
    }
  }

});
