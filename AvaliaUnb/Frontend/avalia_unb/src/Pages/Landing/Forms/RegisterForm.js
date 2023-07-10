import React , {useState, useEffect} from 'react';
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
        senha: '',
        avatar: ''
    });

    const [avatarId, setAvatarId] = useState(Math.floor(Math.random()*100));

    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:3001/auth/register', formData)
        .then(response => {
            signIn(response.data)
        })
        .catch(error => {
            console.log('Error:', error);
            showMessage(error?.response?.data?.error ?? error.message);
        });
    }

    const reloadImage = () => {
        Axios.get('https://api.multiavatar.com/' + formData.nome + avatarId.toString() + '.png?apikey=sXHqEOnFhazZ7S', {
            responseType: 'blob',
        })
        .then(response => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarId(avatarId+1);
                setFormData({...formData, avatar:reader.result})
            };
            reader.readAsDataURL(response.data);
        })
        .catch(error => {
            console.log('Error:', error);
            showMessage(error.message);
        });
    }

    useEffect(() => {
        reloadImage();
    }, []); 

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
        ]}>
            <img className='imagemAvatarForm' src={formData.avatar} alt="foto de perfil" />
            <button type="button" className="refresh-avatar-button" onClick={reloadImage}>
                <i className="fas fa-sync-alt"></i>
            </button>
        </Form>
    )
}

const mapDispatchToProps = (dispatch) =>{
  return {
    signIn: (usr) => dispatch(SignIn(usr)),
    showMessage: (txt) => dispatch(ShowMessage(txt))
  }
};

export default connect(null, mapDispatchToProps)(RegisterForm);