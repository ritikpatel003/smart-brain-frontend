import React,{useState, useEffect} from 'react';
import Clarifai from 'clarifai';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './components/navigation/Navigation'
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Logo from './components/logo/Logo'
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm'
import Rank from './components/rank/Rank'
import Signin from './components/signin/Signin'
import Register from './components/register/Register'

const app = new Clarifai.App({
  apiKey: '9aad9101d5d04665a0be7b4fe4586738' 
});

const particlesOptions = {
  particles: {
    number: {
      value: 125,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

function App() {
  const [input, setInput] = useState('');
  const [url, setUrl] = useState('');
  const [box, setBox] = useState('');
  const [route, setRoute] = useState('signin');
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  });

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    })
  }


  const getData = async () => {
    const abc = await fetch("https://pure-bayou-89320.herokuapp.com/");
    const actualData = await abc.json();
    console.log(actualData);
  };

  useEffect(() => {
    getData();
  }, []);


  const calculateFaceLocation = (data) => {
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

  const displayFaceBox =(res)=>{
    setBox(res);
  }

  const onInputChange = (e) =>{
    setInput(e.target.value);
  } 

  const Predict = async() =>{
    var res = await app.models.predict(Clarifai.FACE_DETECT_MODEL,input);
    res = await calculateFaceLocation(res);
    displayFaceBox(res);
    var response = await fetch('https://pure-bayou-89320.herokuapp.com/', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: user.id
      })
    })

    var count = await response.json()
    
    setUser(prevState => {
      return Object.assign({}, prevState, { entries: count });
    }); 
  } 

  const onButtonSubmit = () =>{
    setUrl(input);
    Predict();
  }

  const onRouteChange = (site) =>{
    setRoute(site);
  }

  return (
    <div className="App">
      <Particles className='particles'
        params={particlesOptions}
      />
      { route==="home" 
        ? 
        <>
          <Navigation onRouteChange={onRouteChange}/> 
          <Logo/>
          <Rank name={user.name} entries={user.entries}/>
          <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit}/>
          { url!=='' &&
            <FaceRecognition box={box} imgUrl={url}/>
          }
        </>
        : (
          route === 'signin'
          ? <Signin loadUser={loadUser} onRouteChange={onRouteChange}/>
          : <Register loadUser={loadUser} onRouteChange={onRouteChange}/> 
        )
      }
    </div>
  );
}

export default App;