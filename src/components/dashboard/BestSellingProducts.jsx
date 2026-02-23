import { Card, CardBody } from "@windmill/react-ui";
import Skeleton from "react-loading-skeleton";

const BestSellingProducts = ({ mode, loading, products }) => {
  // Default products if none provided
  const defaultProducts = [
    { name: "Slimming Tea", color: "bg-blue-500", count: "3k" },
    {
      name: "Protein Powder Energy Bars",
      color: "bg-blue-600",
      count: "2.5k",
    },
  ];

  const displayProducts =
    products && products.length > 0 ? products : defaultProducts;

  return (
    <>
      {loading ? (
        <Skeleton
          count={3}
          height={60}
          className="dark:bg-gray-800 bg-gray-200"
          baseColor={`${mode === "dark" ? "#010101" : "#f9f9f9"}`}
          highlightColor={`${mode === "dark" ? "#1a1c23" : "#f8f8f8"}`}
        />
      ) : (
        <Card className="h-full">
          <CardBody className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h3 className="mb-6 text-lg font-semibold text-gray-700 dark:text-gray-200">
              Best Selling Products
            </h3>

            <div className="space-y-4">
              {displayProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${
                        product.color ||
                        (index === 0 ? "bg-blue-700" : "bg-blue-600")
                      }`}
                    ></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {product.name || product._id}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {product.count || product.count || "0"}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default BestSellingProducts;
