

document.addEventListener("DOMContentLoaded", function () {

    const themeButtons =
        document.querySelectorAll(".theme-toggle");

    const savedTheme =
        localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    updateThemeButtons();


    
    themeButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            document.body.classList.toggle("dark-mode");

            const isDark =
                document.body.classList.contains("dark-mode");

            localStorage.setItem(
                "theme",
                isDark ? "dark" : "light"
            );

            updateThemeButtons();

        });

    });


    function updateThemeButtons() {

        const isDark =
            document.body.classList.contains("dark-mode");

        themeButtons.forEach(function (button) {

            button.textContent =
                isDark ? "☀️" : "🌙";

            button.setAttribute(
                "aria-label",
                isDark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );

        });

    }

});