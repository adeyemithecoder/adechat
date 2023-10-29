import { useState } from "react";
import "./FormInput.css";

const FormInput = ({
  label,
  errMes,
  required,
  value,
  name,
  onChange,
  ...others
}) => {
  const [focus, setFocus] = useState(false);
  const handleFocus = (e) => {
    setFocus(true);
  };
  return (
    <div className='allInput'>
      <label>{label} </label>
      <input
        className='Forminput'
        {...others}
        value={value}
        required={required}
        name={name}
        onChange={onChange}
        onBlur={handleFocus}
        focus={focus.toString()}
        onFocus={() => name === "confirmPassword" && setFocus(true)}
      />
      <span>{errMes}</span>
    </div>
  );
};

export default FormInput;
