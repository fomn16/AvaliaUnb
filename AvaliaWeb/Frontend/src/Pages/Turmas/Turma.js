import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Axios from "axios";


import Button from "../../Components/Button/Button";
import './Turma.css'
import { ShowMessage } from "../../StateManagement/Actions/MessageDisplayActions";

function Turma({voltar, turma, user, showMessage}) {
    const [professores, setProfessores] = useState([])
    const [avaliacoes, setAvaliacoes] = useState([])
    const [minhaAvaliacao, setMinhaAvaliacao] = useState({existe: false})

    useEffect(() => {
         Axios.post('http://localhost:3001/turma/listarProfessores', turma, {headers:{'Authorization':`Bearer ${user.token}`}})
        .then(response => {
            setProfessores(response.data)
            Axios.post('http://localhost:3001/avaliacao/listar', {turma: turma}, {headers:{'Authorization':`Bearer ${user.token}`}})
            .then(response => {
                setAvaliacoes(response.data)
                Axios.post('http://localhost:3001/avaliacao/listar', {turma: turma, usuario:user}, {headers:{'Authorization':`Bearer ${user.token}`}})
                .then(response => {
                    setMinhaAvaliacao(response.data.length>0 ? {existe: true, ...response.data[0]} : {existe:false})
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
    }, []); 

    return(
        <div className="TurmaDiv">
            <h1>{turma.disciplina.nome}</h1>
            <div className="info">
                <h4>Código da turma: {turma.disciplina.codigoTxt}<br/>periodo: {turma.periodo.nome}<br/>turma: {turma.codigo}</h4>
                <h2>Professor{professores.length > 1 ? "es" : null}:</h2> <h4>{professores.map((p) => {return p.nome}).join(", ")}</h4>
                <h2>Avaliações:</h2> {avaliacoes.length>0 ? TabelaAvaliacoes(avaliacoes) : <h4>Não há avaliações cadastradas</h4>}
                <h2>Minha Avaliação:</h2> {FormAvaliacao(minhaAvaliacao)}
            </div>
            <Button onClick={voltar}>Voltar</Button>
        </div>
    );
}

const TabelaAvaliacoes = (avaliacoes) =>{
    console.log(avaliacoes)
    return(<h1>tabela de avaliações</h1>);
}

const FormAvaliacao = (avaliacao) =>{
    console.log(avaliacao)
    return(<h1>form de avaliaçáo</h1>);
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