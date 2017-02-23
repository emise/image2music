import React from 'react';
import axios from 'axios'
import ReactDropzone from 'react-dropzone'
import Scroll from 'react-scroll'


export default class Base extends React.Component {

  constructor() {
    super()
    this.state = {
      playlists: null,
      files: null,
      loading: false,
    }
  }

  onDrop = (files) => {
    this.setState({
      files: files
    })
  }

  showSongs = (index) => {
    this.state.playlists[index].hovered = true
    this.setState({playlists: this.state.playlists})
  }

  hideSongs = (index) => {
    this.state.playlists[index].hovered = false
    this.setState({playlists: this.state.playlists})
  }

  postImage = (image) => {
    axios.post('/api/image', {
      image: image,
      model: 'general'
    }).then(res => {
      let data = res.data.result
      this.setState({
        playlists: data,
        loading: false
      })

      Scroll.scroller.scrollTo('playlistContainer', {
        duration: 800,
        delay: 100,
        smooth: true
      })
    })
  }

  // Get a list of playlists from a processed image
  // By default we use the 'general-v1.3' model from Clarifai
  processImage = (image) => {
    this.setState({
      loading: true
    })
    // encode image as base64 string
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = () => {
      let imageStr = reader.result.split('base64,')[1];
      // send image to server
      if (imageStr) {
        this.postImage(imageStr);
      }
    }
  }

  resetUpload = () => {
    this.setState({
      playlists: null,
      files: null
    })
  }

  render() {
    return (
      <div>
        <div className="container-wrapper">
          <div className="container">
            <h1>Discover New Music</h1>
            <h2>*Requires Spotify to listen</h2>
            <div className="upload-container">
              <div className="image-preview-container">
                { this.state.loading ?
                  <div className="loading-container">
                    <h3>Calculating...</h3>
                    <img src="/static/spinner.svg"/>
                  </div> : null
                }
                { this.state.files ?
                  this.state.files.map( (file, index) =>
                    <img key={index} src={file.preview} className="image-preview"/>
                  ) :
                  <ReactDropzone onDrop={this.onDrop} className="image-preview-container">
                    Drag and drop an image here, or click to upload one
                  </ReactDropzone>
                }
              </div>
              <div className="button-container">
                { this.state.files && !this.state.playlists ?
                  <button className="btn btn-primary"
                          onClick={() => this.processImage(this.state.files[0])}>
                    Discover
                  </button> :
                  <button className="btn btn-primary" disabled>
                    Discover
                  </button>
                }
                { this.state.files && this.state.playlists ?
                  <button className="btn btn-secondary"
                          style={{marginTop:10}}
                          onClick={this.resetUpload}>
                    Do it again
                  </button> : null
                }
              </div>
            </div>
          </div>
        </div>
        <div className="music-container-wrapper">
          <Scroll.Element name="playlistContainer" className="container">
            { this.state.playlists ?
              this.state.playlists.map( (item, index) =>
                <div key={item.id}
                     style={{backgroundImage: 'url(' + (item.images[1]||item.images[0]).url + ')'}}
                     className="playlist-image">
                  <a className="playlist-image-overlay"
                     href={item.external_urls.spotify}
                     target="_blank"
                     onMouseEnter={() => this.showSongs(index)}
                     onMouseLeave={() => this.hideSongs(index)}>
                    { item.hovered ?
                      <div className="tracks-container">
                        { item.tracks.map((track, index) =>
                              <div key={index} className="track-item">
                                {track.name} - <span className="artist-name">{track.artist}</span>
                              </div>
                            )
                        }
                        more...
                      </div> : <span>{item.name}</span>
                    }
                  </a>
                </div>
              ) : null
            }
          </Scroll.Element>
        </div>
      </div>
    );
  }
}
