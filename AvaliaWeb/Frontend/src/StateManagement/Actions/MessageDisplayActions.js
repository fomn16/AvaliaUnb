export const ShowMessage = text => {
    return {
        type: 'SHOWMESSAGE',
        payload: text
    };
};

export const HideMessage = () => {
    return {
        type: 'HIDEMESSAGE'
    };
};