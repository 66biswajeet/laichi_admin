import React, { useContext } from "react";

//internal import
import { SidebarContext } from "@/context/SidebarContext";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const SelectLanguageTwo = ({ handleSelectLanguage, register }) => {
  const { languages, langError, langLoading } = useUtilsFunction();
  const { lang } = useContext(SidebarContext);

  // console.log("lang", lang, "data", data);

  return (
    <>
      <select
        name="language"
        {...register(`language`, {
          required: `language is required!`,
        })}
        onChange={(e) => handleSelectLanguage(e.target.value)}
        className="block w-20 h-10 border border-blue-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 text-sm dark:text-slate-300 focus:outline-none rounded-md form-select focus:bg-white dark:focus:bg-slate-700"
      >
        <option value={lang} defaultChecked hidden>
          {lang}
        </option>
        {!langError &&
          !langLoading &&
          languages?.map((lang) => (
            <option key={lang._id} value={lang.iso_code}>
              {lang.iso_code}{" "}
            </option>
          ))}
      </select>
    </>
  );
};

export default SelectLanguageTwo;
