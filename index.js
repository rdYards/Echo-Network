function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Error loading image: ${src}`));
        img.src = src;
    });
}

const app = new Vue({
    el: '#app',
    data: {
        selectedNation: '', // Stores the currently selected nation
        nations: [], // Initialize with empty array to avoid the reactive property warning
        pages: ['History', 'Geography', 'Players', 'Economy'],
        currentPage: 'History', // To track the currently selected page
        htmlContent: '', // To store the history HTML content
        geohtmlContent: '', // To store the history HTML content
        playersData: null, // Store the players data fetched from the server
        playerhtmlContent: '', // To store the HTML content for each player
        shophtmlContent: '', // To store the fetched HTML content for each shop
        referencedImages: [], // To store the referenced images
    },
    methods: {
        // Method to fetch the list of nations from the server
        fetchNations() {
            fetch('/get_nations')
                .then(response => response.json())
                .then(data => {
                    this.nations = data; // Update the nations array with the fetched data
                    // console.log(this.nations);

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
            // Update the current page
            this.currentPage = page;
            switch (page) {
                case 'History':
                    this.fetchHistory(this.selectedNation);
                    break;
                case 'Geography':
                    this.fetchGeography(this.selectedNation);
                    break;
                case 'Players':
                    this.fetchPlayers(this.selectedNation);
                    break;
                case 'Economy':
                    this.fetchShop(this.selectedNation);
                    break;
            }
        },
        // Method to fetch history data for the selected nation from the server
        fetchHistory(nationName) {
            fetch(`/history/${nationName}`)
                .then(response => response.json())
                .then(data => {
                    if (data.html_content) {
                    this.htmlContent = data.html_content;
                    } else {
                    this.htmlContent = '';
                    }
                })
                .catch(error => {
                    console.error(`Error fetching history for ${nationName}:`, error);
                });
        },
        // Method to fetch history data for the selected nation from the server
        fetchGeography(nationName) {
            fetch(`/geography/${nationName}`)
                .then(response => response.json())
                .then(data => {
                    if (data.geohtml_content) {
                    this.geohtmlContent = data.geohtml_content;
                    } else {
                    this.geohtmlContent = '';
                    }
                })
                .catch(error => {
                    console.error(`Error fetching geography for ${nationName}:`, error);
                });
        },
        fetchPlayers(nationName) {
            fetch(`/get_players/${nationName}`)
                .then(response => response.json())
                .then(data => {
                    if (data.html_files && Array.isArray(data.html_files)) {
                        const htmlFileNames = data.html_files;
        
                        // Fetch and load the HTML content for each player
                        const playerHTMLPromises = htmlFileNames.map(htmlFileName =>
                            this.fetchPlayerHTML(htmlFileName)
                        );
        
                        Promise.allSettled(playerHTMLPromises)
                            .then(results => {
                                // Filter out the successfully fetched HTML content
                                const playerHTMLContents = results
                                    .filter(result => result.status === 'fulfilled')
                                    .map(result => result.value);
        
                                // Join the player HTML contents to form the final content
                                this.playerhtmlContent = playerHTMLContents.join('');
                            })
                            .catch(error => {
                                console.error('Error fetching players HTML:', error);
                            });
                    }
                })
                .catch(error => {
                    console.error(`Error fetching players for ${nationName}:`, error);
                });
        },
        fetchPlayerHTML(htmlFileName) {
            return fetch(`/Players/${htmlFileName}.html`)
                .then(response => response.text())
                .catch(error => {
                    console.error(`Error fetching HTML for ${htmlFileName}:`, error);
                    return '';
                });
        },
        fetchShop(nationName) {
            fetch(`/get_shop/${nationName}`)
                .then(response => response.json())
                .then(data => {
                    if (data.html_files && Array.isArray(data.html_files)) {
                        const htmlFileNames = data.html_files;

                        // Fetch and load the HTML content for each player
                        const shopHTMLPromises = htmlFileNames.map(htmlFileName =>
                            this.fetchShopHTML(htmlFileName) // Use the fetchShopHTML function
                        );

                        Promise.allSettled(shopHTMLPromises)
                            .then(results => {
                                // Filter out the successfully fetched HTML content
                                const shopHTMLContents = results
                                    .filter(result => result.status === 'fulfilled')
                                    .map(result => result.value);

                                // Join the shop HTML contents to form the final content
                                this.shophtmlContent = shopHTMLContents.join(''); // Update the variable name to shophtmlContent
                            })
                            .catch(error => {
                                console.error('Error fetching shop HTML:', error);
                            });
                    }
                })
                .catch(error => {
                    console.error(`Error fetching shop data for ${nationName}:`, error);
                });
        },
        fetchShopHTML(htmlFileName) {
            return fetch(`/Shops/${htmlFileName}.html`)
                .then(response => response.text())
                .catch(error => {
                    console.error(`Error fetching HTML for ${htmlFileName}:`, error);
                    return '';
                });
        },
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
        toggleCollapsible(event) {
            const collapsible = event.target;
            const content = collapsible.nextElementSibling;
            content.classList.toggle('active');
            content.style.maxHeight = content.classList.contains('active') ? content.scrollHeight + 'px' : 0;
        },
    },
    created() {
        // Fetch the list of nations when the app is created
        this.fetchNations();
    },
    mounted() {
        // Use event delegation to handle dynamically inserted elements
        this.$el.addEventListener('click', event => {
            if (event.target.classList.contains('collapsible')) {
                this.toggleCollapsible(event);
            }
        });
    },
});