import React from "react";
import { TableCell, TableBody } from "@windmill/react-ui";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { format } from "date-fns";

import MainModal from "@/components/modal/MainModal";
import MainDrawer from "@/components/drawer/MainDrawer";
import PageDrawer from "@/components/drawer/PageDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import CheckBox from "@/components/form/others/CheckBox";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const PageTable = ({ pages, isCheck, setIsCheck }) => {
  const { serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  const { showingTranslateValue } = useUtilsFunction();

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  return (
    <>
      <DeleteModal id={serviceId} title="Selected Page" />

      <MainDrawer>
        <PageDrawer id={serviceId} />
      </MainDrawer>

      <TableBody>
        {pages?.map((page, i) => (
          <tr key={page._id}>
            <TableCell>
              <CheckBox
                type="checkbox"
                name={page?.title?.en}
                id={page._id}
                handleClick={handleClick}
                isChecked={isCheck?.includes(page._id)}
              />
            </TableCell>

            <TableCell className="font-semibold uppercase text-xs">
              {showingTranslateValue(page?.title)}
            </TableCell>

            <TableCell className="text-sm">
              <span className="text-gray-700 dark:text-gray-400">
                {page?.slug}
              </span>
            </TableCell>

            <TableCell className="text-xs">
              <span
                className={`inline-flex px-2 text-xs font-medium leading-5 rounded-full ${
                  page.status === "publish"
                    ? "text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-100"
                    : "text-blue-500 bg-blue-100 dark:text-white dark:bg-blue-800"
                }`}
              >
                {page.status}
              </span>
            </TableCell>

            <TableCell className="text-sm">
              {page.createdAt
                ? format(new Date(page.createdAt), "MMM dd, yyyy")
                : "N/A"}
            </TableCell>

            <TableCell className="text-center">
              <span
                className={`inline-flex px-2 text-xs font-medium leading-5 rounded-full ${
                  page.published
                    ? "text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-100"
                    : "text-red-500 bg-red-100 dark:text-red-100 dark:bg-red-800"
                }`}
              >
                {page.published ? "Yes" : "No"}
              </span>
            </TableCell>

            <TableCell>
              <div className="flex justify-end text-right">
                <button
                  className="p-2 cursor-pointer text-gray-400 hover:text-emerald-600"
                  onClick={() => handleUpdate(page._id)}
                >
                  <FiEdit />
                </button>
                <button
                  className="p-2 cursor-pointer text-gray-400 hover:text-red-600"
                  onClick={() => handleModalOpen(page._id, page?.title?.en)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </TableCell>
          </tr>
        ))}
      </TableBody>
    </>
  );
};

export default PageTable;
