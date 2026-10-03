// Banner overflow menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const overflowBtn = document.querySelector('.banner-overflow-btn');
  const overflowMenu = document.querySelector('.banner-overflow-menu');

  if (overflowBtn && overflowMenu) {
    overflowBtn.addEventListener('click', function() {
      overflowMenu.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!overflowBtn.contains(event.target) && !overflowMenu.contains(event.target)) {
        overflowMenu.classList.remove('open');
      }
    });

    // Close overflow menu after selecting an in-page section link.
    overflowMenu.addEventListener('click', function(event) {
      const link = event.target.closest('a[href^="#"]');
      if (link) {
        overflowMenu.classList.remove('open');
      }
    });

    // Show focus ring for keyboard users only (not mouse click)
    let usingKeyboard = false;
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Tab' || event.key === 'Shift') {
        usingKeyboard = true;
      }
    });
    document.addEventListener('mousedown', function() {
      usingKeyboard = false;
    });

    overflowBtn.addEventListener('focus', function() {
      if (usingKeyboard) {
        overflowBtn.classList.add('focus-ring');
      }
    });
    overflowBtn.addEventListener('blur', function() {
      overflowBtn.classList.remove('focus-ring');
    });
  }
});