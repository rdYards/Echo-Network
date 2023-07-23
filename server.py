import os
from flask import Flask, render_template, send_from_directory, jsonify, url_for
import json

app = Flask(__name__)

# Serve Nations
def get_nations_list():
    nations_directory = './Nations/'
    nations = []

    if os.path.exists(nations_directory) and os.path.isdir(nations_directory):
        for folder_name in os.listdir(nations_directory):
            if os.path.isdir(os.path.join(nations_directory, folder_name)):
                nations.append(folder_name)
    # print(nations)
    return nations

# Serve the Vue.js app
@app.route('/')
def serve_vue_app():
    # Get a list of all HTML files in the directory
    html_file_name = [os.path.splitext(f)[0] for f in os.listdir('Players') if f.endswith('.html')]
    return send_from_directory('', 'vue_app.html')

# Serve the JavaScript files
@app.route('/vue.js')
def serve_vue():
    return send_from_directory('', 'vue.js')

@app.route('/index.js')
def serve_js():
    return send_from_directory('', 'index.js')

# Serve the CSS files
@app.route('/style.css')
def serve_css():
    return send_from_directory('', 'style.css')

# Serve Map
@app.route('/LoreWorks_Map.png')
def serve_map():
    return send_from_directory('', 'LoreWorks_Map.png')

@app.route('/Backgrounds/Blackstone_Background.jpg')
def serve_background1():
    return send_from_directory('Backgrounds', 'Blackstone_Background.jpg')
@app.route('/Backgrounds/Obsidian_Background.jpg')
def serve_background2():
    return send_from_directory('Backgrounds', 'Obsidian_Background.jpg')
@app.route('/Backgrounds/Spruce_Background.jpg')
def serve_background3():
    return send_from_directory('Backgrounds', 'Spruce_Background.jpg')
@app.route('/Backgrounds/Stone_Background.jpg')
def serve_background4():
    return send_from_directory('Backgrounds', 'Stone_Background.jpg')

# Serve Fonts
@app.route('/Fonts/RingbearerMedium-51mgZ.ttf')
def serve_font():
    return send_from_directory('Fonts', 'RingbearerMedium-51mgZ.ttf')

@app.route('/Nations/<string:nation_name>/images/<string:image_name>')
def serve_image(nation_name, image_name):
    image_folder = os.path.join('Nations', nation_name, 'images')
    return send_from_directory(image_folder, image_name)

@app.route('/get_players/<nation_name>')
def get_players(nation_name):
    # Load the 'members.json' file for the specified nation
    try:
        with open(f'Nations/{nation_name}/members.json', 'r') as file:
            data = json.load(file)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({'error': 'Nation not found'})

# Endpoint to serve each shops's HTML file
@app.route('/Players/<html_file_name>')
def serve_player_html(html_file_name):
    return send_from_directory('Players', html_file_name)
@app.route('/Players/images/<path:image_name>')
def serve_player_image(image_name):
    return send_from_directory('Players/images', image_name)



@app.route('/get_shop/<nation_name>')
def get_shop(nation_name):
    # Load the 'economy.json' file for the specified nation
    try:
        with open(f'Nations/{nation_name}/economy.json', 'r') as file:
            data = json.load(file)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({'error': 'Nation not found'})

# Endpoint to serve each player's HTML file
@app.route('/Shops/<html_shop_name>')
def serve_shop_html(html_shop_name):
    return send_from_directory('Shops', html_shop_name)
@app.route('/Shops/images/<path:image_name>')
def serve_shop_image(image_name):
    return send_from_directory('Shops/images', image_name)

# Get Nations
@app.route('/get_nations')
def get_nations():
    nations_list = get_nations_list()
    return jsonify(nations_list)

# Serve the Nation_Flag.png image for Example_Nation
@app.route('/Nations/<nation_name>/Nation_Flag.png')
def serve_nation_flag(nation_name):
    # Replace 'path/to/your/Nation_Flag.png' with the actual path to the image on your file system
    # Make sure the image is in the correct folder structure under the static directory
    return send_from_directory('Nations/' + nation_name, 'Nation_Flag.png')

# Endpoint to fetch history HTML data
@app.route('/history/<nation_name>')
def serve_history(nation_name):
    # Try to read the content of the HTML file for the specified nation
    try:
        with open('Nations/' + nation_name + '/history.html', 'r') as file:
            html_content = file.read()
        return jsonify({'nation_name': nation_name, 'html_content': html_content})
    except FileNotFoundError:
        return jsonify({'error': 'Nation not found'})
# Endpoint to fetch Geography HTML data
@app.route('/geography/<nation_name>')
def serve_geography(nation_name):
    # Load geography data from a file or database based on the nation_name
    try:
        with open('Nations/' + nation_name + '/geography.html', 'r') as file:
            geohtml_content = file.read()
        return jsonify({'nation_name': nation_name, 'geohtml_content': geohtml_content})
    except FileNotFoundError:
        return jsonify({'error': 'Nation not found'})

if __name__ == '__main__':
    # Run the Flask application on a local IP address and port
    app.run(host='127.0.0.1', port=5000, debug=True)