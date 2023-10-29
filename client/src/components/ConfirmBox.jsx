import {
  Button as MuiButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { NotListedLocation } from "@material-ui/icons";
import React from "react";
const useStyle = makeStyles((theme) => ({
  dialog: {
    padding: theme.spacing(2),
    position: "absolute",
    top: theme.spacing(2),
    color: "red",
  },
}));
const ConfirmBox = ({ confirm, setConfirm }) => {
  const { title, subtitle } = confirm;
  const classes = useStyle();
  const changeOpn = () => {
    console.log("run");
    setConfirm({ ...confirm, isOpen: false });
    console.log(confirm);
  };
  console.log(confirm);
  return (
    <div>
      <Dialog
        open={confirm.isOpen}
        className={classes.dialog}
        classes={{ Paper: classes.dialog }}
      >
        <DialogTitle>
          {/* <IconButton disableRipple>
            <NotListedLocation className='yesvvv' />
          </IconButton> */}
        </DialogTitle>
        <DialogContent>
          <Typography variant='h6'>{title}</Typography>
          <Typography className='subtitle2' variant='subtitle2'>
            {subtitle}
          </Typography>
        </DialogContent>
        <DialogActions>
          {/* <button>no</button>
          <button>yes</button> */}
          <MuiButton
            onClick={() => {
              setConfirm({ ...confirm, isOpen: false });
            }}
            color='primary'
          >
            No
          </MuiButton>
          <MuiButton color='success'>Yes</MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmBox;
