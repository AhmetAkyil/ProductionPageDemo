from flask import Flask, request, jsonify, send_from_directory
import os
import uuid
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_DIR = "uploads"
PROCESSED_DIR = "static/processed"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

# Tag önerileri
SUGGESTED_TAGS = ["metal", "kırmızı", "ekran", "plastik", "klavye", "dokunmatik"]

@app.route('/suggested-tags', methods=['GET'])
def get_suggested_tags():
    return jsonify(SUGGESTED_TAGS)

@app.route('/upload', methods=['POST'])
def upload_image():
    name = request.form.get("name")
    category = request.form.get("category")
    tags_raw = request.form.get("tags")  # "metal, kırmızı"
    tags = [tag.strip() for tag in tags_raw.split(",")] if tags_raw else []

    file = request.files['image']
    filename = f"{uuid.uuid4()}.jpg"
    upload_path = os.path.join(UPLOAD_DIR, filename)
    file.save(upload_path)

    processed_filename = f"enhanced_{filename}"
    processed_path = os.path.join(PROCESSED_DIR, processed_filename)
    img = Image.open(upload_path)
    img.save(processed_path)

    return jsonify({
        "name": name,
        "category": category,
        "tags": tags,
        "originalImage": f"/uploads/{filename}",
        "enhancedImage": f"/processed/{processed_filename}",
        "boundingBoxes": [
            {"label": "object", "x": 100, "y": 150, "width": 200, "height": 120}
        ]
    })

@app.route('/uploads/<filename>')
def get_uploaded_file(filename):
    return send_from_directory(UPLOAD_DIR, filename)

@app.route('/processed/<filename>')
def get_processed_file(filename):
    return send_from_directory(PROCESSED_DIR, filename)

if __name__ == '__main__':
    app.run(debug=True)
