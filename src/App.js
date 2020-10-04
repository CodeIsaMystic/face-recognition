import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';

const app = new Clarifai.App({
  apiKey: '2954123e222d4e28960202e4616bfbc7',
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
    };
    console.log(app);
  }

  onInputChange = (event) => {
    console.log(event.target.value);
  };

  onButtonSubmit = () => {
    console.log('click');
    console.log(app);

    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, 'https://samples.clarifai.com/face-det-jpg')
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        /*console.log(error);*/
      });
  };

  render() {
    return (
      <div className='App'>
        <Particles className='particles' params={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
        {/*<FaceRecognition />*/}
      </div>
    );
  }
}

export default App;
