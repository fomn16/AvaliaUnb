import './Authenticated.css'
import {connect} from 'react-redux'
import { useState } from 'react'

import Button from '../../Components/Button/Button'
import Turmas from '../Turmas/Turmas'
import Denuncias from '../Denuncias/Denuncias'

function Authenticated({user}){
    const [selected, _setSelected] = useState(0);
    const setSelected = (selection) => {selection == selected ? _setSelected(0) : _setSelected(selection)}

    const pageSelector  = () => {
        switch(selected){
            case 1: 
                return (<div className='Page'><Turmas/></div>);
            case 4:
                return (<div className='Page'><Denuncias/></div>);
            default: return null;
        }
    }

    return(
        <>
        <div className='sidebar'>
            <div className='userArea'>
                <img src={user.avatar} alt="Avatar do Usuario"/>
                <h5>{user.nome}</h5>
            </div>
            <div className='page-list'>
                
                <Button className='MyButtonHB' onClick={() => setSelected(1)}>Turmas</Button>
                {/*<Button className='MyButtonHB' onClick={() => setSelected(2)}>Professores</Button>*/}
                {/*<Button className='MyButtonHB' onClick={() => setSelected(3)}>Minhas Avaliações</Button>*/}
                {user.administrador ? <Button className='MyButtonHB' onClick={() => setSelected(4)}>Denúnicas</Button> : null}
                {/*user.administrador ? <Button className='MyButtonHB' onClick={() => setSelected(5)}>Usuários</Button> : null*/}
            </div>
        </div>
        {pageSelector()}
        </>
    )
}

const mapStateToProps = (state) =>{
  return {user:state.session.user}
}

export default connect(mapStateToProps)(Authenticated);