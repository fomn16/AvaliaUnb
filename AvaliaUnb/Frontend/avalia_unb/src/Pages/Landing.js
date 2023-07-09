import React from 'react';
import './Landing.css';
import Button from '../Components/Button';

import { connect } from 'react-redux';
import { signIn } from '../StateManagement/Actions/sessionActions';

function Landing({ user , signIn}) {
  const handleLogin = () => {
    signIn({});
  };
  return (
    <>
      <h1 className="TitleName">AvaliaUnb</h1>
      <div className="Welcome">
        <h2>Bem vindos ao AvaliaUnb! {user.signedIn.toString()}</h2>
        <Button onClick={handleLogin}>Login</Button>
        <Button>Registrar-se</Button>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  signIn,
};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);