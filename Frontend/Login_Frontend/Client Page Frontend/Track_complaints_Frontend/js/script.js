
// CivicBuzz — Track Complaints page


const filterButtons = document.querySelectorAll('.filter-chip');
const complaintCards = document.querySelectorAll('.complaint-card');

filterButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    filterButtons.forEach(function (b) { b.classList.remove('active'); });
    button.classList.add('active');

    const chosenPriority = button.getAttribute('data-filter');

    complaintCards.forEach(function (card) {
      const matches = chosenPriority === 'all' ||
        card.getAttribute('data-priority') === chosenPriority;
      card.style.display = matches ? '' : 'none';
    });
  });
});

const timelineToggles = document.querySelectorAll('.timeline-toggle');

timelineToggles.forEach(function (toggle) {
  toggle.addEventListener('click', function () {
    const targetId = toggle.getAttribute('data-target');
    const detail = document.getElementById(targetId);
    const isHidden = detail.hasAttribute('hidden');

    if (isHidden) {
      detail.removeAttribute('hidden');
      toggle.textContent = 'Hide timeline';
    } else {
      detail.setAttribute('hidden', '');
      toggle.textContent = 'View timeline';
    }
  });
});

// Mouse drag support for the horizontal complaints carousel.
const complaintList = document.getElementById('complaintList');
let isDragging = false;
let startX = 0;
let startScrollLeft = 0;

complaintList.addEventListener('mousedown', function (event) {
  isDragging = true;
  startX = event.pageX - complaintList.offsetLeft;
  startScrollLeft = complaintList.scrollLeft;
});

window.addEventListener('mouseup', function () {
  isDragging = false;
});

complaintList.addEventListener('mousemove', function (event) {
  if (!isDragging) return;
  event.preventDefault();
  const x = event.pageX - complaintList.offsetLeft;
  complaintList.scrollLeft = startScrollLeft - (x - startX);
});
