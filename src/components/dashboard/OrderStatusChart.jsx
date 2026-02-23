import { Card, CardBody } from "@windmill/react-ui";
import Skeleton from "react-loading-skeleton";
import { Doughnut } from "react-chartjs-2";

const OrderStatusChart = ({ mode, loading, orderStatusData }) => {
  const chartData = {
    labels: [
      "Total",
      "Total Orders",
      "Pending Preorder (25%)",
      "Private Preorder (17%)",
      "Delivered",
    ],
    datasets: [
      {
        data: [
          orderStatusData?.total || 20,
          orderStatusData?.totalOrders || 15,
          orderStatusData?.pendingPreorder || 10,
          orderStatusData?.privatePreorder || 8,
          orderStatusData?.delivered || 30,
        ],
        backgroundColor: [
          "#1e293b", // Slate-800
          "#3b82f6", // Blue-500
          "#60a5fa", // Blue-400
          "#64748b", // Slate-500
          "#475569", // Slate-600
        ],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const legendItems = [
    { color: "#1e293b", label: "Total" },
    { color: "#3b82f6", label: "Total Orders" },
    { color: "#60a5fa", label: "Pending Preorder (25%)" },
    { color: "#64748b", label: "Private Preorder (17%)" },
    { color: "#475569", label: "Delivered" },
  ];

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
              Order Status
            </h3>

            <div className="flex flex-col items-center">
              <div className="w-48 h-48 mb-6">
                <Doughnut data={chartData} options={chartOptions} />
              </div>

              <div className="w-full space-y-2">
                {legendItems.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <span
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default OrderStatusChart;
