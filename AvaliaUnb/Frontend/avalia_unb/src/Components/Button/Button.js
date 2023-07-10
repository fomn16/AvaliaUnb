import './Button.css'

function Button(props){
    return(
        <button className={"MyButton " + props.className} onClick={props.onClick} type={props.type}>{props.children}</button>
    );
}

export default Button;