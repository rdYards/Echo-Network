const app = new Vue({
    el: '#app',
    data: {
        selectedNation: '', // Stores the currently selected nation
        nations: [], // Initialize with empty array to avoid the reactive property warning
        pages: ['History', 'Geography', 'Players', 'Economy'],
        currentPage: 'History', // To track the currently selected page
        htmlContent: '', // To store the history HTML content
        referencedImages: [], // To store the referenced images
    },
    methods: {
        // Method to fetch the list of nations from the server
        fetchNations() {
            fetch('/get_nations')
                .then(response => response.json())
                .then(data => {
                    this.nations = data; // Update the nations array with the fetched data
                    console.log(this.nations);

                    // Default to opening the first nation
                    if (this.nations.length > 0) {
                        this.selectedNation = this.nations[0];
                        this.fetchHistory(this.selectedNation); // Fetch history data for the selected nation
                    }
                })
                .catch(error => {
                    console.error('Error fetching nations:', error);
                });
        },
        selectNation(nationName) {
            this.selectedNation = nationName;
            this.currentPage = 'History'; // Reset to the History page when a new nation is selected
            this.fetchHistory(nationName); // Fetch history data for the selected nation
        },
        selectPage(page) {
            this.currentPage = page;
        },
        // Method to fetch history data for the selected nation from the server
        fetchHistory(nationName) {
            fetch(`/history/${nationName}`)
                .then(response => response.json())
                .then(data => {
                    // Update data properties with fetched data
                    this.htmlContent = data.html_content;
                    this.referencedImages = data.referenced_images;
                })
                .catch(error => {
                    console.error(`Error fetching history for ${nationName}:`, error);
                });
        },
        // Method to load and display the Nation_Flag image
        updateTitleSection(nationName) {
            this.selectedNation = nationName;

            const imageSrc = `/Nations/${nationName}/Nation_Flag.png`;
            loadImage(imageSrc)
            .then(() => {
                // The rest of the image loading logic
                // Get the element that will hold the image
                const titleSection = document.getElementById('selected_nation_img');
                if (titleSection) {
                    // Clear any existing image
                    titleSection.innerHTML = '';

                    // Create an img element
                    const imgElement = document.createElement('img');
                    imgElement.src = imageSrc;
                    imgElement.alt = 'Nation Flag';

                    // Append the img element to the title section
                    titleSection.appendChild(imgElement);
                }
            })
            .catch(error => {
                console.error(`Error loading Nation_Flag for ${nationName}:`, error);
            });
        },
    },
    created() {
        // Fetch the list of nations when the app is created
        this.fetchNations();
    },
});