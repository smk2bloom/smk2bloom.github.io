
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

/*// Hapus kode yang di-comment dan ganti dengan ini:

const firebaseConfig = {
  apiKey: "AIzaSyCLql1TJWQG85bagDvZVEQpYukxkvx-P6g",
  authDomain: "smk2bloom.firebaseapp.com",
  projectId: "smk2bloom",
  storageBucket: "smk2bloom.firebasestorage.app",
  messagingSenderId: "383311108717",
  appId: "1:383311108717:web:9661de6ac3631d081afd64",
  measurementId: "G-CY99D63FMW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function handleCredentialResponse(response) {
  const credential = firebase.auth.GoogleAuthProvider.credential(response.credential);
  
  firebase.auth().signInWithCredential(credential)
    .then((result) => {
      const user = result.user;
      document.getElementById('login-link').style.display = 'none';
      document.getElementById('login-link1').style.display = 'none';
      document.getElementById('greeting').style.display = 'block';
      document.getElementById('user-name').textContent = user.displayName || user.email.split('@')[0];
    })
    .catch((error) => {
      console.error('Login error:', error);
    });
}

function initializeGoogleSignIn() {
  google.accounts.id.initialize({
    client_id: 'YOUR_GOOGLE_CLIENT_ID', // Ganti dengan Client ID Anda
    callback: handleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: true
  });
  
  google.accounts.id.renderButton(
    document.getElementById('login-link'),
    {
      type: 'icon',
      shape: 'circle',
      theme: 'filled_blue',
      size: 'medium',
      text: 'signin_with'
    }
  );
}

// Panggil inisialisasi setelah DOM siap
document.addEventListener('DOMContentLoaded', function() {
  initializeGoogleSignIn();
});
