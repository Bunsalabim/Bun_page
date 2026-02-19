document.addEventListener("DOMContentLoaded", () => {
    const linkBoxes = document.getElementById("link_boxes");
    const linkPanel = document.getElementById("link_panel");
    const linkIcon = document.getElementById("link_icon");
    const audioPlayer = document.getElementById("audio_player"); // optional
    const musicButton = document.getElementById("music_button");
    const searchBar = document.getElementById("search_bar");

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

        // Sync music
        const musicPanel = document.getElementById("music_panel");
        if (musicButton && musicPanel) {
            musicButton.classList.toggle("open", linkOpen);
            musicPanel.classList.toggle("open", linkOpen);
            if (typeof isOpen !== "undefined") isOpen = linkOpen;
        }

        // Sync timer
        const secondBox = document.getElementById("second_box");
        if (secondBox) {
            secondBox.classList.toggle("open", linkOpen);
        }
    }

    // --- Event listeners (must be OUTSIDE toggleLinkPanel) ---

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

    // prevent inside click closing
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
});
