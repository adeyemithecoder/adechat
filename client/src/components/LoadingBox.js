import { CircularProgress } from "@mui/material";

export default function LoadingBox() {
  return (
    <p style={{ width: "100%", textAlign: "center", marginTop: "%" }}>
      <CircularProgress color='secondary' />
    </p>
  );
}
