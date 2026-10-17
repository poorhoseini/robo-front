import { englishNumber } from "@/lib/helpers/persianNumber.helper";
import { numberInputRegex } from "@/lib/helpers/regex";
import { InputAdornment, TextField } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { SearchFilterFormProps } from "./FiltersForm";

export default function PricesFilterBox({
  control,
}: {
  control: Control<SearchFilterFormProps, any>;
}) {
  return (
    <>
      <h3 className="w-full text-start text-base font-medium text-grey">
        قیمت
      </h3>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-col items-center justify-between gap-[6px]">
          <p className="text-sm font-normal text-grey">حداقل</p>
          <div className="w[1px] h-11 border-l border-dashed border-grey-400" />
          <p className="text-sm font-normal text-grey">حداکثر</p>
        </div>
        <div className="flex flex-col items-center justify-around gap-4">
          <Controller
            control={control}
            name="minPrice"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                size="small"
                id="minPrice"
                label="مثلا ۷۰,۰۰۰"
                value={value}
                onChange={(e) => {
                  const lastCharacter = e.target.value.slice(-1);
                  if (!numberInputRegex.test(lastCharacter)) return;

                  const result = Number(
                    englishNumber(e.target.value.replaceAll("٬", "")),
                  ).toLocaleString("fa-ir");

                  onChange(result === "۰" ? "" : result);
                }}
                sx={{
                  width: 226,
                  "& .MuiFormLabel-root": { color: "#8c8c8c" },
                }}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">تومان</InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="maxPrice"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                size="small"
                id="maxPrice"
                label="مثلا ۷۰,۰۰۰"
                value={value}
                onChange={(e) => {
                  const lastCharacter = e.target.value.slice(-1);
                  if (!numberInputRegex.test(lastCharacter)) return;

                  const result = Number(
                    englishNumber(e.target.value.replaceAll("٬", "")),
                  ).toLocaleString("fa-ir");

                  onChange(result === "۰" ? "" : result);
                }}
                sx={{
                  width: 226,
                  "& .MuiFormLabel-root": { color: "#8c8c8c" },
                }}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">تومان</InputAdornment>
                  ),
                }}
              />
            )}
          />
        </div>
      </div>
    </>
  );
}
