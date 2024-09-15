import { makeStyles } from "@material-ui/core";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormControl-root": {
      width: "80%",
      margin: theme.spacing(1),
    },
  },
}));
export const UseForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const resetForm = () => {
    setValues(initialValues);
  };
  return {
    values,
    setValues,
    handleInputChange,
    resetForm,
  };
};

export const Form = (props) => {
  const { children, ...other } = props;
  const classes = useStyles();

  return (
    <form autoComplete='off' {...other} className={classes.root}>
      {children}
    </form>
  );
};
