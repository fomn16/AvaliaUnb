export const signIn = user => {
    return {
        type: 'SIGN',
        payload: user
    };
};