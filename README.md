# An app to find music based on images

This app allows you to discover new music based on the theme of an uploaded image. First we get a list of topics related to the uploaded image via the Clarifai API, then we find playlists in Spotify based on the top few topics. For example, upload an image of a giraffe, and this app will find playlists that are giraffe-themed.

# APIs used
Clarifai - https://developer.clarifai.com/

Spotify - https://developer.spotify.com/web-api/

## Setup
`pip install -r requirements.txt`

`npm install -g webpack`

`npm install`

## Run app
Start python server: `./app.py`

Start webpack: `webpack --watch`
