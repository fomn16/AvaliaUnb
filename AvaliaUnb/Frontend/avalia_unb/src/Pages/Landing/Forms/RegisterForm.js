import React , {useState} from 'react';
import Axios from 'axios'
import { connect } from 'react-redux';

import { SignIn } from '../../../StateManagement/Actions/sessionActions';
import { ShowMessage } from '../../../StateManagement/Actions/MessageDisplayActions'
import Form from '../../../Components/Form/Form'

function RegisterForm({signIn, showMessage}){
    const [formData, setFormData] = useState({
        matricula: '',
        email: '',
        nome: '',
        senha: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:3001/auth/register', formData)
        .then(response => {
            signIn(response.data)
        })
        .catch(error => {
            showMessage(error.response.data.error);
            console.log('Error:', error);
        });
    }

    return(
        <Form formData={formData} setFormData={setFormData} submitText={"Completar Registro"} onSubmit={handleSubmit} items={[
            {
                name:"matricula",
                type:"number"
            },
            {
                name:"email",
                type:"email"
            },
            {
                name:"nome",
                type:"text"
            },
            {
                name:"senha",
                type:"password"
            },
        ]}/>
    )
}

const mapDispatchToProps = (dispatch) =>{
  return {
    signIn: () => dispatch(SignIn()),
    showMessage: (txt) => dispatch(ShowMessage(txt))
  }
};

export default connect(null, mapDispatchToProps)(RegisterForm);