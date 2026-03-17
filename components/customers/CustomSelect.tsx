import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string
  isLeftOnlyRonded?: boolean
};

const CustomSelect = ({ options, value, onChange, placeholder, width, isLeftOnlyRonded }: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /** Close on outside click */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** Focus search when opened */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  /** Filter options */
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <div ref={ref} className={`relative ${width ? width : "w-48"}`}>
      {/* Selected */}
      <div
        onClick={() => setOpen(!open)}
        className={`h-10 px-3 flex items-center justify-between border ${isLeftOnlyRonded ? "rounded-l-lg" : "rounded-lg"} bg-white text-sm shadow-sm cursor-pointer hover:border-slate-400 transition`}
      >
        <span className="text-slate-700 truncate">
          {selectedLabel || "Select"}
        </span>
        <FiChevronDown
          className={`text-slate-400 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg overflow-hidden">

          {/* 🔍 Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b bg-slate-50">
            <FiSearch className="text-slate-400 text-sm" />
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full text-sm bg-transparent focus:outline-none"
            />
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${
                    value === opt.value
                      ? "bg-blue-100 text-blue-600"
                      : ""
                  }`}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="px-3 py-3 text-sm text-slate-400 text-center">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;