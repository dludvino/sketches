document.addEventListener("DOMContentLoaded", function () {
  var modal = document.getElementById("image-modal");
  var modalImage = document.getElementById("image-modal-image");
  var modalCaption = document.getElementById("image-modal-caption");
  var closeButton = document.querySelector(".image-modal__close");
  var backdrop = document.querySelector(".image-modal__backdrop");

  if (!modal || !modalImage || !modalCaption || !closeButton || !backdrop) {
    return;
  }

  var imageSelector = "main figure img";
  var images = document.querySelectorAll(imageSelector);
  var lastFocusedElement = null;

  function openModal(imageElement) {
    if (!imageElement || !imageElement.getAttribute("src")) {
      return;
    }

    lastFocusedElement = document.activeElement;

    modalImage.src = imageElement.currentSrc || imageElement.src;
    modalImage.alt = imageElement.alt || "Expanded image";

    var figure = imageElement.closest("figure");
    var inlineCaption = figure ? figure.querySelector("figcaption") : null;
    modalCaption.textContent = inlineCaption ? inlineCaption.textContent.trim() : "";

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("image-modal-open");
    closeButton.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modalImage.src = "";
    modalImage.alt = "";
    modalCaption.textContent = "";
    document.body.classList.remove("image-modal-open");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  images.forEach(function (imageElement) {
    imageElement.classList.add("js-lightbox-image");
    imageElement.tabIndex = 0;
    imageElement.setAttribute("role", "button");
    imageElement.setAttribute("aria-label", (imageElement.alt ? "Expand image: " + imageElement.alt : "Expand image"));

    imageElement.addEventListener("click", function () {
      openModal(imageElement);
    });

    imageElement.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(imageElement);
      }
    });
  });

  closeButton.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", function (event) {
    if (!modal.hidden && event.key === "Escape") {
      closeModal();
    }
  });
});
