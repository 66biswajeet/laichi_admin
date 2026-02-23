import { Avatar, Badge, WindmillContext } from "@windmill/react-ui";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

import {
  FiTrash2,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiSun,
  FiMoon,
  FiBell,
  FiSettings,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ellipse from "@/assets/img/icons/ellipse.svg";
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import useNotification from "@/hooks/useNotification";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import NotFoundTwo from "@/components/table/NotFoundTwo";
import NotificationServices from "@/services/NotificationServices";
import SelectLanguage from "@/components/form/selectOption/SelectLanguage";

const Header = () => {
  const { toggleSidebar, handleLanguageChange, setNavBar, navBar, currLang } =
    useContext(SidebarContext);
  const { state, dispatch } = useContext(AdminContext);
  const { adminInfo } = state;
  const { mode, toggleMode } = useContext(WindmillContext);
  const pRef = useRef();
  const nRef = useRef();

  const { t } = useTranslation();
  const { updated, setUpdated } = useNotification();
  const { showDateTimeFormat } = useUtilsFunction();

  const [data, setData] = useState([]);
  const [totalDoc, setTotalDoc] = useState(0);
  const [totalUnreadDoc, setTotalUnreadDoc] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleLogOut = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("adminInfo");
    window.location.replace(`${import.meta.env.VITE_APP_ADMIN_DOMAIN}/login`);
  };

  const handleNotificationOpen = async () => {
    setNotificationOpen(!notificationOpen);
    setProfileOpen(false);
    await handleGetAllNotifications();
  };

  const handleProfileOpen = () => {
    setProfileOpen(!profileOpen);
    setNotificationOpen(false);
  };

  const handleNotificationStatusChange = async (id) => {
    try {
      await NotificationServices.updateStatusNotification(id, {
        status: "read",
      });

      const getAllRes = await NotificationServices.getAllNotification();
      setData(getAllRes?.notifications);
      setTotalUnreadDoc(getAllRes?.totalUnreadDoc);
      window.location.reload(false);
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    }
  };

  const handleNotificationDelete = async (id) => {
    try {
      await NotificationServices.deleteNotification(id);
      const getAllRes = await NotificationServices.getAllNotification();
      setData(getAllRes?.notifications);
      setTotalUnreadDoc(getAllRes?.totalUnreadDoc);
      setTotalDoc(getAllRes?.totalDoc);
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    }
  };

  const handleGetAllNotifications = async () => {
    try {
      const res = await NotificationServices.getAllNotification();
      setData(res?.notifications);
      setTotalUnreadDoc(res?.totalUnreadDoc);
      setTotalDoc(res?.totalDoc);
      setUpdated(false);
    } catch (err) {
      setUpdated(false);
      notifyError(err?.response?.data?.message || err?.message);
    }
  };

  const renderNotificationItem = (value, index) => {
    return (
      <li
        key={index + 1}
        className={`flex justify-between items-center font-serif font-normal text-sm py-3 border-b border-slate-100 dark:border-slate-700 px-3 transition-colors duration-150 hover:bg-slate-50 ${
          value.status === "unread" && "bg-slate-50"
        } hover:text-slate-800 dark:text-slate-300 ${
          value.status === "unread" && "dark:bg-slate-800"
        } dark:hover:bg-slate-800 dark:hover:text-slate-100 cursor-pointer`}
      >
        <Link
          to={
            value.productId
              ? `/product/${value.productId}`
              : value.orderId
                ? `/order/${value.orderId}`
                : "/our-staff"
          }
          className="flex items-center"
          onClick={() => handleNotificationStatusChange(value._id)}
        >
          <Avatar
            className="mr-2 md:block bg-slate-50 border border-slate-200 dark:bg-slate-700 dark:border-slate-600"
            src={value.image}
            alt="image"
          />

          <div className="notification-content">
            <h6 className="font-medium text-slate-600 dark:text-slate-300">
              {value?.message}
            </h6>

            <p className="flex items-center text-xs text-slate-400 dark:text-slate-500">
              {value.productId ? (
                <Badge type="danger">Stock Out</Badge>
              ) : (
                <Badge type="success">New Order</Badge>
              )}
              <span className="ml-2">
                {showDateTimeFormat(value.createdAt)}
              </span>
            </p>
          </div>

          {value.status === "unread" && (
            <span className="px-2 focus:outline-none">
              <img
                src={ellipse}
                width={12}
                height={12}
                alt="ellipse"
                className="w-3 h-3 text-blue-500"
              />
            </span>
          )}
        </Link>

        <div className="group inline-block relative">
          <button
            type="button"
            onClick={() => handleNotificationDelete(value._id)}
            className="px-2 group-hover:text-blue-500 text-slate-400 hover:text-blue-600 focus:outline-none"
          >
            <FiTrash2 />
          </button>

          <div className="absolute hidden group-hover:inline-block bg-slate-50 dark:text-red-400 mr-6 mb-1 right-0 z-50 px-3 py-2 text-sm font-medium text-red-600 rounded-lg shadow-sm tooltip dark:bg-slate-700">
            Delete
          </div>
        </div>
      </li>
    );
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!pRef?.current?.contains(e.target)) {
        setProfileOpen(false);
      }
      if (!nRef?.current?.contains(e.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [pRef, nRef]);

  useEffect(() => {
    handleGetAllNotifications();
  }, [updated]);

  return (
    <header className="z-50 py-4 bg-white shadow-sm dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-slate-700 dark:text-slate-300">
        <button
          type="button"
          onClick={() => setNavBar(!navBar)}
          className="hidden lg:block outline-0 focus:outline-none"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        <button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <FiMenu className="w-6 h-6" aria-hidden="true" />
        </button>
        <span></span>

        <ul className="flex justify-end items-center flex-shrink-0 space-x-6">
          <li className="flex">
            <button
              className="rounded-md focus:outline-none"
              onClick={toggleMode}
              aria-label="Toggle color mode"
            >
              {mode === "dark" ? (
                <FiSun className="w-5 h-5" aria-hidden="true" />
              ) : (
                <FiMoon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </li>

          <li className="relative inline-block text-left" ref={nRef}>
            <button
              className="relative align-middle rounded-md focus:outline-none"
              onClick={handleNotificationOpen}
            >
              <FiBell
                className="w-5 h-5 text-slate-700 dark:text-slate-300"
                aria-hidden="true"
              />

              <span className="absolute z-10 top-0 right-0 inline-flex items-center justify-center p-1 h-5 w-5 text-xs font-medium leading-none text-white transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full">
                {totalUnreadDoc}
              </span>
            </button>

            {notificationOpen && (
              <div className="origin-top-right absolute md:right-0 -right-3 top-12 rounded-md shadow-lg bg-white dark:bg-slate-800 focus:outline-none z-50 border border-slate-200 dark:border-slate-700">
                <div
                  className={`${
                    data?.length === 0
                      ? "h-40"
                      : data?.length <= 2
                        ? "h-40"
                        : data?.length <= 3
                          ? "h-56"
                          : "h-330"
                  } md:w-400 w-300`}
                >
                  <Scrollbars>
                    {data?.length === 0 ? (
                      <NotFoundTwo title="No new notification" />
                    ) : (
                      <ul className="block text-sm border-t border-slate-200 dark:border-slate-700 rounded-md">
                        {data?.map(renderNotificationItem)}
                      </ul>
                    )}

                    {totalDoc > 5 && (
                      <div className="text-center py-2">
                        <Link
                          onClick={() => setNotificationOpen(false)}
                          to={"/notifications"}
                          className="focus:outline-none hover:underline transition ease-out duration-200 text-blue-600 dark:text-blue-400"
                        >
                          Show all notifications
                        </Link>
                      </div>
                    )}
                  </Scrollbars>
                </div>
              </div>
            )}
          </li>

          <li className="relative inline-block text-left" ref={pRef}>
            <button
              className="rounded-full dark:bg-slate-600 bg-blue-500 text-white h-8 w-8 font-medium mx-auto focus:outline-none hover:bg-blue-600 dark:hover:bg-slate-500 transition-colors"
              onClick={handleProfileOpen}
            >
              {adminInfo.image ? (
                <Avatar
                  className="align-middle"
                  src={`${adminInfo.image}`}
                  aria-hidden="true"
                />
              ) : (
                <span>{adminInfo.email[0].toUpperCase()}</span>
              )}
            </button>

            {profileOpen && (
              <ul className="origin-top-right absolute right-0 top-12 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-800 focus:outline-none z-50 border border-slate-200 dark:border-slate-700">
                <li className="justify-between font-serif font-medium py-2 pl-4 transition-colors duration-150 hover:bg-slate-50 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400">
                  <Link to="/dashboard">
                    <span className="flex items-center text-sm">
                      <FiGrid className="w-4 h-4 mr-3" aria-hidden="true" />
                      <span>{t("Dashboard")}</span>
                    </span>
                  </Link>
                </li>

                <li className="justify-between font-serif font-medium py-2 pl-4 transition-colors duration-150 hover:bg-slate-50 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400">
                  <Link to="/edit-profile">
                    <span className="flex items-center text-sm">
                      <FiSettings className="w-4 h-4 mr-3" aria-hidden="true" />
                      <span>{t("EditProfile")}</span>
                    </span>
                  </Link>
                </li>

                <li
                  onClick={handleLogOut}
                  className="cursor-pointer justify-between font-serif font-medium py-2 pl-4 transition-colors duration-150 hover:bg-slate-50 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400"
                >
                  <span className="flex items-center text-sm">
                    <FiLogOut className="w-4 h-4 mr-3" aria-hidden="true" />
                    <span>{t("LogOut")}</span>
                  </span>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
