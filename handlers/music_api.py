import requests
import spotipy

from spotipy.oauth2 import SpotifyClientCredentials
from flask import Blueprint, jsonify, request


music_api = Blueprint('music_api', __name__)


SP_SEARCH_API = "https://api.spotify.com/v1/search"

SP_CLIENT_ID = "***REMOVED***"
SP_CLIENT_SECRET = "yours"


@music_api.route('/api/playlist', methods=['GET'])
def auth_account():
    client_credentials_manager = SpotifyClientCredentials(client_id=SP_CLIENT_ID,
                                                          client_secret=SP_CLIENT_SECRET)
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
    playlist = sp.user_playlist(request.args.get('user'), request.args.get('playlist_id'))

    return jsonify({'result': playlist})
    

def get_playlists(args):
    """Get playlists from Spotify that match the input arguments"""

    concept_str = " OR ".join(args)

    payload = {
        'q': concept_str,
        'type': 'playlist'
    }

    response = requests.get(SP_SEARCH_API, params=payload)
    r = response.json().get('playlists', {}).get('items')

    return r
