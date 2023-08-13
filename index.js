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
    data() {
        return {
            isCollapsibleOpen: false
        };
    },
    methods: {
        toggleCollapsible() {
            this.isCollapsibleOpen = !this.isCollapsibleOpen;
        }
    },
    template: `
    <div v-if="player">
    <div class="creation">
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
    </div>
    <div v-else>
        <!-- Render a loading message or handle the case when playerData is not yet available -->
        <p>Loading player data...</p>
    </div>`
});
Vue.component('shop-info', {
    props: ['shop'],
    data() {
        return {
            isCollapsibleOpen: false
        };
    },
    methods: {
        toggleCollapsible() {
            this.isCollapsibleOpen = !this.isCollapsibleOpen;
        }
    },
    template: `
    <div v-if="shop">
    <div class="creation">
        <button type="button" class="collapsible" @click="toggleCollapsible">{{ shop.Name }}</button>
        <div class="content" v-show="isCollapsibleOpen">
            <img class="profile" :src="shop.ImageLocation" alt="Shop Image">
            <ul class="list">
                <li>Location(s): {{ shop.Locations }}</li>
                <li>Offers: {{ shop.Offers }}</li>
                <li>Accepts: {{ shop.Accepts }}</li>
            </ul>
            <h2>Inventory</h2>
            <ul class="list">
                <li v-for="item in shop.Inventory" :key="item">{{ item }}</li>
            </ul>
        </div>
    </div>
    </div>
    <div v-else>
        <!-- Render a loading message or handle the case when shopData is not yet available -->
        <p>Loading shop data...</p>
    </div>
    `
});


const app = new Vue({
    el: '#app',
    data: {
        // Pop-up and checkbox states
        showPopUp: false,
        isChecked: false,

        // Nation selection
        selectedNation: '',
        nations: [],

        // Navigation and page tracking
        currentOuterPage: 'nationInfo',
        pages: ['History', 'Geography', 'Players', 'Economy'],
        currentPage: 'History',

        // HTML content for various sections
        history_htmlContent: '',
        geography_htmlContent: '',
        shophtmlContent: '',

        // Player and member data
        allPlayers: [],
        filteredPlayers: [],
        members: [],

        // Shop and economy data
        allShops: [],
        filteredShops: [],
        economy: [],

        // Modal visibility
        showModal: false,

        // Character data
        characterData: {
            IC_Name: '',
            IC_Nickname: '',
            OOC_Discord_Name: '',
            Nomad: false,
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
            Backstory: ''
        },

        // Shop data
        shopData: {
            Name: '',
            Nomad: false,
            ImageLocation: null,
            Offers: '',
            Accepts: '',
            Locations: '',
            Inventory: ''
        }
    },
    methods: {
        // Section: Page Changer
        // Function to select and display a specific page within the current view
        selectPage(page) {
            this.currentPage = page;

            // Depending on the selected page, fetch and display relevant data
            switch (page) {
                case 'History':
                    this.fetchHistory(this.selectedNation);
                    break;
                case 'Geography':
                    this.fetchGeography(this.selectedNation);
                    break;
                case 'Players':
                    this.fetchFilteredPlayers(this.selectedNation);
                    break;
                case 'Economy':
                    this.fetchFilteredShops(this.selectedNation);
                    break;
            }
        },
        // Function to select and display a specific outer page within the current view
        selectOuterPage(page) {
            this.currentOuterPage = page;
        },
        // Function to select a nation and update displayed content accordingly
        selectNation(nationName) {
            this.selectedNation = nationName;
            this.currentPage = 'History'; // Set default page to 
            this.fetchHistory(nationName); // Fetch and display historical data for the selected nation
        },

        // Section: Data Fetching Functions
        // Function to fetch the list of nations from the server
        fetchNations() {
            fetch('/get_nations')
            .then(response => response.json())
            .then(data => {
                this.nations = data;

                // Default to opening the first nation
                if (this.nations.length > 0) {
                    this.selectedNation = this.nations[0];
                    this.fetchHistory(this.selectedNation);
                }
            })
            .catch(error => {
                console.error('Error fetching nations:', error);
            });
        },
        // Function to fetch historical data for the selected nation from the server
        fetchHistory(nationName) {
            fetch(`/history/${nationName}`)
            .then(response => response.json())
            .then(data => {
                if (data.html_content) {
                    this.history_htmlContent = data.html_content;
                } else {
                    this.history_htmlContent = '';
                }
            })
            .catch(error => {
                console.error(`Error fetching history for ${nationName}:`, error);
            });
        },
        // Function to fetch geographical data for the selected nation from the server
        fetchGeography(nationName) {
            fetch(`/geography/${nationName}`)
            .then(response => response.json())
            .then(data => {
                if (data.geohtml_content) {
                    this.geography_htmlContent = data.geohtml_content;
                } else {
                    this.geography_htmlContent = '';
                }
            })
            .catch(error => {
                console.error(`Error fetching geography for ${nationName}:`, error);
            });
        },

        // Section: UI Updates
        // Function to update the title section with the selected nation's flag image
        updateTitleSection(nationName) {
            // Set the selected nation and image source
            this.selectedNation = nationName;
            const imageSrc = `/Nations/${nationName}/Nation_Flag.png`;

            // Load the image
            loadImage(imageSrc)
            .then(() => {
                const titleSection = document.getElementById('selected_nation_img');
                if (titleSection) {
                    // Clear any existing content
                    titleSection.innerHTML = '';

                    const imgElement = document.createElement('img');
                    imgElement.src = imageSrc;
                    imgElement.alt = 'Nation Flag';

                    titleSection.appendChild(imgElement);
                }
            })
            .catch(error => {
                console.error(`Error loading Nation_Flag for ${nationName}:`, error);
            });
        },
        // Function to toggle collapsible content
        toggleCollapsible(event) {
            const collapsible = event.target;
            const content = collapsible.nextElementSibling;
            content.classList.toggle('active');
            content.style.maxHeight = content.classList.contains('active') ? content.scrollHeight + 'px' : 0;
        },
        
        // Section: Data Fetching - Player Information
        // Function to fetch all player data from the server
        fetchPlayersData() {
            fetch(`/api/get_all_players`)
            .then(response => response.json())
            .then(data => {
                this.allPlayers = data; // Update allPlayers with fetched data
            })
            .catch(error => {
                console.error('Error fetching player data:', error);
            });
        },
        // Function to fetch filtered player data for the selected nation from the server
        fetchFilteredPlayers(nationName) {
            fetch(`/get_players/${nationName}`)
            .then(response => response.json())
            .then(data => {
                this.members = data.html_files; // Update members list with player data
                this.filteredPlayers = this.allPlayers.filter(player =>
                    this.members.includes(player.IC_Name) // Filter and update filteredPlayers
                );
            })
            .catch(error => {
                console.error(`Error fetching players for ${nationName}:`, error);
            });
        },

        // Section: Data Fetching - Shop Information
        // Function to fetch all shop data from the server
        fetchShopsData() {
            fetch(`/api/get_all_shops`)
            .then(response => response.json())
            .then(data => {
                this.allShops = data; // Update allShops with fetched data
            })
            .catch(error => {
                console.error('Error fetching shop data:', error);
            });
        },
        // Function to fetch filtered shop data for the selected nation from the server
        fetchFilteredShops(nationName) {
            fetch(`/get_shops/${nationName}`)
            .then(response => response.json())
            .then(data => {
                this.shopMembers = data.html_files; // Update shopMembers list with shop data
                this.filteredShops = this.allShops.filter(shop =>
                    this.shopMembers.includes(shop.Name) // Filter and update filteredShops
                );
            })
            .catch(error => {
                console.error(`Error fetching shops for ${nationName}:`, error);
            });
        },

        // Section: UI Interaction - Pop-up and Data Loading
        // Function to open the pop-up
        openPopUp() {
            this.showPopUp = true;
        },
        // Function to close the pop-up
        closePopUp() {
            this.showPopUp = false;
        },
        // Function to load character data for display in the pop-up
        loadCharacterData(player) {
            this.characterData = {
                IC_Name: player.IC_Name,
                IC_Nickname: player.IC_Nickname,
                OOC_Discord_Name: player.OOC_Discord_Name,
                Nomad: player.Nomad,
                ImageLocation: player.ImageLocation,
                Titles: player.Titles,
                Age: player.Age,
                Date_of_Birth: player.Date_of_Birth,
                Gender: player.Gender,
                Race: player.Race,
                Professions: player.Professions,
                Allegiance: player.Allegiance,
                Residence: player.Residence,
                Status: player.Status,
                Height: player.Height,
                Weight: player.Weight,
                Hair_Color: player.Hair_Color,
                Eye_Color: player.Eye_Color,
                Scars_and_Tattoos: player.Scars_and_Tattoos,
                Clothing: player.Clothing,
                Accessories: player.Accessories,
                Equiptment: player.Equiptment,
                Physical_Description: player.Physical_Description,
                Religion: player.Religion,
                Nation: player.Nation,
                Organizations: player.Organizations,
                Marriage: player.Marriage,
                Friends: player.Friends,
                Enemies: player.Enemies,
                Pets: player.Pets,
                Backstory: player.Backstory
            };
            this.closePopUp();
        },
        // Function to load shop data for display in the pop-up
        loadShopData(shop) {
            this.shopData = {
                Name: shop.Name,
                Nomad: shop.Nomad,
                ImageLocation: shop.ImageLocation,
                Offers: shop.Offers,
                Accepts: shop.Accepts,
                Locations: shop.Locations,
                Inventory: shop.Inventory
            };
            this.closePopUp();
        },

        // Section: Data Formatting - Clear Create Player and Shop Format
        // Function to clear the format for creating a new player
        clearCreatePlayerFormat(characterData) {
            characterData.IC_Name = '';
            characterData.IC_Nickname = '';
            characterData.OOC_Discord_Name = '';
            characterData.Nomad = false,
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
        // Function to clear the format for creating a new shop
        clearCreateShopFormat(shopData) {
            shopData.Name = '',
            shopData.Nomad = false,
            shopData.ImageLocation = null,
            shopData.Offers = '',
            shopData.Accepts = '',
            shopData.Locations = '',
            shopData.Inventory = ''
        },

        // Section: UI Interaction - Modal and Checkbox Handling
        // Method to hide the modal
        hideLoadPlayerModal() {
            this.showModal = false;
        },
        // Function to handle file selection for character image
        onFileSelected(event) {
            this.characterData.Image = event.target.files[0];
        },
        // Function to handle changes in the Nomad checkbox for player data
        handlePlayerCheckboxChange(characterData) {
            if (characterData.Nomad) {
                characterData.Nomad = true;
                this.isChecked = true;
            } else {
                characterData.Nomad = false;
                this.isChecked = false;
            }
            console.log(characterData.Nomad);
        },
        
        // Section: Data Saving - Create Player and Shop Data
        // Function to save newly created player data
        saveCreatePlayerData() {
            const fileName = this.characterData.IC_Name;
            const imageFile = this.$refs.imageInput.files[0];

            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                formData.append('fileName', fileName);

                // Save the selected image for the player
                fetch('/api/save_image/player', {
                    method: 'POST',
                    body: formData,
                })
                .then(response => response.json())
                .then(imageData => {
                    console.log('Image saved successfully:', imageData);

                    // Update the characterData.ImageLocation with the saved image location
                    this.characterData.ImageLocation = '/Players/images/' + imageData.fileName;

                    // Proceed to save the player data
                    this.savePlayerData(fileName);
                })
                .catch(error => {
                    console.error('Error while saving the image:', error);
                });
            } else {
                // If no image was selected, proceed to save the player data without updating ImageLocation
                this.savePlayerData(fileName);
            }
        },
        // Function to save player data
        savePlayerData(fileName) {
            // Send a POST request to save the player data on the server
            fetch('/api/save_player_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName: fileName + '.json',
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
        },
        
        // Function to save newly created shop data
        saveCreateShopData() {
            const fileName = this.shopData.Name.replace(/\s+/g, '_');
            const imageFile = this.$refs.imageInput.files[0];

            // Split Inventory string into an array by commas and trim whitespace
            const inventoryArray = this.shopData.Inventory.split(',').map(item => item.trim());
            this.shopData.Inventory = inventoryArray;

            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                formData.append('fileName', fileName);

                // Save the selected image for the shop
                fetch('/api/save_image/shop', {
                    method: 'POST',
                    body: formData,
                })
                .then(response => response.json())
                .then(imageData => {
                    console.log('Image saved successfully:', imageData);

                    // Update the shopData.ImageLocation with the saved image location
                    this.shopData.ImageLocation = '/Shops/images/' + imageData.fileName;

                    // Proceed to save the shop data
                    this.saveShopData(fileName);
                })
                .catch(error => {
                    console.error('Error while saving the image:', error);
                });
            } else {
                // If no image was selected, proceed to save the shop data without updating ImageLocation
                this.saveShopData(fileName);
            }
        },
        // Function to save shop data
        saveShopData(fileName) {
            // Send a POST request to save the shop data on the server
            fetch('/api/save_shop_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName: fileName + '.json',
                    shopData: this.shopData,
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Shop data saved successfully:', data);
            })
            .catch(error => {
                console.error('Error while saving shop data:', error);
            });
        },
    },
    created() {
        this.fetchNations(); // Fetch list of nations from the server
        this.fetchPlayersData(); // Fetch player data from the server
        this.fetchShopsData() // Fetch shop data from the server
    },
    mounted() {
        this.$el.addEventListener('click', event => {
            if (event.target.classList.contains('collapsible')) {
                this.toggleCollapsible(event);
            }
        });
    },
});