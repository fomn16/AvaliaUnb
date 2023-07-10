const initialState = {
    text: '',
    active:false
};

const messageDisplayReducer = (state = initialState, action) => {
    switch(action.type){
        case 'SHOWMESSAGE':
            return{...state, text:action.payload, active:true};
        case 'HIDEMESSAGE':
            return{...state, active:false};
        default:
            return state;
    };
}

export default messageDisplayReducer;