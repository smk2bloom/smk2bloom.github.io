const menuItems = document.querySelectorAll('.menu-item');
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

// Create canvas element for particle network
document.addEventListener('DOMContentLoaded', function() {
  // Insert canvas after header and before content
  const header = document.querySelector('.header');
  const nav = document.querySelector('nav');
  
  const canvas = document.createElement('canvas');
  canvas.id = 'particleCanvas';
  canvas.style.position = 'absolute';
  canvas.style.top = (header.offsetHeight + nav.offsetHeight) + 'px';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = 'calc(100% - ' + (header.offsetHeight + nav.offsetHeight) + 'px)';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none'; // Make canvas non-interactive
  
  // Insert the canvas after the nav element
  nav.after(canvas);
  
  // Initialize particle network
  initParticleNetwork();
});

function initParticleNetwork() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas dimensions
  function resizeCanvas() {
  const header = document.querySelector('.header');
  const nav = document.querySelector('nav');
  const footer = document.querySelector('.isi_footer1');
  
  // Dapatkan posisi footer relatif terhadap dokumen
  const footerTop = footer.getBoundingClientRect().top + window.scrollY;
  
  // Hitung tinggi canvas yang diinginkan
  const canvasTop = header.offsetHeight + nav.offsetHeight;
  const canvasHeight = footerTop - canvasTop;

  // Update dimensi canvas
  canvas.width = window.innerWidth;
  canvas.height = Math.max(canvasHeight, 0); // Pastikan tidak negatif
  canvas.style.top = canvasTop + 'px';
}

// Tambahkan event listener untuk scroll dan resize
window.addEventListener('scroll', resizeCanvas);
window.addEventListener('resize', resizeCanvas);
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Mouse interaction
  const mouse = {
    x: undefined,
    y: undefined,
    radius: 100,
    mode: 'collect' // 'collect' or 'disperse'
  };
  
  canvas.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y - (document.querySelector('.header').offsetHeight + document.querySelector('nav').offsetHeight);
  });
  
  canvas.addEventListener('click', function() {
    mouse.mode = mouse.mode === 'collect' ? 'disperse' : 'collect';
  });
  
  // Node class
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
  
      if (mouse.x && mouse.y) {
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
      }
  
      // Ensure the nodes keep moving by adding a small random value
      this.dx += (Math.random() * 0.1) - 0.05;
      this.dy += (Math.random() * 0.1) - 0.05;
      
      // Limit maximum speed
      this.dx = Math.max(-2, Math.min(2, this.dx));
      this.dy = Math.max(-2, Math.min(2, this.dy));
    }
  }
  
  // Create nodes
  function createNodes() {
    let nodes = [];
    let nodeCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 8000)); // Adjust node count based on screen size
    
    for (let i = 0; i < nodeCount; i++) {
      let size = Math.random() * 1.5 + 0.5; // Random size between 0.5 and 2
      let x = Math.random() * (canvas.width - size * 2) + size;
      let y = Math.random() * (canvas.height - size * 2) + size;
      nodes.push(new Node(x, y, size));
    }
    return nodes;
  }
  
  let nodes = createNodes();
  
  // Connect nodes with lines
  function connectNodes() {
    for (let a = 0; a < nodes.length; a++) {
      for (let b = a; b < nodes.length; b++) {
        let dx = nodes[a].x - nodes[b].x;
        let dy = nodes[a].y - nodes[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        // Max connection distance - scale by screen size
        let connectionDistance = Math.min(150, canvas.width / 10);
  
        if (distance < connectionDistance) {
          // Opacity based on distance
          let opacity = 1 - (distance / connectionDistance);
          ctx.strokeStyle = `rgba(255,255,255,${opacity * 0.2})`;
          ctx.lineWidth = Math.min(0.8, opacity * 1.5);
          ctx.beginPath();
          ctx.moveTo(nodes[a].x, nodes[a].y);
          ctx.lineTo(nodes[b].x, nodes[b].y);
          ctx.stroke();
        }
      }
    }
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw all nodes
    nodes.forEach(node => {
      node.update();
      node.draw();
    });
    
    // Connect nodes with lines
    connectNodes();
    
    requestAnimationFrame(animate);
  }
  
  // Start animation
  animate();
  
  // Handle window resize - recreate nodes on significant resize
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      nodes = createNodes(); // Recreate nodes when window is resized
    }, 200);
  });
}
