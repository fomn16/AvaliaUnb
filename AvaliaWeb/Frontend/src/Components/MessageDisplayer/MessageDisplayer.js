import './MessageDisplayer.css'
import { connect } from 'react-redux';
import {HideMessage} from '../../StateManagement/Actions/MessageDisplayActions'

function MessageDisplayer({message, hideMessage}){
    if(message.active){
        setTimeout(() => {
            hideMessage();
        }, 3000);
        return(
            <div className='MessageDisplayer'>
                <h3>{message.text}</h3>
            </div>
        )
    }
    return null;
}

const mapDispatchToProps = (dispatch) => {
    return {
        hideMessage: () => dispatch(HideMessage())
    };
};

const mapStateToProps = (state) =>{
    return {message:state.messageDisplay}
}


export default connect(mapStateToProps, mapDispatchToProps)(MessageDisplayer)