// ==========================
// LOADER ANIMATION (FIXED)
// ==========================

document.body.classList.add("loading");

window.addEventListener("load", () => {

  const loader = document.getElementById("loader");
  if (!loader) return;

  const tl = gsap.timeline();

  tl.from(".loader-logo img", {
    scale: 1,
    opacity: 0,
    duration: 0.5,
    ease: "power3.out"
  })
  .to(".loader-logo img", {
    scale: 80,
    duration: 0.4,
    ease: "power4.inOut"
  })
  .to(loader, {
    opacity: 0,
    duration: 0.5,
    ease: "power2.out",
    onComplete: () => {
      document.body.classList.remove("loading");
loader.remove();
initSite(); // 👈 start site AFTER loader
    }
  });

});

// ==========================
// INIT AFTER LOADER
// ==========================
function initSite() {

  // ==========================
  // SMOOTH SCROLL (LENIS)
  // ==========================
  const lenis = new Lenis({ smooth: true, lerp: 0.08 });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // ==========================
  // GSAP SETUP
  // ==========================
  gsap.registerPlugin(ScrollTrigger);

  // HERO ENTRANCE
  gsap.from(".base-img", { scale: 1.1, opacity: 0, duration: 1.2, ease: "power3.out" });
  gsap.from(".hero-text h1", { y: 60, opacity: 0, duration: 1, delay: 0.2 });
  gsap.from(".hero-text p", { y: 40, opacity: 0, duration: 1, delay: 0.4 });

  // REALM CARDS
  gsap.utils.toArray(".REALM-card").forEach(card => {
    gsap.from(card, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 80%"
      }
    });
  });

  // ==========================
  // LIQUID BLOB SYSTEM (OPTIMIZED)
  // ==========================
  const hero = document.querySelector(".liquid-wrap");
  const svg = document.querySelector(".liquid-mask");
  const mainBlob = document.getElementById("mainBlob");

  if (hero && svg && mainBlob) {

    let lastX = 200, lastY = 250, lastTime = performance.now();
    let currentX = 200, currentY = 250;
    let currentRadius = 20, targetRadius = 20;
    let stretchX = 1, stretchY = 1;

    let lastTrailTime = 0;
    let idleTimer;
    let idleActive = false;

    hero.addEventListener("mousemove", (e) => {

      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;

      const matrix = svg.getScreenCTM();
      if (!matrix) return;

      const svgP = pt.matrixTransform(matrix.inverse());

      const now = performance.now();
      const dx = svgP.x - lastX;
      const dy = svgP.y - lastY;
      const dt = Math.max(16, now - lastTime);

      const speed = Math.sqrt(dx * dx + dy * dy) / dt;

      targetRadius = Math.min(30, 10 + speed * 250);
      stretchX = 1 + Math.abs(dx) * 0.008;
      stretchY = 1 + Math.abs(dy) * 0.008;

      currentX = svgP.x;
      currentY = svgP.y;

      // 🔥 OPTIMIZED TRAIL
      if (now - lastTrailTime > 60) {
        lastTrailTime = now;

        const trail = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        trail.setAttribute("cx", svgP.x);
        trail.setAttribute("cy", svgP.y);
        trail.setAttribute("r", targetRadius);
        trail.setAttribute("fill", "white");

        mainBlob.parentNode.appendChild(trail);

        gsap.to(trail, {
          attr: { r: 0 },
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => trail.remove()
        });
      }

      lastX = svgP.x;
      lastY = svgP.y;
      lastTime = now;
    });

    function animateBlob() {
      currentRadius += (targetRadius - currentRadius) * 0.1;
      targetRadius *= 0.94;

      mainBlob.setAttribute("cx", currentX);
      mainBlob.setAttribute("cy", currentY);
      mainBlob.setAttribute("r", currentRadius);

      mainBlob.style.transform = `scale(${stretchX}, ${stretchY})`;

      stretchX += (1 - stretchX) * 0.1;
      stretchY += (1 - stretchY) * 0.1;

      requestAnimationFrame(animateBlob);
    }

    animateBlob();
  }

  // ==========================
  // SIGNATURE SCROLL
  // ==========================
  const path = document.querySelector(".signature path");
  if (!path) return;

  const length = path.getTotalLength();

  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length + 1
  });

  const heroTL = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "+=100%",
      scrub: true,
      pin: true
    }
  });

  heroTL.to(".hero-image", {
    scale: 0.3,
    filter: "grayscale(100%)",
    opacity: 0.5,
    ease: "none"
  });

  heroTL.to(".hero-text", {
    scale: 0.9,
    x: -25,
    y: -25,
    ease: "none"
  }, 0);

  heroTL.to(path, {
    strokeDashoffset: 0,
    ease: "none"
  }, 0.3);

}