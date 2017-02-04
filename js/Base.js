import React from 'react';
import axios from 'axios'
import ReactDropzone from 'react-dropzone'


export default class Base extends React.Component {

  constructor() {
    super()
    this.state = {
      playlists: null,
      files: null
    }
  }

  onDrop = (files) => {
    this.setState({
      files: files
    })
    console.log('received files', files)
  }

  // Get a list of playlists from a processed image
  // By default we use the 'general-v1.3' model from Clarifai
  processImage = (image) => {
    axios.post('/api/image', {
      image: image,
      model: 'general'
    }).then(res => {
      let data = res.data.result
      console.log(data)

      this.setState({
        playlists: data
      })
    })
  }

  resetUpload = () => {
    this.setState({
      playlists: null,
      files: null
    })
  }

  componentDidMount() {

    let self = this;

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
                          onClick={() => this.processImage(this.state.files[0].name)}>
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
          <div className="container">
            { this.state.playlists ?
              this.state.playlists.map( (item) =>
                <div key={item.id}
                     style={{backgroundImage: 'url(' + (item.images[1]||item.images[0]).url + ')'}}
                     className="playlist-image">
                  <div className="playlist-image-overlay">{item.name}</div>
                </div>
              ) : null
            }
          </div>
        </div>
      </div>
    );
  }
}