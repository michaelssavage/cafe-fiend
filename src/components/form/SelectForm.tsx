import { useEffect, useState } from "react";
import Select, {
  ActionMeta,
  CSSObjectWithLabel,
  GroupBase,
  MultiValue,
  Options,
  SingleValue,
  StylesConfig,
} from "react-select";
import { Flexbox } from "~/styles/Flexbox";

interface SelectI<T> {
  id: string;
  label?: string;
  value: T;
  options: Options<T>;
  onChange: (newValue: SingleValue<T> | MultiValue<T>, actionMeta: ActionMeta<T>) => void;
  styles?: StylesConfig<T, boolean, GroupBase<T>>;
}

const baseStyles = {
  control: (base: CSSObjectWithLabel) => ({
    ...base,
    minHeight: 30,
  }),
  dropdownIndicator: (base: CSSObjectWithLabel) => ({
    ...base,
    padding: 4,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  indicatorsContainer: (base: CSSObjectWithLabel) => ({
    ...base,
    height: "30px",
    cursor: "pointer",
  }),
  valueContainer: (base: CSSObjectWithLabel) => ({
    ...base,
    height: "30px",
    padding: "0 0 0 6px",
    cursor: "pointer",
  }),
  input: (base: CSSObjectWithLabel) => ({
    ...base,
    margin: 0,
  }),
};

export const SelectForm = <T,>({ id, label, value, options, onChange, styles }: SelectI<T>) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Flexbox direction="col">
      {label && (
        <label htmlFor={id} className="text-xs">
          {label}
        </label>
      )}
      {isMounted ? (
        <Select
          inputId={id}
          instanceId={id}
          value={value}
          options={options}
          onChange={onChange}
          styles={{
            ...baseStyles,
            ...styles,
          }}
        />
      ) : (
        <div className="h-[30px] border rounded bg-white flex items-center px-2 text-sm text-gray-500">
          Loading...
        </div>
      )}
    </Flexbox>
  );
};
