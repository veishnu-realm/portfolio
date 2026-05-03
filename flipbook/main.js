let resizeTimeout;

// 🔥 ZOOM SETTINGS
let zoomLevel = 1;
const zoomStep = 0.2;
const maxZoom = 2.5;
const minZoom = 1;

$(document).ready(function () {

  const $book = $("#book");

  // 🔴 Safety check
  if (!$.fn.turn) {
    console.error("Turn.js not loaded");
    return;
  }

  // 🔥 Preload images
  preloadImages();

  // 🔥 INIT TURN
  $book.turn({
    width: $book.width(),
    height: $book.height(),
    autoCenter: true,

    gradients: false,
    duration: 800,
    elevation: 50,

    when: {
      turned: function (e, page) {
        $("#page-number").text("Page " + page);

        const total = $book.turn("pages");

        if (page === 2 || page === total - 1) {
          // first and last visible pages
          $book.css("background", "transparent");
        } else {
          $book.css("background", "#000");
        }
      }
    }
  }); // ✅ THIS WAS MISSING

  // 🔹 NAVIGATION
  window.nextPage = function () {
    if (zoomLevel > 1) return;
    $book.turn("next");
  };

  window.prevPage = function () {
    if (zoomLevel > 1) return;
    $book.turn("previous");
  };

  // 🔹 KEYBOARD
  $(document).keydown(function (e) {
    if (zoomLevel > 1) return;

    if (e.key === "ArrowRight") nextPage();
    if (e.key === "ArrowLeft") prevPage();
  });

  // 🔹 CLICK NAVIGATION
  $("#book").on("click", function (e) {
    if (zoomLevel > 1) return;

    const rect = this.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    if (clickX > rect.width / 2) nextPage();
    else prevPage();
  });

  // 🔹 RESIZE
  $(window).on("resize", function () {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      $book.turn("size", $book.width(), $book.height());
    }, 200);
  });

});


// 🔥 ZOOM FUNCTIONS

window.zoomIn = function () {
  zoomLevel = Math.min(maxZoom, zoomLevel + zoomStep);
  applyZoom();
};

window.zoomOut = function () {
  zoomLevel = Math.max(minZoom, zoomLevel - zoomStep);
  applyZoom();
};

function applyZoom() {
  const book = document.getElementById("book");

  book.style.transform = `scale(${zoomLevel})`;
  book.style.transformOrigin = "center center";
}


// 🔥 IMAGE PRELOAD

function preloadImages() {
  const images = document.querySelectorAll("#book img");

  images.forEach(img => {
    const i = new Image();
    i.src = img.src;
  });
}