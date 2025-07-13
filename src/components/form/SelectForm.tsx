import Select, {
  ActionMeta,
  CSSObjectWithLabel,
  GroupBase,
  MultiValue,
  Options,
  SingleValue,
  StylesConfig,
} from "react-select";
import { Flexbox } from "~/styles/global.styles";

interface SelectI<T> {
  id: string;
  label?: string;
  value: T;
  options: Options<T>;
  onChange: (
    newValue: SingleValue<T> | MultiValue<T>,
    actionMeta: ActionMeta<T>
  ) => void;
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

export const SelectForm = <T,>({
  id,
  label,
  value,
  options,
  onChange,
  styles,
}: SelectI<T>) => {
  return (
    <Flexbox gap="4px" direction="row" align="center">
      {label && <label htmlFor={id}>{label}: </label>}
      <Select
        inputId={id}
        value={value}
        options={options}
        onChange={onChange}
        styles={{
          ...baseStyles,
          ...styles,
        }}
      />
    </Flexbox>
  );
};
