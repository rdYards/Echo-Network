function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Error loading image: ${src}`));
        img.src = src;
    });
}

Vue.component('player-info', {
    props: ['player'],
    template: `
    <div v-if="player">
        <button type="button" class="collapsible" @click="toggleCollapsible()">
            {{ player.IC_Name }}, {{ player.IC_Nickname }} - ({{ player.OOC_Discord_Name }})
        </button>
        <div class="content">
            <img class="profile" :src="player.ImageLocation" :alt="player.IC_Name">
            <h2>General Info</h2>
            <ul class="list">
                <li>Titles: {{ player.Titles }}</li>
                <li>Age: {{ player.Age }}</li>
                <li>Date of Birth: {{ player.Date_of_Birth }}</li>
                <li>Gender: {{ player.Gender }}</li>
                <li>Race: {{ player.Race }}</li>
                <li>Profession(s): {{ player.Professions }}</li>
                <li>Allegiance: {{ player.Allegiance }}</li>
                <li>Residence: {{ player.Residence }}</li>
                <li>Status: {{ player.Status }}</li>
            </ul>
            <h2>Appearance</h2>
            <ul class="list">
                <li>Height: {{ player.Height }}</li>
                <li>Weight: {{ player.Weight }}</li>
                <li>Hair Color: {{ player.Hair_Color }}</li>
                <li>Eye Color: {{ player.Eye_Color }}</li>
                <li>Scars and Tattoos: {{ player.Scars_and_Tattoos }}</li>
                <li>Clothing: {{ player.Clothing }}</li>
                <li>Accessories: {{ player.Accessories }}</li>
                <li>Equipment: {{ player.Equipment }}</li>
            </ul>
            <h1>Detailed physical description</h1>
            <p>{{ player.Physical_Description }}</p>
            <h2>Bonds</h2>
            <ul class="list">
                <li>Religion: {{ player.Religion }}</li>
                <li>Nation: {{ player.Nation }}</li>
                <li>Organizations: {{ player.Organizations }}</li>
                <li>Marriage: {{ player.Marriage }}</li>
                <li>Friends: {{ player.Friends }}</li>
                <li>Enemies: {{ player.Enemies }}</li>
                <li>Pets: {{ player.Pets }}</li>
            </ul>
            <h2>Backstory</h2>
            <p>{{ player.Backstory }}</p>
        </div>
    </div>
    <div v-else>
        <!-- Render a loading message or handle the case when playerData is not yet available -->
        <p>Loading player data...</p>
    </div>`
});

const app = new Vue({
    el: '#app',
    data: {
        selectedNation: '', // Stores the currently selected nation
        nations: [],
        currentOuterPage: 'nationInfo',
        createNation: '',
        createPlayer: '',
        createShop: '',
        pages: ['History', 'Geography', 'Players', 'Economy'],
        currentPage: 'History', // To track the currently selected page
        htmlContent: '',
        geohtmlContent: '',
        allPlayers: [],
        filteredPlayers: [],
        shophtmlContent: '',
        referencedImages: [], // To store the referenced images
        showModal: false,
        availableFiles: [], // Store the list of available player files
        characterData: {
            IC_Name: '',
            IC_Nickname: '',
            OOC_Discord_Name: '',
            ImageLocation: null,
            Titles: '',
            Age: '',
            Date_of_Birth: '',
            Gender: '',
            Race: '',
            Professions: '',
            Allegiance: '',
            Residence: '',
            Status: '',
            Height: '',
            Weight: '',
            Hair_Color: '',
            Eye_Color: '',
            Scars_and_Tattoos: '',
            Clothing: '',
            Accessories: '',
            Equiptment: '',
            Physical_Description: '',
            Religion: '',
            Nation: '',
            Organizations: '',
            Marriage: '',
            Friends: '',
            Enemies: '',
            Pets: '',
            Backstory: '',
        },
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
        selectOuterPage(page) {
            // Update the current page
            this.currentOuterPage = page;
            switch (page) {
                case 'Home':
                    // Insert Work here
                    break;
                case 'CreateNation':
                    // Insert Work here
                    break;
                case 'CreatePlayer':
                    // Insert Work here
                    break;
                case 'CreateShop':
                    // Insert Work here
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
        fetchPlayerData(jsonFileName) {
            return fetch(`/Players/${jsonFileName}.json`)
                .then(response => response.json())
                .catch(error => {
                    console.error(`Error fetching player data (${jsonFileName}):`, error);
                    return {}; // Return an empty object in case of an error
                });
        },
        fetchPlayers() {
            // Fetch player data for each JSON file in allplayers
            const playerDataPromises = this.allplayers.map(player =>
            this.fetchPlayerData(player.IC_Name)
            );

            Promise.allSettled(playerDataPromises)
            .then(results => {
                // Filter out the successfully fetched player data
                const playerData = results
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value);

                // Update filteredPlayers with the fetched player data
                this.filteredPlayers = playerData;
            })
            .catch(error => {
                console.error('Error fetching players data:', error);
            });
        },
        fetchPlayersData() {
            fetch(`/api/get_all_players`)
                .then(response => response.json())
                .then(data => {
                    this.allplayers = data;
                    this.filteredPlayers = this.allPlayers;
                })
                .catch(error => {
                    console.error('Error fetching player data:', error);
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
        toggleCollapsible(event) {
            const collapsible = event.target;
            const content = collapsible.nextElementSibling;
            content.classList.toggle('active');
            content.style.maxHeight = content.classList.contains('active') ? content.scrollHeight + 'px' : 0;
        },
        clearCreatePlayerFormat(characterData) {
            characterData.IC_Name = '';
            characterData.IC_Nickname = '';
            characterData.OOC_Discord_Name = '';
            characterData.ImageLocation = null;
            characterData.ImageLocation = 'Players/images/';
            characterData.Titles = '';
            characterData.Age = '';
            characterData.Date_of_Birth = '';
            characterData.Gender = '';
            characterData.Race = '';
            characterData.Professions = '';
            characterData.Allegiance = '';
            characterData.Residence = '';
            characterData.Status = '';
            characterData.Height = '';
            characterData.Weight = '';
            characterData.Hair_Color = '';
            characterData.Eye_Color = '';
            characterData.Scars_and_Tattoos = '';
            characterData.Clothing = '';
            characterData.Accessories = '';
            characterData.Equiptment = '';
            characterData.Physical_Description = '';
            characterData.Religion = '';
            characterData.Nation = '';
            characterData.Organizations = '';
            characterData.Marriage = '';
            characterData.Friends = '';
            characterData.Enemies = '';
            characterData.Pets = '';
            characterData.Backstory = '';
        },
        // Method to hide the modal
        hideLoadPlayerModal() {
            this.showModal = false;
        },
        onFileSelected(event) {
            this.characterData.Image = event.target.files[0];
        },
        saveCreatePlayerData() {
            const fileName = this.characterData.IC_Name; // Remove '.json' extension from the filename
            const imageFile = this.$refs.imageInput.files[0];
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                formData.append('fileName', fileName); // Provide the desired filename for the image
        
                fetch('/api/save_image', {
                    method: 'POST',
                    body: formData,
                })
                .then(response => response.json())
                .then(imageData => {
                    console.log('Image saved successfully:', imageData);
        
                    // Update the characterData.ImageLocation with the saved image location
                    this.characterData.ImageLocation = '/Players/images/' + imageData.fileName;
                    fetch('/api/save_player_data', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            fileName: fileName + '.json', // Add back '.json' extension for saving the JSON file
                            characterData: this.characterData,
                        }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Character data saved successfully:', data);
                    })
                    .catch(error => {
                        console.error('Error while saving character data:', error);
                    });
                })
                .catch(error => {
                    console.error('Error while saving the image:', error);
                });
            } else {
                // If no image was selected, simply save the character data again without updating ImageLocation
                fetch('/api/save_player_data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fileName: fileName + '.json', // Add back '.json' extension for saving the JSON file
                        characterData: this.characterData,
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Character data saved successfully:', data);
                })
                .catch(error => {
                    console.error('Error while saving character data:', error);
                });
            }
        },
    },
    created() {
        this.fetchNations();
        this.fetchPlayersData();
    },
    mounted() {
        this.$el.addEventListener('click', event => {
            if (event.target.classList.contains('collapsible')) {
                this.toggleCollapsible(event);
            }
        });
    },
});