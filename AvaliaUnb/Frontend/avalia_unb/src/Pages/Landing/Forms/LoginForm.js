import React , {useState} from 'react';
import Axios from 'axios'
import { connect } from 'react-redux';

import Form from '../../../Components/Form/Form'
import { SignIn } from '../../../StateManagement/Actions/sessionActions';
import { ShowMessage } from '../../../StateManagement/Actions/MessageDisplayActions'

function LoginForm({signIn, showMessage}){
    const [formData, setFormData] = useState({
        matricula: '',
        senha: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:3001/auth/login', formData)
        .then(response => {
            signIn(response.data)
        })
        .catch(error => {
            showMessage(error.response.data.error);
            console.log('Error:', error);
        });
    }

    return(
        <Form formData={formData} setFormData={setFormData} submitText={"Entrar"} onSubmit={handleSubmit} items={[
            {
                name:"matricula",
                type:"number"
            },
            {
                name:"senha",
                type:"password"
            }
        ]}/>
    )
}

const mapDispatchToProps = (dispatch) =>{
  return {
    signIn: (user) => dispatch(SignIn(user)),
    showMessage: (txt) => dispatch(ShowMessage(txt))
  }
};

export default connect(null, mapDispatchToProps)(LoginForm);