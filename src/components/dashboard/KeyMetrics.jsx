import { Card, CardBody } from "@windmill/react-ui";
import Skeleton from "react-loading-skeleton";
import { FiClock, FiShoppingBag } from "react-icons/fi";

const KeyMetrics = ({ mode, loading, ordersPending, totalOrders }) => {
  const MetricCard = ({ value, label, icon: Icon, gradient, iconBg }) => {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Decorative background circle */}
        <div
          className={`absolute -top-6 -right-6 w-24 h-24 ${gradient} opacity-10 rounded-full blur-2xl`}
        ></div>

        <div className="relative z-10">
          {/* Icon */}
          <div
            className={`inline-flex items-center justify-center w-12 h-12 ${iconBg} rounded-lg mb-4`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>

          {/* Value */}
          <div className="mb-2">
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white">
              {value}
            </h2>
          </div>

          {/* Label */}
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {label}
          </p>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${gradient} transition-all duration-500`}
              style={{
                width: `${
                  totalOrders > 0 ? (value / totalOrders) * 100 : 100
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <Skeleton
          count={4}
          height={60}
          className="dark:bg-gray-800 bg-gray-200"
          baseColor={`${mode === "dark" ? "#010101" : "#f9f9f9"}`}
          highlightColor={`${mode === "dark" ? "#1a1c23" : "#f8f8f8"}`}
        />
      ) : (
        <Card className="h-full hover:shadow-lg transition-shadow duration-200">
          <CardBody className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg p-6">
            <h3 className="mb-6 text-lg font-semibold text-slate-800 dark:text-slate-100">
              Key Metrics
            </h3>

            <div className="space-y-4">
              <MetricCard
                value={ordersPending || 0}
                label="Orders Pending"
                icon={FiClock}
                gradient="bg-gradient-to-r from-blue-500 to-blue-600"
                iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <MetricCard
                value={totalOrders || 0}
                label="Total Orders"
                icon={FiShoppingBag}
                gradient="bg-gradient-to-r from-slate-600 to-slate-700"
                iconBg="bg-gradient-to-br from-slate-600 to-slate-700"
              />
            </div>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default KeyMetrics;
