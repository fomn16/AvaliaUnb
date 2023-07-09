const initialState = {
    user: {signedIn:false}
};

const sessionReducer = (state = initialState, action) => {
    switch(action.type){
        case 'SIGN':
            return{...state, user:{...action.payload, signedIn:true}};
        default:
            return state;
    };
}

export default sessionReducer;