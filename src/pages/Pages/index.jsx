import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Input,
  Button,
  Card,
  CardBody,
  Pagination,
} from "@windmill/react-ui";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import useAsync from "@/hooks/useAsync";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import NotFound from "@/components/table/NotFound";
import pagesApi from "@/services/pagesApi";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import DeleteModal from "@/components/modal/DeleteModal";
import TableLoading from "@/components/preloader/TableLoading";
import AnimatedContent from "@/components/common/AnimatedContent";
import PageTable from "@/components/page/PageTable";
import CheckBox from "@/components/form/others/CheckBox";
import PageModalCreate from "./PageModalCreate";

/**
 * Pages list view.
 * Primary CTA "Create Custom Page" opens the quick-create modal (top right).
 * "Full Editor" button navigates directly to /pages/new.
 */
const PagesList = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { title, allId, handleDeleteMany, handleUpdateMany } =
    useToggleDrawer();
  const {
    currentPage,
    handleChangePage,
    searchText,
    searchRef,
    handleSubmitForAll,
    limitData,
  } = useContext(SidebarContext);

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, loading, error } = useAsync(() =>
    pagesApi.getAllPages({
      page: currentPage,
      limit: limitData,
      search: searchText,
    }),
  );

  const handleSelectAll = () => {
    setIsCheckAll((prev) => !prev);
    setIsCheck(!isCheckAll ? (data?.pages || []).map((p) => p._id) : []);
  };

  return (
    <>
      {/* Header row: title + primary CTA */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <PageTitle>Pages</PageTitle>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="rounded-md h-10 bg-blue-600 hover:bg-blue-700 text-sm px-4 flex items-center gap-2"
          aria-label="Create a new custom page"
        >
          <FiPlus className="w-4 h-4" />
          Create Custom Page
        </Button>
      </div>

      {/* Quick-create modal */}
      <PageModalCreate
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Bulk delete modal */}
      <DeleteModal ids={allId} setIsCheck={setIsCheck} title={title} />

      {/* Search + bulk actions */}
      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <form
              onSubmit={handleSubmitForAll}
              className="py-3 md:pb-0 grid gap-4 lg:gap-6 xl:gap-6 xl:flex"
            >
              <div className="flex-grow-0 sm:flex-grow md:flex-grow lg:flex-grow xl:flex-grow">
                <Input
                  ref={searchRef}
                  type="search"
                  name="search"
                  placeholder="Search Pages"
                  aria-label="Search pages"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  <Button
                    disabled={isCheck.length < 1}
                    onClick={() => handleUpdateMany(isCheck)}
                    className="w-full rounded-md h-12 btn-gray text-gray-600"
                    aria-label="Bulk action on selected pages"
                  >
                    <span className="mr-2">
                      <FiEdit />
                    </span>
                    Bulk Action
                  </Button>
                </div>
                <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  <Button
                    disabled={isCheck.length < 1}
                    onClick={() => handleDeleteMany(isCheck, data?.pages)}
                    className="w-full rounded-md h-12 bg-red-300 disabled btn-red"
                    aria-label="Delete selected pages"
                  >
                    <span className="mr-2">
                      <FiTrash2 />
                    </span>
                    Delete
                  </Button>
                </div>
                <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  <Button
                    onClick={() => history.push("/pages/new")}
                    className="w-full rounded-md h-12"
                    aria-label="Open full page editor"
                  >
                    <span className="mr-2">
                      <FiPlus />
                    </span>
                    Full Editor
                  </Button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </AnimatedContent>

      {/* Table */}
      {loading ? (
        <TableLoading row={12} col={6} width={160} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : data?.pages?.length ? (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>
                  <CheckBox
                    type="checkbox"
                    name="selectAll"
                    id="selectAll"
                    isChecked={isCheckAll}
                    handleClick={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell className="text-center">Published</TableCell>
                <TableCell className="text-right">Actions</TableCell>
              </tr>
            </TableHeader>
            <PageTable
              isCheck={isCheck}
              pages={data.pages}
              setIsCheck={setIsCheck}
            />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={data.totalDoc}
              resultsPerPage={limitData}
              onChange={handleChangePage}
              label="Page Navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Page" />
      )}
    </>
  );
};

export default PagesList;
