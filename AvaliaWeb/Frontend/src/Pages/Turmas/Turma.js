import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Axios from "axios";


import Button from "../../Components/Button/Button";
import './Turma.css'
import { ShowMessage } from "../../StateManagement/Actions/MessageDisplayActions";
import Avaliacoes from "../../Pages/Avaliacoes/Avaliacoes";
import Form from "../../Components/Form/Form";

function Turma({voltar, turma, user, showMessage}) {
    const [professores, setProfessores] = useState([])
    const [avaliacoes, setAvaliacoes] = useState([])
    const [minhaAvaliacao, setMinhaAvaliacao] = useState({existe: false})

    const reloadInfo = () =>{
        Axios.post('http://localhost:3001/turma/listarProfessores', turma, {headers:{'Authorization':`Bearer ${user.token}`}})
        .then(response => {
            setProfessores(response.data)
            Axios.post('http://localhost:3001/avaliacao/listar', {turma: turma}, {headers:{'Authorization':`Bearer ${user.token}`}})
            .then(response => {
                setAvaliacoes(response.data)
                Axios.post('http://localhost:3001/avaliacao/listar', {turma: turma, usuario:user}, {headers:{'Authorization':`Bearer ${user.token}`}})
                .then(response => {
                    setMinhaAvaliacao(response.data.length>0 ? {existe: true, ...response.data[0]} : {existe:false, nota:5, texto:'', turma:turma})
                })
                .catch(error => {
                    console.log(error);
                    showMessage(error?.response?.data?.error ?? error.message);
                });
            })
            .catch(error => {
                console.log(error);
                showMessage(error?.response?.data?.error ?? error.message);
            });
        })
        .catch(error => {
            console.log(error);
            showMessage(error?.response?.data?.error ?? error.message);
        });
    }

    useEffect(() => {
         reloadInfo();
    }, []); 

    return(
        <div className="TurmaDiv">
            <h1>{turma.disciplina.nome}</h1>
            <div className="info">
                <h4>Código da turma: {turma.disciplina.codigoTxt}<br/>periodo: {turma.periodo.nome}<br/>turma: {turma.codigo}</h4>
                <h2>Professor{professores.length > 1 ? "es" : null}:</h2> <h4>{professores.map((p) => {return p.nome}).join(", ")}</h4>
                <h2>Avaliações:</h2> {avaliacoes.length>0 ? <Avaliacoes avaliacoes={avaliacoes}/> : <h4>Não há avaliações cadastradas</h4>}
                <h2>Minha Avaliação:</h2> {FormAvaliacao(minhaAvaliacao, setMinhaAvaliacao, user, showMessage, reloadInfo)}
            </div>
            <div style={{display:'flex', flexDirection:'row-reverse'}}>
                <Button onClick={voltar}>Voltar</Button>
            </div>
        </div>
    );
}

const FormAvaliacao = (avaliacao, setAvaliacao, user, showMessage, reloadInfo) =>{
    console.log(avaliacao);
    const handleSubmit = (e) =>{
        e.preventDefault();
        Axios.post('http://localhost:3001/avaliacao', avaliacao, {headers:{'Authorization':`Bearer ${user.token}`}})
        .then(response => {
            showMessage(response.data.message);
            reloadInfo();
        })
        .catch(error => {
            console.log(error);
            showMessage(error?.response?.data?.error ?? error.message);
        });
    }

    return(
        <Form className="form" formData={avaliacao} setFormData={setAvaliacao} submitText={"Salvar"} onSubmit={handleSubmit} items={[
        {
            name:"nota",
            type:"number"
        },
        {
            name:"texto",
            type:"text"
        }]}/>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(Turma);