import './Form.css'
import Button from '../Button/Button';

//items = [{name, type}]
function Form ({formData, setFormData, submitText, onSubmit, items, children, className}){
    if(items === undefined)
        return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return(
        <form onSubmit={onSubmit} className={className}>
        {children}
        {items.map((item, id) => {
            return(
                <label key={id}>
                    <h5>{item.name.replace("_"," ")}:</h5>
                    <input type={item.type} name={item.name} value={formData[item.name]} onChange={handleInputChange} />
                </label>
            )
        })}
        <Button type="submit">{submitText}</Button>
        </form>
    )
}

export default Form;