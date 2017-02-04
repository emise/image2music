# Clarifai API handler

from flask import Blueprint, request, abort, jsonify
from clarifai.rest import ClarifaiApp


image_api = Blueprint('image_api', __name__)

CLARIFAI_CLIENT_ID = ***REMOVED***
CLARIFAI_CLIENT_SECRET = ***REMOVED***

MODELS = {
    'general': 'aaa03c23b3724a16a56b629203edc62c',
    'food': 'bd367be194cf45149e75f01d59f77ba7',
    'travel': 'eee28c313d69466f836ab83287a54ed9',
    'nsfw': 'e9576d86d2004ed1a38ba0cf39ecb4b1',
    'weddings': 'c386b7a870114f4a87477c0824499348',
    'color': 'eeed0b6733a644cea07cf4c60f87ebb7',
    'face': 'a403429f2ddf4b49b307e318f00e528b',
    'apparel': 'e0be3b9d6a454f0493ac3a30784001ff',
    'celebrity': 'e466caa0619f444ab97497640cefc4dc',
}

C_APP = ClarifaiApp(CLARIFAI_CLIENT_ID, CLARIFAI_CLIENT_SECRET)


@image_api.route('/api/image', methods=['POST'])
def process_image():
    """
    Return a list of concepts related to an image.
    """
    body = request.json

    if not body or not 'image' in body:
        abort(400)

    model = C_APP.models.get(MODELS[body['model']])
    result = model.predict_by_filename(body['image'])

    return jsonify({'result': result['outputs']})
