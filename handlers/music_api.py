import requests
import spotipy

from spotipy.oauth2 import SpotifyClientCredentials
from flask import Blueprint, jsonify, request


music_api = Blueprint('music_api', __name__)


SP_SEARCH_API = "https://api.spotify.com/v1/search"

SP_CLIENT_ID = "yours"
SP_CLIENT_SECRET = "yours"


def get_playlist_songs(playlists):
    """Get 4 songs from each playlist for previewing

    Input
        playlists: (list) of dicts in the format
            [
                {
                    user: (str),
                    playlist_id: (str)
                },
                {...},
            ...
            ]

    Returns (dict)
        {
            playlist_id: [
                {track: (str), artist: (str)},
                {...},
                {...},
                {...}
            ],
            playlist_id: [...],
            ...
        }
    """

    # Auth account
    client_credentials_manager = SpotifyClientCredentials(client_id=SP_CLIENT_ID,
                                                          client_secret=SP_CLIENT_SECRET)
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    # Fetch playlist song data
    result = {}
    for playlist in playlists:
        playlist_id = playlist['playlist_id']
        result[playlist_id] = []
        p_data = sp.user_playlist(playlist['user'], playlist['playlist_id'])
        # Only get the first 4 tracks
        p_data = p_data['tracks']['items'][:4]
        for song in p_data:
            artists = song['track']['artists']
            art = []
            for artist in artists:
                art.append(artist['name'])
            result[playlist_id].append(
                {
                    'name': song['track']['name'],
                    'artist': ', '.join(art)
                }
            )
    return result


def get_playlists(args):
    """Get playlists from Spotify that match the input keywords

    Input
        args: (list)
            [(str), (str)]
    """

    concept_str = " OR ".join(args)

    payload = {
        'q': concept_str,
        'type': 'playlist'
    }

    response = requests.get(SP_SEARCH_API, params=payload)
    r = response.json().get('playlists', {}).get('items')

    return r
