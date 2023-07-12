import { useState, useEffect} from 'react';
import {connect} from 'react-redux'
import Axios from 'axios'

import Form from '../../Components/Form/Form'
import { ShowMessage} from '../../StateManagement/Actions/MessageDisplayActions'

function Denuncias({user, showMessage}){
    const [denuncias, setDenuncias] = useState([]);

    const loadDenuncias = () =>{
        Axios.get('http://localhost:3001/denuncia', {headers:{'Authorization':`Bearer ${user.token}`}})
        .then(response => {
            setDenuncias(response.data)
        })
        .catch(error => {
            console.log(error);
            showMessage(error?.response?.data?.error ?? error.message);
        });
    }

    useEffect(() => {
        loadDenuncias();
   }, []); 

    const handleSubmit = (operacao, denuncia) => {
        Axios.post('http://localhost:3001/denuncia/processar', {operacao: operacao, denuncia: denuncia} ,{headers:{'Authorization':`Bearer ${user.token}`}})
        .then(response => {
            showMessage(response.data);
            loadDenuncias();
        })
        .catch(error => {
            console.log(error);
            showMessage(error?.response?.data?.error ?? error.message);
        });
    }

    return(
    <>
        {denuncias.length > 0 ? 
        <table cellPadding="0" cellSpacing="0" border="0">
        <thead>
            <tr>
                <th>Denunciante</th>
                <th>Denunciado</th>
                <th>Avaliação (nota)</th>
                <th>Avaliação (texto)</th>
                <th>Denúncia</th>
                {user.administrador ? <>
                <th></th>
                <th></th>
                <th></th></>: null}
            </tr>
        </thead>
        <tbody>
            {denuncias.slice(0,10).map((item, index) => {
                return(
                    <tr key={index}>
                        <td>{item.usuario.matricula}</td>
                        <td>{item.avaliacao.usuario.matricula}</td>
                        <td>{item.avaliacao.nota}</td>
                        <td>{item.avaliacao.texto}</td>
                        <td>{item.texto}</td>
                        {item.aceita || !user.administrador ? <><td></td><td></td><td></td></> : <>
                        <td><i className="fas fa-times my-icon" onClick={() => handleSubmit(0, item)} title='Ignorar'/></td>
                        <td><i className="fas fa-check my-icon" onClick={() => handleSubmit(1, item)} title='Aceitar e apagar avaliação'/></td>
                        <td><i className="fas fa-skull my-icon" onClick={() => handleSubmit(2, item)} title='Aceitar e bloquear usuário'/></td>
                        </>}
                    </tr>
                );
            })}
        </tbody>
    </table> : <h1>Não há denúncias</h1>
        }
        
    </>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(Denuncias);