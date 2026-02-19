document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("search_input");
    const columnA = document.querySelectorAll(".column a");

    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (searchTerm === "") {
            columnA.forEach(link => {
                link.classList.remove("match");
                link.classList.remove("dim");
                link.style.display = "flex";
            });
            return;
        }

        columnA.forEach(link => {

            const linkText = link.textContent.toLowerCase();

            if (linkText.includes(searchTerm)) {
                link.classList.add("match");
                link.classList.remove("dim");
            } else {
                link.classList.add("dim");
                link.classList.remove("match");

            }
        });
    });

    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const searchTerm = searchInput.value.trim().toLowerCase();

            columnA.forEach(link => {
                const linkText = link.textContent.toLowerCase();

                if (linkText.includes(searchTerm)) {
                    link.style.display = "flex";
                } else {
                    link.style.display = "none";
                }
            });
        }
    });
});