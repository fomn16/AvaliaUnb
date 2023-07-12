import './Avaliacao.css'
import { useState } from 'react'

import FormDenuncia from '../Denuncias/FormDenuncia'

const getColor = (nota)=>{
    if(nota>=8) return 'green'
    if(nota>=6) return 'yellow'
    return 'red'
}

function Avaliacao({avaliacao, index}){
    const [denunciando, setDenunciando] = useState(false)
    return(
        <>
        <div key={index} className="avaliacaoView">
            <div className="avaliacaoHeader">
                <img src={avaliacao.usuario.avatar} alt="Avatar do Usuario"/>
                <h4>{avaliacao.usuario.nome}</h4>
            </div>
            <h3 style={{
                position:'absolute', 
                transform:'translate(340px, -30px)', 
                backgroundColor:getColor(avaliacao.nota),
                color:'black',
                width:'60px',
                height:'55px',
                textAlign:'center',
                justifyContent:'center',
                paddingTop:'5px',
                borderRadius:'var(--border)'
            }}>
                    {avaliacao.nota}
            </h3>
            <h6 className="hide-scrollbar" style={{
                height:'120px', 
                overflow:'auto'
            }}>{avaliacao.texto}</h6>
            <i className="fas fa-flag my-icon" style={{color:"red"}} title="Denunciar" onClick={() => {setDenunciando(true)}}></i>
        </div>
        {denunciando? <FormDenuncia avaliacao={avaliacao} close={() => setDenunciando(false)}/> : null}
        </>
        
    );
}

export default Avaliacao