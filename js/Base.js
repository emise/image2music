import React from 'react';
import axios from 'axios'
import ReactDropzone from 'react-dropzone'


export default class Base extends React.Component {

  constructor() {
    super()
    this.state = {
      concepts: null,
      files: null
    }
  }

  onDrop = (files) => {
    this.setState({
      files: files
    })
    console.log('received files', files)
  }

  // Get a list of concepts from an image.
  // By default we use the 'general-v1.3' model from Clarifai
  getConcepts = (image) => {
    axios.post('/api/image', {
      image: image,
      model: 'general'
    }).then(res => {
      let data = res.data.result[0].data.concepts

      // We only want the 4 top most accurate concepts
      data.length = 4
 
      console.log(data)

      this.setState({
        concepts: data
      })
    })
  }

  resetUpload = () => {
    this.setState({
      concepts: null,
      files: null
    })
  }

  componentDidMount() {

    let self = this;

  }

  render() {
    return (
      <div>
        <div className="container">
          <h1>Discover New Music</h1>

          <div className="upload-container">
            <div className="image-preview-container">
              { this.state.files ?
                this.state.files.map((file, index) =>
                  <img key={index} src={file.preview} className="image-preview"/>
                ) :
                <ReactDropzone onDrop={this.onDrop} className="image-preview-container">
                  Drag and drop an image here, or click to upload one
                </ReactDropzone>
              }
            </div>
            <div className="button-container">
              { this.state.files && !this.state.concepts ?
                <button className="btn btn-primary"
                        onClick={() => this.getConcepts(this.state.files[0].name)}>
                  Upload
                </button> :
                <button className="btn btn-primary" disabled>
                  Upload
                </button>
              }
              { this.state.files && this.state.concepts ?
                <button className="btn btn-secondary"
                        style={{marginTop:10}}
                        onClick={this.resetUpload}>
                  Clear
                </button> : null
              }
            </div>
          </div>

          { this.state.concepts ?
            <div>
              { this.state.concepts.map((concept) => {
                  return (
                    <div key={concept.id}>
                      {concept.name}
                    </div>
                  )
                })
              }
            </div> : null
          }
        </div>
        <div className="music-container">
          <div className="container">
            spotify part goes here
          </div>
        </div>
      </div>
    );
  }
}
