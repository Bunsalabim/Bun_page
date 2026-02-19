document.addEventListener("DOMContentLoaded", () => {
  const linkBoxes = document.getElementById("link_boxes");
  const linkPanel = document.getElementById("link_panel");
  const linkIcon = document.getElementById("link_icon");
  const audioPlayer = document.getElementById("audio_player"); // optional
  const musicButton = document.getElementById("music_button");
  const searchBar = document.getElementById("search_bar");

  // --- Custom scrollbar elements ---
  const linksColumns = document.querySelector(".links_columns");
  const linksScrollSlider = document.getElementById("links_scroll_slider");

  let linkOpen = false;
  let fadeTimeout;

  function setActiveState(isActive) {
    if (!linkOpen) return;

    if (fadeTimeout) clearTimeout(fadeTimeout);

    if (isActive) {
      linkBoxes.classList.add("hovering");
      linkBoxes.classList.remove("fade-background");

      if (searchBar) {
        searchBar.classList.add("hovering");
        searchBar.classList.remove("fade-background");
      }
    } else {
      linkBoxes.classList.remove("hovering");
      if (searchBar) searchBar.classList.remove("hovering");

      fadeTimeout = setTimeout(() => {
        if (linkOpen) {
          linkBoxes.classList.add("fade-background");
          if (searchBar) searchBar.classList.add("fade-background");
        }
      }, 100);
    }
  }

  // =========================
  // Custom scrollbar sync
  // =========================
  function updateScrollSliderFromColumns() {
  if (!linksColumns || !linksScrollSlider) return;

  const maxScroll = linksColumns.scrollWidth - linksColumns.clientWidth;
  const bar = document.getElementById("links_scrollbar");

  if (maxScroll <= 1) {
    linksScrollSlider.value = 0;
    linksScrollSlider.disabled = true;
    if (bar) bar.classList.remove("show");   // hide when not needed
    return;
  }

  linksScrollSlider.disabled = false;
  if (bar) bar.classList.add("show");        // show when needed

  const percent = (linksColumns.scrollLeft / maxScroll) * 100;
  linksScrollSlider.value = Math.round(percent);
}


  function updateColumnsFromScrollSlider() {
    if (!linksColumns || !linksScrollSlider) return;

    const maxScroll = linksColumns.scrollWidth - linksColumns.clientWidth;
    const percent = Number(linksScrollSlider.value) / 100;

    linksColumns.scrollLeft = maxScroll * percent;
  }

  function refreshLinkScrollbarSoon() {
    // When the panel opens, widths change after the CSS transition.
    // So we re-check a couple times.
    setTimeout(updateScrollSliderFromColumns, 50);
    setTimeout(updateScrollSliderFromColumns, 250);
    setTimeout(updateScrollSliderFromColumns, 450);
  }

  function toggleLinkPanel(force) {
    const nextOpen = force === undefined ? !linkOpen : force;

    linkBoxes.classList.toggle("open", nextOpen);
    linkPanel.classList.toggle("open", nextOpen);
    linkOpen = nextOpen;

    if (!linkOpen) {
      if (fadeTimeout) clearTimeout(fadeTimeout);
      linkBoxes.classList.remove("hovering", "fade-background");
      linkPanel.classList.remove("hovering", "fade-background");
      if (searchBar) searchBar.classList.remove("hovering", "fade-background");
    } else {
      linkBoxes.classList.remove("hovering", "fade-background");
      linkPanel.classList.remove("hovering", "fade-background");
      if (searchBar) searchBar.classList.remove("hovering", "fade-background");
    }

    // Sync music open state
    const musicPanel = document.getElementById("music_panel");
    if (musicButton && musicPanel) {
      musicButton.classList.toggle("open", linkOpen);
      musicPanel.classList.toggle("open", linkOpen);
      if (typeof isOpen !== "undefined") isOpen = linkOpen;
    }

    // Sync timer open state
    const secondBox = document.getElementById("second_box");
    if (secondBox) secondBox.classList.toggle("open", linkOpen);

    // Sync custom scrollbar after open/close
    if (linkOpen) refreshLinkScrollbarSoon();
  }

  // =========================
  // Event listeners
  // =========================

  // Toggle panel on click
  linkBoxes.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleLinkPanel();
  });

  // Click outside closes panel
  document.addEventListener("click", (e) => {
    if (!linkBoxes.contains(e.target) && !linkPanel.contains(e.target)) {
      toggleLinkPanel(false);
    }
  });

  // Prevent inside click closing
  linkPanel.addEventListener("click", (e) => e.stopPropagation());

  // Hover logic
  linkBoxes.addEventListener("mouseenter", () => setActiveState(true));
  linkBoxes.addEventListener("mouseleave", () => setActiveState(false));
  linkPanel.addEventListener("mouseenter", () => setActiveState(true));
  linkPanel.addEventListener("mouseleave", () => setActiveState(false));

  // Glowing lights
  function turnLinkLightsOn() {
    linkBoxes.classList.add("playing");
    linkIcon.classList.add("playing");
    if (musicButton) musicButton.classList.add("playing");
    if (searchBar) searchBar.classList.add("playing");
    linkIcon.src = "pictures/link_white.png";
  }

  function turnLinkLightsOff() {
    linkBoxes.classList.remove("playing");
    linkIcon.classList.remove("playing");
    if (musicButton) musicButton.classList.remove("playing");
    if (searchBar) searchBar.classList.remove("playing");
    linkIcon.src = "pictures/link_black.png";
  }

  if (audioPlayer) {
    audioPlayer.addEventListener("play", turnLinkLightsOn);
    audioPlayer.addEventListener("pause", turnLinkLightsOff);
    audioPlayer.addEventListener("ended", turnLinkLightsOff);
  }

  // Space toggles panel, but NOT while typing
  document.addEventListener("keydown", (e) => {
    if (e.code !== "Space") return;

    const el = document.activeElement;
    const typing =
      el &&
      (el.tagName === "INPUT" ||
        el.tagName === "TEXTAREA" ||
        el.isContentEditable);

    if (typing) return;

    e.preventDefault();
    toggleLinkPanel();
  });

  // =========================
  // Hook up custom scrollbar
  // =========================
  if (linksColumns && linksScrollSlider) {
    // Dragging the slider scrolls the columns
    linksScrollSlider.addEventListener("input", updateColumnsFromScrollSlider);

    // Scrolling/swiping the columns moves the slider
    linksColumns.addEventListener("scroll", updateScrollSliderFromColumns, { passive: true });

    // Recalc on resize
    window.addEventListener("resize", updateScrollSliderFromColumns);

    // Initial sync
    updateScrollSliderFromColumns();
  }
});
