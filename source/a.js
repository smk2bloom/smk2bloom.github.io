
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
class Node {
  constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.baseX = x;
      this.baseY = y;
      this.dx = (Math.random() * 2) - 1;
      this.dy = (Math.random() * 2) - 1;
  }

  draw() {
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
  }

  update() {
      if (this.x + this.size > canvas.width || this.x - this.size < 0) {
          this.dx *= -1;
      }

      if (this.y + this.size > canvas.height || this.y - this.size < 0) {
          this.dy *= -1;
      }

      this.x += this.dx;
      this.y += this.dy;

      if (mouse.mode === 'collect') {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
              let angle = Math.atan2(dy, dx);
              let tx = mouse.x + Math.cos(angle) * mouse.radius;
              let ty = mouse.y + Math.sin(angle) * mouse.radius;

              this.dx = (tx - this.x) * 0.1;
              this.dy = (ty - this.y) * 0.1;
          }
      } else if (mouse.mode === 'disperse') {
          let dx = this.x - mouse.x;
          let dy = this.y - mouse.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius * 2) {
              let angle = Math.atan2(dy, dx);
              let tx = mouse.x + Math.cos(angle) * (mouse.radius * 2);
              let ty = mouse.y + Math.sin(angle) * (mouse.radius * 2);

              this.dx = (tx - this.x) * 0.1;
              this.dy = (ty - this.y) * 0.1;
          }
      }

      // Ensure the nodes keep moving by adding a small random value
      this.dx += (Math.random() * 0.1) - 0.05;
      this.dy += (Math.random() * 0.1) - 0.05;
  }
}

function createNodes() {
  let nodes = [];
  for (let i = 0; i < 100; i++) {
      let size = 1;
      let x = Math.random() * (canvas.width - size * 2) + size;
      let y = Math.random() * (canvas.height - size * 2) + size;
      nodes.push(new Node(x, y, size));
  }
  return nodes;
}

let nodes = createNodes();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  nodes.forEach(node => {
      node.draw();
      node.update();
  });
  connectNodes();
  handleModes();
  requestAnimationFrame(animate);
}

function connectNodes() {
  for (let a = 0; a < nodes.length; a++) {
      for (let b = a; b < nodes.length; b++) {
          let dx = nodes[a].x - nodes[b].x;
          let dy = nodes[a].y - nodes[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
              ctx.strokeStyle = 'rgba(255,255,255,0.1)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(nodes[a].x, nodes[a].y);
              ctx.lineTo(nodes[b].x, nodes[b].y);
              ctx.stroke();
          }
      }
  }
}
const menuItems = document.querySelectorAll('.menu-item');*/
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    if (Math.abs(window.scrollY - lastScrollY) > 50) {
        resizeCanvas();
        lastScrollY = window.scrollY;
    }
});
// Di dalam fungsi animate():
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Hanya update jika canvas terlihat di viewport
    const canvasRect = canvas.getBoundingClientRect();
    if (canvasRect.bottom > 0 && canvasRect.top < window.innerHeight) {
        nodes.forEach(node => {
            node.update();
            node.draw();
        });
        connectNodes();
    }
    
    requestAnimationFrame(animate);
}
