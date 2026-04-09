console.log("JS LOADED");

let isAnimating = false;

const projects = [
  {
    main: "../images/project1.jpg",
    images: [
      "../images/project1.jpg",
      "../images/project1.jpg",
      "../images/project1.jpg"
    ]
  },
  {
    main: "../images/project1.jpg",
    images: [
      "../images/project1.jpg",
      "../images/project1.jpg"
    ]
  },
  {
    main: "../images/project1.jpg",
    images: [
      "../images/project1.jpg",
      "../images/project1.jpg"
    ]
  },
  {
    main: "../images/project1.jpg",
    images: [
      "../images/project1.jpg",
      "../images/project1.jpg"
    ]
  },
  {
    main: "../images/project1.jpg",
    images: [
      "../images/project1.jpg",
      "../images/project1.jpg"
    ]
  }
];

function openProject(event, i) {
  if (isAnimating) return;
  isAnimating = true;

  const p = projects[i];

  if (!p) {
    isAnimating = false;
    return;
  }

  const img = event.currentTarget;
  const rect = img.getBoundingClientRect();

  const clone = img.cloneNode();
  clone.style.position = "fixed";
  clone.style.top = rect.top + "px";
  clone.style.left = rect.left + "px";
  clone.style.width = rect.width + "px";
  clone.style.height = rect.height + "px";
  clone.style.zIndex = "2000";
  clone.style.transition = "all 0.6s cubic-bezier(0.65, 0, 0.35, 1)";
  clone.style.objectFit = "contain";
  clone.style.background = "#000";

  document.body.appendChild(clone);

  requestAnimationFrame(() => {
    clone.style.top = "50%";
    clone.style.left = "50%";
    clone.style.transform = "translate(-50%, -50%)";
    clone.style.width = "auto";
    clone.style.height = "80vh";
  });

  setTimeout(() => {
    const overlay = document.getElementById("projectOpen");
    const gallery = document.getElementById("gallery");

    overlay.classList.add("active");
    overlay.style.opacity = "1";

    gallery.innerHTML = "";

    const main = document.createElement("img");
main.src = p.main;

// 🔥 ADD THIS
main.loading = "lazy";

    p.images.forEach((src, index) => {
      if (src === p.main && index === 0) return;

      const el = document.createElement("img");
el.src = src;

// 🔥 ADD THIS
el.loading = "lazy";

gallery.appendChild(el);
    });

    document.body.style.overflow = "hidden";

    clone.style.transition = "opacity 0.6s cubic-bezier(0.65, 0, 0.35, 1)";
    clone.style.opacity = "0";

    setTimeout(() => {
      clone.remove();
      isAnimating = false;
    }, 600);

    setupGlobalScroll(gallery);

  }, 500);
}

function closeProject() {
  const overlay = document.getElementById("projectOpen");

  overlay.style.opacity = "0";

  setTimeout(() => {
    overlay.classList.remove("active");
    overlay.style.opacity = "";
    document.body.style.overflow = "auto";

    if (window.removeGlobalScroll) {
      window.removeGlobalScroll();
    }

  }, 300);
}

window.openProject = openProject;
window.closeProject = closeProject;

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeProject();
});


// ================= GLOBAL SCROLL + DRAG =================

function setupGlobalScroll(container) {

  // 🔹 WHEEL SCROLL
  function onWheel(e) {
    e.preventDefault();
    container.scrollLeft += e.deltaY * 3;
  }

  container.addEventListener("wheel", onWheel, { passive: false });

  // 🔹 MOUSE DRAG
  let isDown = false;
  let startX;
  let scrollLeft;

  function onMouseDown(e) {
  isDown = true;

  container.style.cursor = "grabbing";

  // 🔥 ADD THIS
  container.style.scrollBehavior = "auto";

  startX = e.pageX - container.offsetLeft;
  scrollLeft = container.scrollLeft;
}

  function onMouseLeave() {
  isDown = false;
  container.style.cursor = "grab";

  // 🔥 ADD HERE TOO
  container.style.scrollBehavior = "smooth";
}

  function onMouseUp() {
  isDown = false;
  container.style.cursor = "grab";

  // 🔥 RESTORE SMOOTH SCROLL
  container.style.scrollBehavior = "smooth";
}
  function onMouseMove(e) {
    if (!isDown) return;

    e.preventDefault();

    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;

    container.scrollLeft = scrollLeft - walk;
  }

  container.addEventListener("mousedown", onMouseDown);
  container.addEventListener("mouseleave", onMouseLeave);
  container.addEventListener("mouseup", onMouseUp);
  container.addEventListener("mousemove", onMouseMove);

  // 🔹 CLEANUP
  window.removeGlobalScroll = () => {
    container.removeEventListener("wheel", onWheel);
    container.removeEventListener("mousedown", onMouseDown);
    container.removeEventListener("mouseleave", onMouseLeave);
    container.removeEventListener("mouseup", onMouseUp);
    container.removeEventListener("mousemove", onMouseMove);
  };
}