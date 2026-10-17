import { SelectOption } from "@/lib/entities/form";

export default function CustomSelector({
  options,
  value,
  error,
  onChange,
}: {
  options: SelectOption[];
  value: string;
  error?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex h-14 w-full flex-row items-center justify-between gap-4">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => {
            onChange(option.value);
          }}
          className={`flex h-full w-full items-center justify-center rounded-md border text-base font-normal ${error ? "border-error bg-white text-error" : value === option.value ? "bg-grey text-white" : "border-grey-200 bg-white text-grey"}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
