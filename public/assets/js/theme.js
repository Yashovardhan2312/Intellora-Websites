// Runs before first paint: restores the saved theme and flags that JavaScript is available.
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  try {
    var saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) {
    /* storage unavailable: fall back to the system preference */
  }
})();
