import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import React, { useContext, useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

//internal import
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import MainDrawer from "@/components/drawer/MainDrawer";
import ProductReviewServices from "@/services/ProductReviewServices";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import AnimatedContent from "@/components/common/AnimatedContent";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";

const ProductComments = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { toggleDrawer } = useContext(SidebarContext);

  const [searchText, setSearchText] = useState("");
  const [productsData, setProductsData] = useState([]);

  const { data, loading, error } = useAsync(
    ProductReviewServices.getAllProductsWithReviews,
  );

  const {
    handleChangePage,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    currentPage,
  } = useFilter(productsData);

  useEffect(() => {
    if (data?.products) {
      setProductsData(data.products);
    }
  }, [data]);

  // Filter products based on search
  useEffect(() => {
    if (searchText) {
      const filtered = data?.products?.filter((product) => {
        const title =
          typeof product.title === "string"
            ? product.title
            : product.title?.en || "";
        return title.toLowerCase().includes(searchText.toLowerCase());
      });
      setProductsData(filtered || []);
    } else {
      setProductsData(data?.products || []);
    }
  }, [searchText, data]);

  const handleViewReviews = (productId) => {
    history.push(`/product-reviews/${productId}`);
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ★
          </span>,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ½
          </span>,
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">
            ★
          </span>,
        );
      }
    }
    return stars;
  };

  return (
    <>
      <PageTitle>{t("ProductComments")}</PageTitle>
      <MainDrawer product />

      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <Input
                  aria-label="Search"
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                  type="search"
                  name="search"
                  placeholder={t("SearchProduct")}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <div className="mt-4 md:mt-0 md:ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Products: {totalResults}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </AnimatedContent>

      {loading ? (
        <TableLoading row={12} col={6} width={160} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>{t("ProductImage")}</TableCell>
                <TableCell>{t("ProductName")}</TableCell>
                <TableCell>{t("TotalReviews")}</TableCell>
                <TableCell>{t("AverageRating")}</TableCell>
                <TableCell className="text-center">{t("Actions")}</TableCell>
              </tr>
            </TableHeader>

            {dataTable?.map((product, i) => {
              const productTitle =
                typeof product.title === "string"
                  ? product.title
                  : product.title?.en || "N/A";

              return (
                <tbody
                  key={product._id}
                  className="bg-white divide-y divide-gray-100 dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                >
                  <tr>
                    <TableCell>
                      <div className="flex items-center">
                        {product.image && product.image[0] ? (
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={product.image[0]}
                            alt={productTitle}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-600" />
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm font-medium">
                        {productTitle}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm">
                        {product.totalReviews || 0}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex text-lg">
                          {renderStars(parseFloat(product.averageRating))}
                        </div>
                        <span className="text-sm font-semibold">
                          {product.averageRating}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-center">
                        <Button
                          onClick={() => handleViewReviews(product._id)}
                          className="p-2 cursor-pointer text-gray-400 hover:text-blue-600"
                          layout="link"
                        >
                          <FiEye className="text-xl" />
                        </Button>
                      </div>
                    </TableCell>
                  </tr>
                </tbody>
              );
            })}
          </Table>

          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Product" />
      )}
    </>
  );
};

export default ProductComments;
