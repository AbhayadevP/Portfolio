/* =============================================
   PORTFOLIO JAVASCRIPT
   Animations, Interactivity, Effects
   ============================================= */

// ============ PARTICLE BACKGROUND ============
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(199, 120, 221, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  let mouse = { x: null, y: null };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.update();
      p.draw();

      // Draw connections near mouse
      if (mouse.x && mouse.y) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(199, 120, 221, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // Draw connections between nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(199, 120, 221, ${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.4;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
})();


// ============ NAVBAR SCROLL EFFECT ============
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


// ============ HAMBURGER MOBILE MENU ============
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});


// ============ ACTIVE NAV LINK ON SCROLL ============
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));


// ============ TYPED TEXT EFFECT ============
const typedTexts = [
  'AI Full-Stack Developer',
  'React.js Developer',
  'Node.js Engineer',
  'LLM Integration Expert',
  'Problem Solver'
];

let typedIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-text');

function typeWriter() {
  const current = typedTexts[typedIndex];
  if (isDeleting) {
    charIndex--;
    typedEl.textContent = current.substring(0, charIndex);
  } else {
    charIndex++;
    typedEl.textContent = current.substring(0, charIndex);
  }

  let delay = isDeleting ? 50 : 80;

  if (!isDeleting && charIndex === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    typedIndex = (typedIndex + 1) % typedTexts.length;
    delay = 400;
  }

  setTimeout(typeWriter, delay);
}

typeWriter();


// ============ INTERSECTION OBSERVER ANIMATIONS ============
const animateOnScrollItems = document.querySelectorAll(
  '.timeline-item, .achievement-card, .project-card, .skill-category, .about-grid, .contact-layout'
);

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger effect
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 100);
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animateOnScrollItems.forEach(el => {
  scrollObserver.observe(el);
});

// Fade-in sections
document.querySelectorAll('.section').forEach(section => {
  section.classList.add('fade-in-section');
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        sectionObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  sectionObs.observe(section);
});


// ============ PROJECT FILTER ============
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const categories = card.dataset.category;
      if (filter === 'all' || categories.includes(filter)) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});


// ============ CONTACT FORM (Formspree) ============
// HOW IT WORKS:
// 1. Go to https://formspree.io and sign up for a free account
// 2. Create a new form — Formspree gives you a unique endpoint URL
// 3. Replace YOUR_FORM_ID below with your actual form ID (e.g. "xpwzabcd")
// 4. Formspree will forward every submission directly to abhayadev1628@gmail.com
// 5. Free plan allows 50 submissions/month — more than enough for a portfolio

const FORMSPREE_ID = 'xbdpzaoa'; // <-- Replace this with your Formspree form ID

const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const formError = document.getElementById('form-error');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email-input').value.trim();
  const message = document.getElementById('contact-message').value.trim();

  if (!name || !email || !message) {
    alert('Please fill in all required fields.');
    return;
  }

  const submitBtn = document.getElementById('form-submit-btn');
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  // Hide any previous status messages
  if (formSuccess) formSuccess.style.display = 'none';
  if (formError) formError.style.display = 'none';

  try {
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        subject: document.getElementById('contact-subject').value.trim() || '(No subject)',
        message: message
      })
    });

    if (response.ok) {
      // Success — email was sent to you
      if (formSuccess) {
        formSuccess.style.display = 'block';
        setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
      }
      contactForm.reset();
    } else {
      // Formspree returned an error (e.g. form ID not set up yet)
      const data = await response.json();
      console.error('Formspree error:', data);
      if (formError) {
        formError.style.display = 'block';
        setTimeout(() => { formError.style.display = 'none'; }, 6000);
      }
    }
  } catch (err) {
    // Network error
    console.error('Network error:', err);
    if (formError) {
      formError.style.display = 'block';
      setTimeout(() => { formError.style.display = 'none'; }, 6000);
    }
  } finally {
    submitBtn.textContent = 'Send Message →';
    submitBtn.disabled = false;
  }
});


// ============ SMOOTH SCROLL FOR ALL ANCHOR LINKS ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ============ ACHIEVEMENT CARD STAGGER ============
const achievementCards = document.querySelectorAll('.achievement-card');
const achObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
        entry.target.style.transitionDelay = `${i * 0.1}s`;
      }, i * 80);
      achObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

achievementCards.forEach(card => achObserver.observe(card));


// ============ CURSOR GLOW EFFECT ============
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position: fixed;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(199,120,221,0.06) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s;
`;
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});


// ============ CONSOLE EASTER EGG ============
console.log(`
%c
  █████╗ ██████╗ 
 ██╔══██╗██╔══██╗
 ███████║██████╔╝
 ██╔══██║██╔═══╝ 
 ██║  ██║██║     
 ╚═╝  ╚═╝╚═╝     
%c
Hey there, curious developer! 👋
I'm Abhayadev P — AI Full-Stack Developer.
Looking to collaborate? Reach out at abhayadev1628@gmail.com
GitHub: https://github.com/AbhayadevP
LinkedIn: https://www.linkedin.com/in/abhayadevp
`, 'color: #c778dd; font-family: monospace;', 'color: #8892b0; font-family: monospace;');