import { Textarea } from "@windmill/react-ui";
import React from "react";

const TextAreaCom = ({
  register,
  name,
  label,
  placeholder,
  required,
  type,
  value,
}) => {
  return (
    <>
      <Textarea
        className="border text-sm border-slate-200 focus:border-slate-300 block w-full bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
        {...register(`${name}`, {
          required: required ? `${label} is required!` : false,
        })}
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        rows="4"
        spellCheck="false"
      />
    </>
  );
};

export default TextAreaCom;
