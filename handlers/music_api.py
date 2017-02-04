import requests

from flask import Blueprint


music_api = Blueprint('music_api', __name__)

SPOTIFY_SEARCH_API = "https://api.spotify.com/v1/search"


def get_playlists(args):
    """Get playlists from Spotify that match the input arguments"""

    concept_str = " OR ".join(args)

    payload = {
        'q': concept_str,
        'type': 'playlist'
    }

    response = requests.get(SPOTIFY_SEARCH_API, params=payload)
    r = response.json().get('playlists', {}).get('items')

    return r
