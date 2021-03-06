import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js'
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App ({
  apiKey: 'b8a5c379eadc48e083c2113b93779072'
})

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 500
      }
    }
  }
}


class App extends Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedin: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input
      )
      .then((response) => this.displayFaceBox(this.calculateFaceLocation(response))
      .catch(err => console.log(err))
    );    
  }

  onRouteChange = (route) => {
    if (route === 'signin') {
      this.setState({isSignedin: false})
    }else if (route === 'home') {
      this.setState({isSignedin: true})
    }
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App"> 
        <Particles className = 'particles'
          params = {particlesOptions}
        />
        <Navigation onRouteChange = {this.onRouteChange} isSignedin = {this.state.isSignedin}/>
        { this.state.route === 'home' 
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm 
                onInputChange = {this.onInputChange} 
                onButtonSubmit = {this.onButtonSubmit}
              />
              <FaceRecognition 
                imageUrl = {this.state.imageUrl} 
                box = {this.state.box} 
              />
            </div>
          : ( 
              this.state.route === 'signin'
              ? <Signin onRouteChange = {this.onRouteChange} />
              : <Register onRouteChange = {this.onRouteChange} />
            )
        }
      </div>
    );
  }
}

export default App;
