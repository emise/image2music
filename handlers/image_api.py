from random import shuffle

from flask import Blueprint, request, abort, jsonify
from clarifai.rest import ClarifaiApp

from music_api import get_playlists, get_playlist_songs


image_api = Blueprint('image_api', __name__)

CLARIFAI_CLIENT_ID = 'yours'
CLARIFAI_CLIENT_SECRET = 'yours'

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


def get_concepts(model, image):
    """Get the top 4 concepts for an image

    model: the Clarifai model we want to use to classify the image
    image: a string in base64
    """
    model = C_APP.models.get(MODELS[model])
    result = model.predict_by_base64(image)

    concepts = result['outputs'][0].get('data', {}).get('concepts')
    concept_names = [item['name'] for item in concepts]
    concept_names = concept_names[:4]

    return concept_names


@image_api.route('/api/image', methods=['POST'])
def process_image():
    """Process the image and get spotify playlist results"""
    body = request.json

    if not body or not 'image' in body:
        abort(400)

    concept_names = get_concepts(body['model'], body['image'])

    p1 = get_playlists(concept_names[:2])
    p2 = get_playlists(concept_names[2:])
    length = len(p1) / 2

    playlists = p1[:length] + p2[length:]

    processed_playlist_data = [
        {'user': p['owner']['id'], 'playlist_id': p['id']}
        for p in playlists
    ]

    # Get top 4 songs for each playlist
    songs = get_playlist_songs(processed_playlist_data)

    for p in playlists:
        p['tracks'] = songs[p['id']]

    # Shuffle results for different concepts
    shuffle(playlists)

    return jsonify({'result': playlists})
