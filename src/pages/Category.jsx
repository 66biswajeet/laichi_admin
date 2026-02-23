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
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";

//internal import

import useAsync from "@/hooks/useAsync";
import { SidebarContext } from "@/context/SidebarContext";
import CategoryServices from "@/services/CategoryServices";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import useFilter from "@/hooks/useFilter";
import DeleteModal from "@/components/modal/DeleteModal";
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import PageTitle from "@/components/Typography/PageTitle";
import MainDrawer from "@/components/drawer/MainDrawer";
import CategoryDrawer from "@/components/drawer/CategoryDrawer";
import UploadMany from "@/components/common/UploadMany";
import SwitchToggleChildCat from "@/components/form/switch/SwitchToggleChildCat";
import TableLoading from "@/components/preloader/TableLoading";
import CheckBox from "@/components/form/others/CheckBox";
import CategoryTable from "@/components/category/CategoryTable";
import NotFound from "@/components/table/NotFound";
import AnimatedContent from "@/components/common/AnimatedContent";

const Category = () => {
  const { toggleDrawer, lang } = useContext(SidebarContext);

  const { data, loading, error } = useAsync(CategoryServices.getAllCategory);
  const { data: getAllCategories } = useAsync(
    CategoryServices.getAllCategories,
  );

  const { handleDeleteMany, allId, handleUpdateMany, serviceId } =
    useToggleDrawer();

  const { t } = useTranslation();

  const {
    handleSubmitCategory,
    categoryRef,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    handleChangePage,
    filename,
    isDisabled,
    setCategoryType,
    handleSelectFile,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useFilter(data[0]?.children ? data[0]?.children : data);

  // react hooks
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [showChild, setShowChild] = useState(false);

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(data[0]?.children.map((li) => li._id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  // handle reset field function
  const handleResetField = () => {
    setCategoryType("");
    categoryRef.current.value = "";
  };

  // console.log("serviceData", serviceData, "tableData", dataTable);

  return (
    <>
      <PageTitle>{t("Category")}</PageTitle>
      <DeleteModal ids={allId} setIsCheck={setIsCheck} />

      <BulkActionDrawer
        ids={allId}
        title="Categories"
        lang={lang}
        data={data}
        isCheck={isCheck}
      />

      <MainDrawer>
        <CategoryDrawer id={serviceId} data={data} lang={lang} />
      </MainDrawer>

      <AnimatedContent>
        {/* Header Stats Card */}
        <div className="grid gap-4 mb-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-center p-4 bg-white rounded-lg shadow-sm dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="p-3 mr-4 text-blue-600 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Categories
              </p>
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                {data?.length || 0}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-white rounded-lg shadow-sm dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="p-3 mr-4 text-blue-600 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                Active
              </p>
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                {data?.filter((cat) => cat.status === "show")?.length || 0}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-white rounded-lg shadow-sm dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="p-3 mr-4 text-blue-600 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                Sub Categories
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {data?.reduce(
                  (acc, cat) => acc + (cat.children?.length || 0),
                  0,
                ) || 0}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="p-3 mr-4 text-green-600 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                Selected
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {isCheck?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Card */}
        <Card className="min-w-0 shadow-md overflow-hidden bg-white dark:bg-slate-800 mb-5 border border-slate-200 dark:border-slate-700">
          <CardBody>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Category Management
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Manage your product categories and subcategories
                </p>
              </div>

              <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                <div className="flex-1 lg:flex-initial">
                  <UploadMany
                    title="Categories"
                    exportData={getAllCategories}
                    filename={filename}
                    isDisabled={isDisabled}
                    handleSelectFile={handleSelectFile}
                    handleUploadMultiple={handleUploadMultiple}
                    handleRemoveSelectFile={handleRemoveSelectFile}
                  />
                </div>

                <Button
                  disabled={isCheck.length < 1}
                  onClick={() => handleUpdateMany(isCheck)}
                  className="h-12 px-6 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 rounded-lg shadow-sm transition-all duration-200"
                >
                  <span className="mr-2">
                    <FiEdit />
                  </span>
                  {t("BulkAction")}
                </Button>

                <Button
                  disabled={isCheck.length < 1}
                  onClick={() => handleDeleteMany(isCheck)}
                  className="h-12 px-6 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm transition-all duration-200"
                >
                  <span className="mr-2">
                    <FiTrash2 />
                  </span>
                  {t("Delete")}
                </Button>

                <Button
                  onClick={toggleDrawer}
                  className="h-12 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-all duration-200"
                >
                  <span className="mr-2">
                    <FiPlus />
                  </span>
                  {t("AddCategory")}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Search and Filter Card */}
        <Card className="min-w-0 shadow-md overflow-hidden bg-white dark:bg-slate-800 mb-5 border border-slate-200 dark:border-slate-700">
          <CardBody>
            <form
              onSubmit={handleSubmitCategory}
              className="grid gap-4 md:grid-cols-12"
            >
              <div className="md:col-span-8">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">
                  Search Categories
                </label>
                <Input
                  ref={categoryRef}
                  type="search"
                  className="w-full"
                  placeholder="Search by category name or subcategory..."
                />
              </div>

              <div className="md:col-span-4 flex items-end gap-2">
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                  Filter
                </Button>

                <Button
                  layout="outline"
                  onClick={handleResetField}
                  type="reset"
                  className="h-12 px-6 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-200">
                    Reset
                  </span>
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </AnimatedContent>

      <SwitchToggleChildCat
        title=" "
        handleProcess={setShowChild}
        processOption={showChild}
        name={showChild}
      />

      {loading ? (
        <TableLoading row={12} col={6} width={190} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : serviceData?.length !== 0 ? (
        <Card className="shadow-md border border-gray-100 dark:border-gray-700">
          <TableContainer className="mb-8 rounded-lg">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>
                    <CheckBox
                      type="checkbox"
                      name="selectAll"
                      id="selectAll"
                      handleClick={handleSelectAll}
                      isChecked={isCheckAll}
                    />
                  </TableCell>

                  <TableCell>{t("catIdTbl")}</TableCell>
                  <TableCell>Index</TableCell>
                  <TableCell>{t("catIconTbl")}</TableCell>
                  <TableCell>{t("CatTbName")}</TableCell>
                  <TableCell>Sub Category</TableCell>
                  <TableCell className="text-center">
                    {t("catPublishedTbl")}
                  </TableCell>
                  <TableCell className="text-right">
                    {t("catActionsTbl")}
                  </TableCell>
                </tr>
              </TableHeader>

              <CategoryTable
                data={data}
                lang={lang}
                isCheck={isCheck}
                categories={dataTable}
                setIsCheck={setIsCheck}
                showChild={showChild}
              />
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
        </Card>
      ) : (
        <NotFound title="Sorry, There are no categories right now." />
      )}
    </>
  );
};

export default Category;
