import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'c80497c3d8c84120944582b5eeb5f7ae',
});

const particlesOptions = {
  particles: {
    number: {
      value: 320,
      density: {
        enable: true,
        value_area: 945,
      },
    },
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    };
    //console.log(app);
  }



  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  };
  
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    //console.log(width, height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }; 

  displayFaceBox = (box) => {
    console.log(box);

    this.setState({box: box});
  };

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  };

  onButtonSubmit = () => {
    //console.log('click');
    //console.log(app);

    this.setState({imageUrl: this.state.input});

    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => {
        if(response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json'},
            /** send some unique formated json data
            *    with as object the data  we want to put
            * here we only need the id to handle the put req 
            **/
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }));
          });
        }
        //console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        /*  get all the infos needed from the API  */
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(error => console.log(error));
  };

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false});
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    } 
    this.setState({route : route});
  };


  render() {

    const { isSignedIn, imageUrl, route, box } = this.state;

    return (
      <div className='App'>
        <Particles className='particles' params={particlesOptions} />
        <Navigation 
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank 
                name={this.state.user.name}
                entries={this.state.user.entries} />
              <ImageLinkForm 
                onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
              route === 'signin'    
              ? <SignIn 
                  loadUser={this.loadUser} 
                  onRouteChange={this.onRouteChange}  /> 
              : <Register 
                  loadUser={this.loadUser}
                  onRouteChange={this.onRouteChange}  /> 
            )
        }
      </div>
    );
  }
}

export default App;
