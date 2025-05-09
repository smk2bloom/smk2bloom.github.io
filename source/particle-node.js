// Particle Node Network Effect - DRY Version
document.addEventListener('DOMContentLoaded', function() {
  // Menu functionality
  initMenuInteractions();
  
  // Create and setup canvas
  setupCanvas();
  
  // Initialize particle network
  initParticleNetwork();
});

// Initialize menu item interactions
function initMenuInteractions() {
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
}

// Canvas and global variables
let canvas, ctx, nodes, mouse, lastScrollY = 0;

// Setup canvas element
function setupCanvas() {
  // Insert canvas after header and before content
  const header = document.querySelector('.header');
  const nav = document.querySelector('nav');
  
  canvas = document.createElement('canvas');
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
  
  // Initialize canvas context
  ctx = canvas.getContext('2d');
  
  // Initialize mouse object
  mouse = {
    x: undefined,
    y: undefined,
    radius: 100,
    mode: 'collect' // 'collect' or 'disperse'
  };
  
  // Setup event listeners
  setupEventListeners();
  
  // Set initial canvas dimensions
  resizeCanvas();
}

// Setup all event listeners
function setupEventListeners() {
  // Mouse move handling
  canvas.addEventListener('mousemove', handleMouseMove);
  
  // Mouse click to toggle mode
  canvas.addEventListener('click', toggleMouseMode);
  
  // Window resize handling with debounce
  window.addEventListener('resize', handleResize);
  
  // Scroll event for optimization
  window.addEventListener('scroll', handleScroll);
}

// Handle mouse movement
function handleMouseMove(event) {
  const header = document.querySelector('.header');
  const nav = document.querySelector('nav');
  
  mouse.x = event.x;
  mouse.y = event.y - (header.offsetHeight + nav.offsetHeight);
}

// Toggle between collect and disperse modes
function toggleMouseMode() {
  mouse.mode = mouse.mode === 'collect' ? 'disperse' : 'collect';
}

// Handle window resize with debounce
function handleResize() {
  resizeCanvas();
  nodes = createNodes(); // Reset node positions
}

// Handle scroll events for optimization
function handleScroll() {
  if (Math.abs(window.scrollY - lastScrollY) > 50) {
    resizeCanvas();
    lastScrollY = window.scrollY;
  }
}

// Resize canvas dimensions
function resizeCanvas() {
  const header = document.querySelector('.header');
  const nav = document.querySelector('nav');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - (header.offsetHeight + nav.offsetHeight);
  canvas.style.top = (header.offsetHeight + nav.offsetHeight) + 'px';
}

// Node class for particle management
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
    // Boundary collision handling
    this.handleBoundaryCollision();
    
    // Position update
    this.x += this.dx;
    this.y += this.dy;

    // Mouse interaction if mouse position exists
    if (mouse.x && mouse.y) {
      this.handleMouseInteraction();
    }

    // Add small random movement
    this.addRandomMovement();
    
    // Limit maximum speed
    this.limitSpeed();
  }
  
  handleBoundaryCollision() {
    if (this.x + this.size > canvas.width || this.x - this.size < 0) {
      this.dx *= -1;
    }

    if (this.y + this.size > canvas.height || this.y - this.size < 0) {
      this.dy *= -1;
    }
  }
  
  handleMouseInteraction() {
    let dx, dy, distance, angle, tx, ty;
    
    if (mouse.mode === 'collect') {
      dx = mouse.x - this.x;
      dy = mouse.y - this.y;
      distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        angle = Math.atan2(dy, dx);
        tx = mouse.x + Math.cos(angle) * mouse.radius;
        ty = mouse.y + Math.sin(angle) * mouse.radius;

        this.dx = (tx - this.x) * 0.1;
        this.dy = (ty - this.y) * 0.1;
      }
    } else if (mouse.mode === 'disperse') {
      dx = this.x - mouse.x;
      dy = this.y - mouse.y;
      distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius * 2) {
        angle = Math.atan2(dy, dx);
        tx = mouse.x + Math.cos(angle) * (mouse.radius * 2);
        ty = mouse.y + Math.sin(angle) * (mouse.radius * 2);

        this.dx = (tx - this.x) * 0.1;
        this.dy = (ty - this.y) * 0.1;
      }
    }
  }
  
  addRandomMovement() {
    // Ensure the nodes keep moving by adding a small random value
    this.dx += (Math.random() * 0.1) - 0.05;
    this.dy += (Math.random() * 0.1) - 0.05;
  }
  
  limitSpeed() {
    // Prevent excessive speeds
    this.dx = Math.max(-2, Math.min(2, this.dx));
    this.dy = Math.max(-2, Math.min(2, this.dy));
  }
}

// Create initial nodes
function createNodes() {
  let nodesArray = [];
  let nodeCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 8000)); // Adjust node count based on screen size
  
  for (let i = 0; i < nodeCount; i++) {
    let size = 1;
    let x = Math.random() * (canvas.width - size * 2) + size;
    let y = Math.random() * (canvas.height - size * 2) + size;
    nodesArray.push(new Node(x, y, size));
  }
  return nodesArray;
}

// Connect nodes with lines when close enough
function connectNodes() {
  const connectionDistance = Math.min(100, canvas.width / 10);
  
  for (let a = 0; a < nodes.length; a++) {
    for (let b = a; b < nodes.length; b++) {
      let dx = nodes[a].x - nodes[b].x;
      let dy = nodes[a].y - nodes[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionDistance) {
        // Opacity based on distance
        let opacity = 1 - (distance / connectionDistance);
        ctx.strokeStyle = `rgba(255,255,255,${opacity * 0.1})`; // Slightly lower opacity for better performance
        ctx.lineWidth = 1;
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
  
  // Only update if canvas is visible in viewport
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

// Initialize the particle network
function initParticleNetwork() {
  // Create initial nodes
  nodes = createNodes();
  
  // Start animation loop
  animate();
}
