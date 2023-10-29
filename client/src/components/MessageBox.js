import { Alert, AlertTitle } from "@mui/material";

export default function MessageBox(props) {
  return (
    <div className='sections'>
      <Alert severity='error'>
        <AlertTitle>Error</AlertTitle>
        {props.children}
      </Alert>
    </div>
  );

  // <Alert variant={props.variant || "info"}>{props.children}</Alert>;
}
