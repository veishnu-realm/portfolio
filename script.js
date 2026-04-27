// ==========================
// LOADER ANIMATION
// ==========================
window.addEventListener("load", () => {

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
  .to("#loader", {
    opacity: 0,
    duration: 0.3,
    ease: "power2.out",
    onStart: () => {
      document.getElementById("loader").style.pointerEvents = "none";
    },
    onComplete: () => {
      document.getElementById("loader").remove();
    }
  });

});

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
// LIQUID BLOB SYSTEM
// ==========================
const hero = document.querySelector(".liquid-wrap");
const svg = document.querySelector(".liquid-mask");
const mainBlob = document.getElementById("mainBlob");

let lastX = 200, lastY = 250, lastTime = performance.now();
let currentX = 200, currentY = 250;
let currentRadius = 20, targetRadius = 20;
let stretchX = 1, stretchY = 1;

let idleTimer;
let idleActive = false;
const IDLE_DELAY = 1000;

if (hero && svg && mainBlob) {

  hero.addEventListener("mousemove", (e) => {

    stopIdleBlobs();

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

    // TRAIL BLOBS
    const trail = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    trail.setAttribute("cx", svgP.x);
    trail.setAttribute("cy", svgP.y);
    trail.setAttribute("r", targetRadius);
    trail.setAttribute("fill", "white");

    mainBlob.parentNode.appendChild(trail);

    gsap.to(trail, {
      attr: { r: 0 },
      opacity: 0,
      duration: 1.2,
      ease: "power2.out",
      onComplete: () => trail.remove()
    });

    lastX = svgP.x;
    lastY = svgP.y;
    lastTime = now;

    resetIdleTimer();
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

  // ==========================
  // IDLE BLOBS
  // ==========================
  function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startIdleBlobs, IDLE_DELAY);
  }

  function startIdleBlobs() {
    if (idleActive) return;
    idleActive = true;

    for (let i = 0; i < 4; i++) {
      createAutoBlob();
    }
  }

  function stopIdleBlobs() {
    idleActive = false;
    document.querySelectorAll(".auto-blob").forEach(b => b.remove());
  }

  function createAutoBlob() {
    const blob = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    blob.classList.add("auto-blob");
    blob.setAttribute("r", 20);
    blob.setAttribute("fill", "white");

    mainBlob.parentNode.appendChild(blob);
    swipeBlob(blob);
  }

  function swipeBlob(blob) {
    const startX = -100;
    const endX = 500;
    const y = Math.random() * 500;

    blob.setAttribute("cx", startX);
    blob.setAttribute("cy", y);

    gsap.to(blob, {
      attr: { cx: endX },
      duration: 6,
      ease: "sine.inOut",
      onComplete: () => {
        if (idleActive) swipeBlob(blob);
        else blob.remove();
      }
    });

    gsap.to(blob, {
      attr: { r: "+=20" },
      yoyo: true,
      repeat: -1,
      duration: 3,
      ease: "expo.out"
    });
  }

}

// ==========================
// HERO SCROLL + SIGNATURE
// ==========================
// ==========================
// SIGNATURE SETUP (DO THIS FIRST)
// ==========================
const path = document.querySelector(".signature path");
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
  transformOrigin: "center center",
  ease: "none"
});

heroTL.to(".hero-text", {
  scale: 0.9,
  x: -25,
  y: -25,
  color: "#fff",
  ease: "none"
}, 0);

// ✅ ONLY ONE animation for signature
heroTL.to(path, {
  strokeDashoffset: 0,
  filter: "drop-shadow(0 0 10px rgba(255,255,255,0.6))",
  ease: "none"
}, 0.3);

