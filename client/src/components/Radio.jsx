import "./Radio.css";

const Radio = ({ value, id, onChange, label, name }) => {
  return (
    <div>
      <label className='radio-label' htmlFor={id}>
        <input
          className='radio-input'
          type='radio'
          value={id}
          id={id}
          checked={value === id}
          name={name}
          onChange={onChange}
        />
        <div className='radio-div'> </div>
        {label}
      </label>
    </div>
  );
};

export default Radio;
