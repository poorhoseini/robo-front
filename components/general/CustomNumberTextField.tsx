import { TextField, TextFieldProps } from "@mui/material";

export default function CustomNumberTextField({
  variant = "outlined",
  inputProps = { inputMode: "numeric" },
  sx,
  ...props
}: TextFieldProps) {
  return (
    <TextField
      {...props}
      variant={variant}
      inputProps={inputProps}
      sx={{
        width: "100%",
        height: "100%",
        "& .MuiInputBase-root": {
          height: "100%",
          "&.Mui-disabled": {
            backgroundColor: "#404040",
          },
          "& .Mui-disabled": {
            WebkitTextFillColor: "white !important",
          },
        },
        "& .MuiInputBase-input": {
          textAlign: "center",
          padding: 0,
        },
        ...sx,
      }}
    />
  );
}
