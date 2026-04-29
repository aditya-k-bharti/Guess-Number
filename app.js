// BrainArcade - Landing page animations via gsap

// pageExit - called from Back / Home buttons on games pages 
function pageExit(dest){
  gsap.to('body > *:not(#page-flash)', {
    opacity: 0,
    y: -16,
    duration: 0.35,
    ease: 'power2.in',
    onComplete: () => {
      gsap.to('#page-flash', {
        opacity: 1,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          window.location.href = dest;
        }
      });
    }
  });
}

// Flash overlay (shared across pages)
const flash = document.createElement('div');
flash.id = 'page-flash';
flash.style.cssText = [
  'position: fixed',
  'inset: 0',
  'z-index: 9999',
  'pointer-events: none',
  'opacity: 0',
  'background: #0a0b0f',
].join(';');
document.body.appendChild(flash);

// Page ENTER - fade the flash out on every page load 
window.addEventListener('DOMContentLoaded', () => {
  gsap.set('#page-flash', { 
    opacity: 1 
  });
  gsap.to('#page-flash', {
    opacity: 0,
    duration: 0.55,
    ease: 'power2.out',
    delay: 0.05
  });
});

// Landing page specific
document.addEventListener('DOMContentLoaded', () => {
  // Hero stagger entrance
  gsap.set(['.hero-eyebrow', '.hero-title', '.hero-sub'], {
    y: 30,
    opacity: 0
  });
  gsap.set('.game-grid', {
    y: 40,
    opacity: 0
  });

  const tl = gsap.timeline({
    defaults: {
      ease: 'power3.out'
    }, 
    delay: 0.3
  })
  .to('.hero-eyebrow', {
    opacity: 1,
    y: 0,
    duration: 0.6
  })
  .to('.hero-title', {
    opacity: 1,
    y: 0,
    duration: 0.7
  }, '-=0.3')
  .to('.hero-sub', {
    opacity: 1,
    y: 0,
    duration: 0.5
  }, '-=0.4')
  .to('.game-grid', {
    opacity: 1,
    y: 0,
    duration: 0.6
  }, '-=0.3');

  // Card hover tilt
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 8,
        rotateX: -y * 8,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800,
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });
    });

    // Card CLICK -> exit animation -> navigate 
    card.addEventListener('click', e => {
      e.preventDefault();
      const dest = card.getAttribute('href');
      const isTeal = card.id === 'card-mindhunt';
      const accent = isTeal ? '#1fddbd' : '#ff5f5f';

      // 1. Selected card scales up + glows 
      gsap.to(card, {
        scale: 1.06,
        duration: 0.18,
        ease: 'power2.out'
      });

      // 2. Other cards fade out 
      document.querySelectorAll('.game-card').forEach(c => {
        if(c !== card) gsap.to(c, {
          opacity: 0, 
          y: 20,
          duration: 0.3,
          ease: 'power2.in',
        });
      });

      // 3. Rest of page fades 
      gsap.to(['.hero-section', '.landing-footer-note', 'footer'], {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in'
      });

      // 4. Selected card flies to center & grows 
      gsap.to(card, {
        scale: 1.15,
        opacity: 0,
        duration: 0.38,
        ease: 'power2.in',
        onComplete: () => {
          // 5. Flash the accent Color, then go dark -> navigate 
          gsap.to('#page-flash', {
            opacity: 1,
            duration: 0.22,
            ease: 'power2.in',
            onComplete: () => {
              window.location.href = dest;
            }
          });
        }
      });
    });
  });
});