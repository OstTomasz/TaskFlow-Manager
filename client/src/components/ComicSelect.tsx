import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";

interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface ComicSelectProps<T extends string> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  error?: string;
}

export const ComicSelect = <T extends string>({
  options,
  value,
  onChange,
  error,
}: ComicSelectProps<T>) => {
  const selected = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className="relative w-full mb-2">
      <Listbox value={value} onChange={onChange}>
        <ListboxButton className="comic-input w-full flex items-center justify-between">
          <span>{selected.label}</span>
          <ChevronDown className="w-4 h-4" />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          className="comic-panel w-(--button-width) z-50 mt-1 p-1 focus:outline-none"
        >
          {options.map((opt) => (
            <ListboxOption
              key={opt.value}
              value={opt.value}
              className="px-3 py-2 rounded-md cursor-pointer text-sm font-medium
                  data-focus:bg-amber data-focus:text-ink"
            >
              {opt.label}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};
