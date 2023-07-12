import { useState} from 'react';
import {connect} from 'react-redux'
import Axios from 'axios'

import './Turmas.css'
import Form from '../../Components/Form/Form'
import { ShowMessage} from '../../StateManagement/Actions/MessageDisplayActions'
import Turma from './Turma';



function Turmas({user, showMessage}){
    const [turmas, setTurmas] = useState([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState({ativo:false});
    const [formData, setFormData] = useState({
        nome_disciplina: "",
        sigla_disciplina: "",
        periodo: "",
        professor:""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:3001/turma/listar', {
            periodo:formData.periodo, 
            professor:formData.professor,
            disciplinaNome: formData.nome_disciplina,
            disciplinaSigla: formData.sigla_disciplina
        }, {headers:{'Authorization':`Bearer ${user.token}`}})
        .then(response => {
            setTurmas(response.data)
        })
        .catch(error => {
            console.log(error);
            showMessage(error?.response?.data?.error ?? error.message);
        });
    }

    const handleDetalhar = (turma) =>{
        setTurmaSelecionada({...turma, ativo:true});
    }
    const handleVoltar = () => {
        setTurmaSelecionada({ativo:false});
    }

    if(!turmaSelecionada.ativo){
        return(
            <>
                <Form className="formH" formData={formData} setFormData={setFormData} submitText={"Buscar"} onSubmit={handleSubmit} items={[
                {
                    name:"sigla_disciplina",
                    type:"text"
                },
                {
                    name:"nome_disciplina",
                    type:"text"
                },
                {
                    name:"periodo",
                    type:"text"
                },
                {
                    name:"professor",
                    type:"text"
                },]}/>
                {turmas.length > 0? 
                <table cellPadding="0" cellSpacing="0" border="0">
                <thead>
                    <tr>
                        <th>Disciplina</th>
                        <th>Nome</th>
                        <th>Turma</th>
                        <th>Periodo</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {turmas.slice(0,10).map((item, index) => {
                        return(
                            <tr key={index}>
                                <td>{item.disciplina.codigoTxt}</td>
                                <td>{item.disciplina.nome}</td>
                                <td>{item.codigo}</td>
                                <td>{item.periodo.nome}</td>
                                <td><i className="fas fa-search my-search-icon" onClick={() => handleDetalhar(item)}></i></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table> : null
                }
                
            </>
        );
    }
    else{
        return(<Turma voltar={handleVoltar} turma={turmaSelecionada}/>)
    }
}


const mapDispatchToProps = (dispatch) =>{
    return {
        showMessage: (txt) => dispatch(ShowMessage(txt))
    }
};

const mapStateToProps = (state) =>{
    return {user:state.session.user}
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Turmas);