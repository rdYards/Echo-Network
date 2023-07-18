document.addEventListener("DOMContentLoaded", function() {
    // Get references to the buttons and sections
    const historyBtn = document.querySelector(".pagebtn:nth-child(1)");
    const geographyBtn = document.querySelector(".pagebtn:nth-child(2)");
    const playersBtn = document.querySelector(".pagebtn:nth-child(3)");
    const economyBtn = document.querySelector(".pagebtn:nth-child(4)");

    const historySection = document.getElementById("history");
    const geographySection = document.getElementById("geography");
    const playersSection = document.getElementById("players");
    const economySection = document.getElementById("economy");

    // Function to hide all sections
    function hideAllSections() {
        historySection.style.display = "none";
        geographySection.style.display = "none";
        playersSection.style.display = "none";
        economySection.style.display = "none";
    }

    // Function to show the selected section
    function showSection(section, btn) {
        hideAllSections();
        section.style.display = "block";

        // Add .activebtn class to the clicked button and remove from others
        const buttons = document.querySelectorAll(".pagebtn");
        buttons.forEach((button) => button.classList.remove("activebtn"));
        btn.classList.add("activebtn");
    }

    // Event listeners for button clicks
    historyBtn.addEventListener("click", function () {
        showSection(historySection, historyBtn);
    });

    geographyBtn.addEventListener("click", function () {
        showSection(geographySection, geographyBtn);
    });

    playersBtn.addEventListener("click", function () {
        showSection(playersSection, playersBtn);
    });

    economyBtn.addEventListener("click", function () {
        showSection(economySection, economyBtn);
    });
    

    var coll = document.getElementsByClassName("collapsible");
    var i;
    
    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
        
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }
});