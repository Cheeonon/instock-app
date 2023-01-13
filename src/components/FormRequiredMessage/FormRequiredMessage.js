import { useEffect, useState } from "react";
import errorIcon from "../../assets/icons/error-24px.svg";
import "./FormRequiredMessage.scss";


const FormRequiredMessage = ({type}) => {
  const [text, setText] = useState(null);

  useEffect(()=>{
    if(type === "phone"){
      setText("Enter phone number in this format: 123-456-7890")
    } else{
      setText("This field is required")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <div className="required-message">
        <img className="required-message__icon" src={errorIcon} alt="error icon"></img>
        <p className="required-message__text">{text}</p>
    </div>
  )
}

export default FormRequiredMessage