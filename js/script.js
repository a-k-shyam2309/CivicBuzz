// ============================================================
// CivicBuzz — script.js
// Currently handles ONE thing: showing/hiding the profile dropdown
// menu in the top navigation bar. No backend, auth, or API calls
// happen here yet — see the README for what's planned next.
// ============================================================

// Grab the two elements we need: the button that opens the menu,
// and the dropdown panel itself.
const profileButton = document.getElementById('profile-icon-btn');
const profileDropdown = document.getElementById('profile-dropdown');

// Toggle the profile dropdown when the profile icon is clicked
profileButton.addEventListener('click', function (event) {
  // Stop this click from immediately triggering the "click outside"
  // handler below, which would close the dropdown right after it opens.
  event.stopPropagation();

  const isHidden = profileDropdown.classList.contains('hidden');
  profileDropdown.classList.toggle('hidden');

  // Keep the button's aria-expanded attribute in sync for screen readers.
  profileButton.setAttribute('aria-expanded', String(isHidden));
});

// Close the dropdown when the user clicks anywhere outside of it
document.addEventListener('click', function (event) {
  const clickedInsideDropdown = profileDropdown.contains(event.target);
  const clickedButton = profileButton.contains(event.target);

  if (!clickedInsideDropdown && !clickedButton) {
    profileDropdown.classList.add('hidden');
    profileButton.setAttribute('aria-expanded', 'false');
  }
});
