import React , {useState} from 'react';
import './Landing.css';
import Button from '../../Components/Button/Button';
import RegisterForm from './Forms/RegisterForm';
import LoginForm from './Forms/LoginForm';

function Landing() {
  const [selectedOption, setSelectedOption] = useState(0);
  
  const handleOption = option => {
    if(selectedOption===option)
        setSelectedOption(0);
    else
        setSelectedOption(option);
  };

  const selectForm = option =>{
    switch (option){
        case 1: return (<><div className="dotted-line"/><LoginForm/></>)
        case 2: return (<><div className="dotted-line"/><RegisterForm/></>)
        default: return null;
    }
  }

  return (
    <>
      <h1 className="TitleName">AvaliaUnb</h1>
      <div className="Welcome">
        <h2>Bem vindos ao AvaliaUnb!</h2>
        <Button onClick={() => handleOption(1)}>Fazer Login</Button>
        <Button onClick={() => handleOption(2)}>Registrar-se</Button>
        {selectForm(selectedOption)}
      </div>
    </>
  );
}

export default Landing;