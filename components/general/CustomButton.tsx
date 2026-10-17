import { ButtonProps } from "@mui/material";
import Spinner from "./Spinner";

export default function CustomButton({
  label,
  loading,
  disabled,
  handleSubmit,
  ...otherProps
}: {
  label: string;
  loading: boolean;
  handleSubmit?: () => void;
} & ButtonProps) {
  return (
    <button
      {...otherProps}
      className={`flex w-full items-center justify-center rounded-md p-4 ${disabled ? "bg-grey-200 text-grey-700" : "bg-grey text-white"}`}
      onClick={handleSubmit}
      disabled={disabled}
    >
      {loading ? (
        <Spinner />
      ) : (
        <p className="text-[17px] font-bold leading-6">{label}</p>
      )}
    </button>
  );
}
