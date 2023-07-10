import './Authenticated.css'
import {connect} from 'react-redux'

function Authenticated({user}){
    return(
        <div className='sidebar'>
            <div className='userArea'>
                <img src={user.avatar} alt="Avatar do Usuario"/>
                <h5>{user.nome}</h5>
            </div>
        </div>
    )
}

const mapStateToProps = (state) =>{
  return {user:state.session.user}
}

export default connect(mapStateToProps)(Authenticated);