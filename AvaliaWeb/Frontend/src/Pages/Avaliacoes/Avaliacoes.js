import './Avaliacoes.css'
import Avaliacao from './Avaliacao'

function Avaliacoes({avaliacoes}){
    return (
        <div className="listaAvaliacoes">
            {avaliacoes.slice(0,10).map((avaliacao, index) => {
                return(<Avaliacao avaliacao={avaliacao} index={index}/>);
            })}
        </div>
    )
}

export default Avaliacoes