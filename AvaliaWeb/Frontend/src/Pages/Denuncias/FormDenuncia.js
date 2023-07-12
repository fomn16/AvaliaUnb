import { connect } from 'react-redux';
import { useState } from 'react';
import './FormDenuncia.css'
import Button from '../../Components/Button/Button';
import Form from '../../Components/Form/Form';
import { ShowMessage } from '../../StateManagement/Actions/MessageDisplayActions';
import Axios from 'axios';

function FormDenuncia({avaliacao, close, user, showMessage}){
    const [formData, setFormData] = useState({justificativa:""});
    const handleSubmit = (e) =>{
        e.preventDefault();
        Axios.post('http://localhost:3001/denuncia', {
            avaliacao:avaliacao,
            texto:formData.justificativa
        }, {headers:{'Authorization':`Bearer ${user.token}`}})
        .then(response => {
            console.log(response)
            showMessage(response.data.message);
            close();
        })
        .catch(error => {
            console.log(error);
            showMessage(error?.response?.data?.error ?? error.message);
        });
    }
    return(
        <div className='formDenuncia'>
            <Form className="form" formData={formData} setFormData={setFormData} submitText={"Salvar"} onSubmit={handleSubmit} items={[
                {
                    name:"justificativa",
                    type:"text"
                },]}/>
                <Button onClick={close}>Voltar</Button>
        </div>
    );
}

const mapDispatchToProps = (dispatch) =>{
    return {
        showMessage: (txt) => dispatch(ShowMessage(txt))
    }
};

const mapStateToProps = (state) =>{
    return {user:state.session.user}
}
  
export default connect(mapStateToProps, mapDispatchToProps)(FormDenuncia);