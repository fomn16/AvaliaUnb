import './App.css';
import React from 'react';
import {connect} from 'react-redux'

import Landing from './Pages/Landing/Landing';
import Authenticated from './Pages/Authed/Authenticated';
import MessageDisplayer from './Components/MessageDisplayer/MessageDisplayer';

function App({user}) {
  return (
    <div className="App">
      <MessageDisplayer/>
      <header className="App-header">
        <RouteSelector user={user}/>
      </header>
      <svg id="svg1" className="BottomSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path d="M0,160L16,160C32,160,64,160,96,181.3C128,203,160,245,192,240C224,235,256,181,288,181.3C320,181,352,235,384,234.7C416,235,448,181,480,149.3C512,117,544,107,576,122.7C608,139,640,181,672,170.7C704,160,736,96,768,64C800,32,832,32,864,48C896,64,928,96,960,96C992,96,1024,64,1056,69.3C1088,75,1120,117,1152,154.7C1184,192,1216,224,1248,224C1280,224,1312,192,1344,197.3C1376,203,1408,245,1424,266.7L1440,288L1440,320L1424,320C1408,320,1376,320,1344,320C1312,320,1280,320,1248,320C1216,320,1184,320,1152,320C1120,320,1088,320,1056,320C1024,320,992,320,960,320C928,320,896,320,864,320C832,320,800,320,768,320C736,320,704,320,672,320C640,320,608,320,576,320C544,320,512,320,480,320C448,320,416,320,384,320C352,320,320,320,288,320C256,320,224,320,192,320C160,320,128,320,96,320C64,320,32,320,16,320L0,320Z"></path>
      </svg>
      <div className="Background"/>
      <div className='clouds'>
        <div className='cloud cloud-1'/>
        <div className='cloud cloud-2' style={{ transform: 'translate(0, -40vh)' }}/>
        <div className='cloud cloud-3' style={{ transform: 'translate(0, -30vh)' }}/>
        <div className='cloud cloud-4' style={{ transform: 'translate(0, -20vh)' }}/>
        <div className='cloud cloud-5' style={{ transform: 'translate(0, -10vh)' }}/>
        <div className='cloud cloud-6' style={{ transform: 'translate(0, 10vh)' }}/>
        <div className='cloud cloud-7' style={{ transform: 'translate(0, 20vh)' }}/>
      </div>
    </div>
  );
}

function RouteSelector({user}){
  if(user.signedIn){
    return <Authenticated/>
  }
  return <Landing/>;
}

const mapStateToProps = (state) =>{
  return {user:state.session.user}
}

export default connect(mapStateToProps)(App);