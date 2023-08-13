from flask import Flask, render_template, send_from_directory, jsonify, url_for, request
import os
import json

app = Flask(__name__)

# Function to retrieve a list of available nations
def get_nations_list():
    nations_directory = './Nations/'
    nations = []

    # Iterate through directories to find available nations
    if os.path.exists(nations_directory) and os.path.isdir(nations_directory):
        for folder_name in os.listdir(nations_directory):
            if os.path.isdir(os.path.join(nations_directory, folder_name)):
                nations.append(folder_name)
    return nations

# Serve the Vue.js app
@app.route('/')
def serve_vue_app():
    return send_from_directory('', 'vue_app.html')

# Serve JavaScript and CSS files
@app.route('/vue.js')
def serve_vue():
    return send_from_directory('', 'vue.js')

@app.route('/index.js')
def serve_js():
    return send_from_directory('', 'index.js')

@app.route('/style.css')
def serve_css():
    return send_from_directory('', 'style.css')

# Serve API endpoint to get available player files
@app.route('/api/get_available_files', methods=['GET'])
def get_available_files():
    players_directory = 'Players'
    available_files = [f for f in os.listdir(players_directory) if f.endswith('.html')]
    return jsonify(files=available_files)

# Serve the LoreWorks map image
@app.route('/LoreWorks_Map.png')
def serve_map():
    return send_from_directory('', 'LoreWorks_Map.png')

# Serve Fonts and Icons
@app.route('/Fonts/<filename>')
def serve_fonts(filename):
    return send_from_directory('Fonts', filename)

@app.route('/Icons/<string:image_name>')
def serve_icon(image_name):
    return send_from_directory('Icons', image_name)

# Serve images for nations
@app.route('/Nations/<string:nation_name>/images/<string:image_name>')
def serve_image(nation_name, image_name):
    image_folder = os.path.join('Nations', nation_name, 'images')
    return send_from_directory(image_folder, image_name)

# Endpoint to fetch a list of available nations
@app.route('/get_nations')
def get_nations():
    nations_list = get_nations_list()
    return jsonify(nations_list)

# Serve the Nation_Flag.png image for a nation
@app.route('/Nations/<nation_name>/Nation_Flag.png')
def serve_nation_flag(nation_name):
    return send_from_directory('Nations/' + nation_name, 'Nation_Flag.png')

# Endpoint to fetch history HTML data for a nation
@app.route('/history/<nation_name>')
def serve_history(nation_name):
    try:
        with open('Nations/' + nation_name + '/history.html', 'r') as file:
            html_content = file.read()
        return jsonify({'nation_name': nation_name, 'html_content': html_content})
    except FileNotFoundError:
        return jsonify({'error': 'Nation not found'})

# Endpoint to fetch geography HTML data for a nation
@app.route('/geography/<nation_name>')
def serve_geography(nation_name):
    try:
        with open('Nations/' + nation_name + '/geography.html', 'r') as file:
            geohtml_content = file.read()
        return jsonify({'nation_name': nation_name, 'geohtml_content': geohtml_content})
    except FileNotFoundError:
        return jsonify({'error': 'Nation not found'})

# Section: Player Data
# Endpoint to fetch player data for a specific nation
@app.route('/get_players/<string:nation_name>')
def get_players(nation_name):
    members_json_path = os.path.join('Nations', nation_name, 'members.json')
    
    with open(members_json_path, 'r') as file:
        data = json.load(file)
    
    return jsonify(data)

# Serve player HTML data
@app.route('/Players/<json_file_name>')
def serve_player_html(json_file_name):
    return send_from_directory('Players', json_file_name)

# Serve player images
@app.route('/Players/images/<path:image_name>')
def serve_player_image(image_name):
    return send_from_directory('Players/images', image_name)

# Function to retrieve data for all players
def get_all_player_data():
    players_data = []

    players_dir = 'Players'
    for filename in os.listdir(players_dir):
        if filename.endswith('.json'):
            json_path = os.path.join(players_dir, filename)
            with open(json_path, 'r') as file:
                player_data = json.load(file)
                players_data.append(player_data)
                
    return players_data

# Endpoint to fetch all player data
@app.route('/api/get_all_players')
def get_all_players():
    players_data = get_all_player_data()
    return jsonify(players_data)

# Function to save an uploaded player image
def save_image_player(file, file_name):
    if file:
        image_dir = 'Players/images'
        if not os.path.exists(image_dir):
            os.makedirs(image_dir)

        _, ext = os.path.splitext(file.filename)
        file_name = f'{file_name}{ext}'
        image_path = os.path.join(image_dir, file_name)
        file.save(image_path)
        return {'fileName': file_name}
    return {'fileName': None}

# Endpoint to save an uploaded player image
@app.route('/api/save_image/player', methods=['POST'])
def save_image_player_endpoint():
    file = request.files['image']
    file_name = request.form['fileName']
    response_data = save_image_player(file, file_name)
    return response_data

# Endpoint to save player data as JSON
@app.route('/api/save_player_data', methods=['POST'])
def save_player_data_endpoint():
    try:
        data = request.get_json()
        file_name = data['fileName']
        player_data = data['characterData']
    except KeyError as e:
        return {'error': f'Missing key: {e}'}, 400

    # Save the player data as JSON
    json_dir = 'Players'
    if not os.path.exists(json_dir):
        os.makedirs(json_dir)

    json_path = os.path.join(json_dir, file_name)
    with open(json_path, 'w') as file:
        file.write(json.dumps(player_data, indent=2))

    # Append player data to Nomad nation members.json if Nomad is true
    if player_data.get('Nomad', False):
        members_json_path = os.path.join('Nations/Nomads', 'members.json')
        with open(members_json_path, 'r') as members_file:
            members_data = json.load(members_file)
        
        if 'html_files' not in members_data:
            members_data['html_files'] = []

        members_data['html_files'].append(player_data['IC_Name'])

        with open(members_json_path, 'w') as members_file:
            members_file.write(json.dumps(members_data, indent=2))

    return {'fileName': file_name}

# Section: Shop Data
# Endpoint to fetch shop data for a specific nation
@app.route('/get_shops/<string:nation_name>')
def get_shops(nation_name):
    shops_json_path = os.path.join('Nations', nation_name, 'economy.json')
    
    with open(shops_json_path, 'r') as file:
        data = json.load(file)
    
    return jsonify(data)

# Function to retrieve data for all shops
def get_all_shop_data():
    shops_data = []

    shops_dir = 'Shops'
    for filename in os.listdir(shops_dir):
        if filename.endswith('.json'):
            json_path = os.path.join(shops_dir, filename)
            with open(json_path, 'r') as file:
                shop_data = json.load(file)
                shops_data.append(shop_data)
                
    return shops_data

# Endpoint to fetch all shop data
@app.route('/api/get_all_shops')
def get_all_shops():
    shops_data = get_all_shop_data()
    return jsonify(shops_data)

# Serve shop HTML data
@app.route('/Shops/<json_shop_name>')
def serve_shop_html(json_shop_name):
    return send_from_directory('Shops', json_shop_name)

# Serve shop images
@app.route('/Shops/images/<path:image_name>')
def serve_shop_image(image_name):
    return send_from_directory('Shops/images', image_name)

# Function to save an uploaded shop image
def save_image_shop(file, file_name):
    if file:
        image_dir = 'Shops/images'
        if not os.path.exists(image_dir):
            os.makedirs(image_dir)

        _, ext = os.path.splitext(file.filename)
        file_name = f'{file_name}{ext}'
        image_path = os.path.join(image_dir, file_name)
        file.save(image_path)
        return {'fileName': file_name}
    return {'fileName': None}

# Endpoint to save an uploaded shop image
@app.route('/api/save_image/shop', methods=['POST'])
def save_image_shop_endpoint():
    file = request.files['image']
    file_name = request.form['fileName']
    response_data = save_image_shop(file, file_name)
    return response_data

# Endpoint to save shop data as JSON
@app.route('/api/save_shop_data', methods=['POST'])
def save_shop_data_endpoint():
    data = request.get_json()
    file_name = data['fileName']
    shop_data = data['shopData']

    json_dir = 'Shops'
    if not os.path.exists(json_dir):
        os.makedirs(json_dir)

    json_path = os.path.join(json_dir, file_name)
    with open(json_path, 'w') as file:
        file.write(json.dumps(shop_data, indent=2))

    # Append shop data to economy.json if Nomad is true
    if shop_data.get('Nomad', False):
        economy_json_path = 'economy.json'
        with open(economy_json_path, 'a') as economy_file:
            economy_file.write(json.dumps(shop_data) + '\n')

    return {'fileName': file_name}

# Start the Flask application if this script is run directly
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)