import os
from flask import Flask, render_template, send_from_directory, jsonify

app = Flask(__name__)

# Serve Nations
def get_nations_list():
    nations_directory = './Nations/'
    nations = []

    if os.path.exists(nations_directory) and os.path.isdir(nations_directory):
        for folder_name in os.listdir(nations_directory):
            if os.path.isdir(os.path.join(nations_directory, folder_name)):
                nations.append(folder_name)
    print(nations)
    return nations

# Serve the Vue.js app
@app.route('/')
def serve_vue_app():
    return render_template('vue_app.html')

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

# Serve Images
@app.route('/LoreWorks_Map.png')
def serve_map():
    return send_from_directory('', 'LoreWorks_Map.png')

@app.route('/Backgrounds/Blackstone_Background.jpg')
def serve_image1():
    return send_from_directory('Backgrounds', 'Blackstone_Background.jpg')
@app.route('/Backgrounds/Obsidian_Background.jpg')
def serve_image2():
    return send_from_directory('Backgrounds', 'Obsidian_Background.jpg')
@app.route('/Backgrounds/Spruce_Background.jpg')
def serve_image3():
    return send_from_directory('Backgrounds', 'Spruce_Background.jpg')
@app.route('/Backgrounds/Stone_Background.jpg')
def serve_image4():
    return send_from_directory('Backgrounds', 'Stone_Background.jpg')

# Serve Fonts
@app.route('/Fonts/RingbearerMedium-51mgZ.ttf')
def serve_font():
    return send_from_directory('Fonts', 'RingbearerMedium-51mgZ.ttf')

# Get Nations
@app.route('/get_nations')
def get_nations():
    nations_list = get_nations_list()
    return jsonify(nations_list)

# Endpoint to fetch history JSON data
@app.route('/history/<nation_name>')
def serve_history(nation_name):
    # Fetch history data and referenced images as JSON
    # You can use the same logic as before to extract data and images from HTML
    # and return it as JSON instead of rendering HTML
    return jsonify({'nation_name': nation_name, 'html_content': '...', 'referenced_images': [...]})

if __name__ == '__main__':
    # Run the Flask application on a local IP address and port
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(host='127.0.0.1', port=5000, debug=True)