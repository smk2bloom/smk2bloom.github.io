
menuItems.forEach(item => {
  // Mouse interaction
  item.addEventListener('mouseenter', () => {
    item.querySelector('.dropdown').style.display = 'block';
  });
  
  item.addEventListener('mouseleave', () => {
    item.querySelector('.dropdown').style.display = 'none';
  });

  // Keyboard accessibility
  item.addEventListener('focusin', () => {
    item.querySelector('.dropdown').style.display = 'block';
  });

  item.addEventListener('focusout', () => {
    item.querySelector('.dropdown').style.display = 'none';
  });
});

/*
// Inisialisasi Google Sign-In
function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential);
  const email = data.email;
  const name = email.split('@')[0]; // Ambil nama sebelum '@'

  // Tampilkan sapaan
  document.getElementById('login-container').style.display = 'none';
  const greeting = document.getElementById('greeting');
  document.getElementById('user-name').textContent = name;
  greeting.style.display = 'block';
}

// Tambahkan Google Sign-In Button
window.onload = function () {
  google.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID', // Ganti dengan Client ID Anda
      callback: handleCredentialResponse
  });

  // Pasang event listener pada link
  document.getElementById('login-link').addEventListener('click', function (e) {
      e.preventDefault(); // Mencegah reload halaman
      google.accounts.id.prompt(); // Memunculkan prompt login Google
  });
};
