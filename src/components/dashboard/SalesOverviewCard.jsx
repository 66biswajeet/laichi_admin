import { Card, CardBody } from "@windmill/react-ui";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const SalesOverviewCard = ({
  mode,
  loading,
  todayCash,
  todayCard,
  todayCredit,
  todayOnline,
  totalAmount,
  totalOrders,
}) => {
  const { t } = useTranslation();
  const { currency, getNumberTwo } = useUtilsFunction();
  const [activeTab, setActiveTab] = useState("Cash");

  const tabs = [
    { name: "Cash", value: todayCash || 0 },
    { name: "Card", value: todayCard || 0 },
    { name: "Credit", value: todayCredit || 0 },
    { name: "Online", value: todayOnline || 0 },
  ];

  return (
    <>
      {loading ? (
        <Skeleton
          count={6}
          height={40}
          className="dark:bg-gray-800 bg-gray-200"
          baseColor={`${mode === "dark" ? "#010101" : "#f9f9f9"}`}
          highlightColor={`${mode === "dark" ? "#1a1c23" : "#f8f8f8"}`}
        />
      ) : (
        <Card className="h-full hover:shadow-lg transition-shadow duration-200">
          <CardBody className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              Total Sales Overview
            </h3>

            {/* Main Sales Section */}
            <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-xl p-6 mb-4 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="text-white">
                  <p className="text-sm opacity-90 mb-1">Total Orders</p>
                  <h2 className="text-3xl font-bold">All-Time Sales</h2>
                </div>
                <div className="text-white text-right">
                  <p className="text-sm opacity-90 mb-1">Total Orders</p>
                  <h2 className="text-2xl font-bold">
                    {currency}
                    {getNumberTwo(totalAmount || 0)}
                  </h2>
                </div>
              </div>

              {/* Tabs */}
              <div className="grid grid-cols-4 gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md ${
                      activeTab === tab.name
                        ? "bg-blue-500 text-white shadow-lg scale-105"
                        : "bg-slate-600 text-slate-100 hover:bg-slate-500 hover:shadow-lg hover:scale-105"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Today's Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Today Orders */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                      <svg
                        className="w-5 h-5 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Total_00
                      </p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {currency}
                        {getNumberTwo(
                          tabs.find((t) => t.name === activeTab)?.value || 0,
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Today Orders
                    </p>
                  </div>
                </div>
              </div>

              {/* This Month */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-600/30 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-slate-600 dark:text-slate-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Total_00
                      </p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {currency}
                        {getNumberTwo(0)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      This Month
                    </p>
                  </div>
                </div>
              </div>

              {/* This Month (duplicate for layout) */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                      <svg
                        className="w-5 h-5 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Total_00
                      </p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {currency}
                        {getNumberTwo(0)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      This Month
                    </p>
                  </div>
                </div>
              </div>

              {/* This Month (another duplicate) */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Total_00
                      </p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {currency}
                        {getNumberTwo(0)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      This Month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default SalesOverviewCard;
