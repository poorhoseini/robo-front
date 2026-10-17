"use client";

import { compressImage } from "@/lib/helpers/compressImage.helper";
import { Button } from "@mui/material";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { FieldError } from "react-hook-form";
import Spinner from "./Spinner";

export default function UploadButton({
  label,
  value,
  type = "image",
  onChange,
  error,
  loading = false,
  required = false,
  fullWidth = false,
  compress = false,
}: {
  label: string;
  value: File | string | undefined;
  type?: "excel" | "image";
  onChange: (...event: any[]) => void;
  error?: FieldError;
  loading?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  compress?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string>();

  useEffect(() => {
    if (typeof value === "string") {
      setPreviewImage(value);
    }
    if (typeof value === "object") {
      setPreviewImage(URL.createObjectURL(value));
    }
  }, [value]);

  const handleUploadClick = () => {
    inputRef?.current?.click();
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> | undefined = async (
    e,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "image") {
      const compressed = await compressImage(file, 1); // 1MB max
      onChange(compress ? compressed : file);
    } else if (type === "excel") {
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (!validTypes.includes(file.type)) {
        alert("فقط فایل با فرمت اکسل قابل قبول می باشد!");
        return;
      }

      onChange(file);
    }
  };

  const handleRemoveImage = () => {
    onChange("");
  };

  return (
    <>
      <input
        className="hidden"
        ref={inputRef}
        type="file"
        accept={
          type === "excel"
            ? ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "image/jpeg, image/png"
        }
        onChange={handleChange}
        onClick={(event) => {
          const element = event.target as HTMLInputElement;
          element.value = "";
        }}
      />
      <div className="flex flex-col items-start">
        {/* <p
          className={`mb-4 text-sm leading-6 font-normal ${!!error ? "text-error" : "text-gray-30"}`}
        >
          {label + (required ? "*" : "")}
        </p> */}
        <div
          className={`flex w-full flex-row items-end justify-between gap-2 ${error?.message ? "" : ""}`}
        >
          <div
            className={`flex h-14 cursor-pointer items-center justify-center rounded-lg border border-dashed bg-grey px-6 py-4 ${!!error ? "border-error" : "border-grey"} ${fullWidth ? "w-full" : "w-44"}`}
            style={{
              ...(!!previewImage &&
                type === "image" && {
                  backgroundImage: `url('${previewImage}')`,
                  backgroundSize: "cover",
                }),
            }}
            onClick={handleUploadClick}
          >
            {loading ? (
              <Spinner />
            ) : (
              //<img src="/icons/upload.svg" alt="" width={16} height={16} />
              <p
                className={`text-sm font-normal leading-6 ${!!error ? "text-error" : "text-white"}`}
              >
                {label + (required ? "*" : "")}
              </p>
            )}
          </div>
          {!!value && (
            <Button
              className="h-11 text-sm font-medium leading-6"
              type="button"
              // size="large"
              // variant="text"
              color="error"
              onClick={handleRemoveImage}
              // sx={{ height: 44 }}
              // startIcon={
              //   <Image
              //     src={"/icons/garbage.svg"}
              //     alt=""
              //     width={18}
              //     height={18}
              //   />
              // }
            >
              {type === "excel" ? "حذف فایل" : "حذف تصویر"}
            </Button>
          )}
        </div>
        {/* {!!error?.message && (
          <FormHelperText error>{error.message}</FormHelperText>
        )} */}
      </div>
    </>
  );
}
