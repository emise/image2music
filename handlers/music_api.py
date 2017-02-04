import requests
import math
import random

from flask import Blueprint


music_api = Blueprint('music_api', __name__)

SP_AUTH_URL = "https://accounts.spotify.com/authorize"
SP_SEARCH_API = "https://api.spotify.com/v1/search"

SP_CLIENT_ID = "***REMOVED***"
SP_CLIENT_SECRET = "yours"
SP_REDIRECT_URI = "http://127.0.0.1:5000/"


def auth_account():
    payload = {
        response_type: 'code',
        client_id: SP_CLIENT_ID,
        redirect_uri: SP_REDIRECT_URI
    }
    r = requests.get(SP_AUTH_URL, params=payload)
    return r.url()


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
