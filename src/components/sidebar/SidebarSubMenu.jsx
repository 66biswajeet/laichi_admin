import React, { useState } from "react";
import { NavLink, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IoChevronDownOutline,
  IoChevronForwardOutline,
  IoRemoveSharp,
} from "react-icons/io5";

const SidebarSubMenu = ({ route }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <li className="relative px-4 py-2 mx-2" key={route.name}>
        <button
          className="inline-flex items-center justify-between focus:outline-none w-full text-sm font-semibold transition-all duration-200 text-slate-300 hover:text-blue-400 hover:bg-slate-800 rounded-lg px-3 py-3 group"
          onClick={() => setOpen(!open)}
          aria-haspopup="true"
        >
          <span className="inline-flex items-center">
            <route.icon
              className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
              aria-hidden="true"
            />
            <span className="ml-4">{t(`${route.name}`)}</span>
          </span>
          <span
            className={`transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          >
            <IoChevronDownOutline className="w-4 h-4" />
          </span>
        </button>
        {open && (
          <ul
            className="mt-2 ml-3 space-y-1 overflow-hidden text-sm font-medium border-l-2 border-slate-700 pl-4 animate-slideDown"
            aria-label="submenu"
          >
            {route.routes.map((child, i) => (
              <li key={i + 1} className="relative">
                {child?.outside ? (
                  <a
                    href={import.meta.env.VITE_APP_STORE_DOMAIN}
                    target="_blank"
                    className="flex items-center font-serif py-2 px-3 text-sm rounded-md transition-all duration-200 hover:bg-slate-800 hover:translate-x-1 group"
                    rel="noreferrer"
                  >
                    <Route path={child.path} exact={child.exact}>
                      <span
                        className="absolute left-0 w-0.5 h-full bg-blue-500 rounded-r"
                        aria-hidden="true"
                      ></span>
                    </Route>
                    <span className="flex items-center justify-center w-1.5 h-1.5 mr-3 bg-blue-400 rounded-full group-hover:bg-blue-500 transition-colors duration-200"></span>
                    <span className="text-slate-400 group-hover:text-slate-200 transition-colors duration-200">
                      {t(`${child.name}`)}
                    </span>
                  </a>
                ) : (
                  <NavLink
                    to={child.path}
                    className="flex items-center font-serif py-2 px-3 text-sm rounded-md transition-all duration-200 hover:bg-slate-800 hover:translate-x-1 group"
                    activeClassName="bg-slate-800"
                    rel="noreferrer"
                  >
                    <Route path={child.path} exact={route.exact}>
                      <span
                        className="absolute -left-4 w-0.5 h-full bg-blue-500 rounded-r"
                        aria-hidden="true"
                      ></span>
                    </Route>
                    <span className="flex items-center justify-center w-1.5 h-1.5 mr-3 bg-blue-400 rounded-full group-hover:bg-blue-500 transition-colors duration-200"></span>
                    <span className="text-slate-400 group-hover:text-slate-200 transition-colors duration-200">
                      {t(`${child.name}`)}
                    </span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    </>
  );
};

export default SidebarSubMenu;
