import os
from flask import Flask, render_template, send_from_directory

app = Flask(__name__)

# Serve Nations
def get_nations_list():
    nations_directory = './Nations/'
    nations = []

    if os.path.exists(nations_directory) and os.path.isdir(nations_directory):
        for folder_name in os.listdir(nations_directory):
            if os.path.isdir(os.path.join(nations_directory, folder_name)):
                nations.append(folder_name)

    return nations

# Serve the frontend files from a directory
@app.route('/')
def serve_frontend():
    nations = get_nations_list()
    return render_template('main.html', nations=nations)

# Serve the JavaScript files
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



if __name__ == '__main__':
    # Run the Flask application on a local IP address and port
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(host='127.0.0.1', port=5000, debug=True)