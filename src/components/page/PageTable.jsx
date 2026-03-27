import React from "react";
import { TableCell, TableBody } from "@windmill/react-ui";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { format } from "date-fns";
import { useHistory } from "react-router-dom";

import useToggleDrawer from "@/hooks/useToggleDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import CheckBox from "@/components/form/others/CheckBox";

const PageTable = ({ pages, isCheck, setIsCheck }) => {
  const history = useHistory();
  const { serviceId, handleModalOpen } = useToggleDrawer();

  return (
    <>
      <DeleteModal id={serviceId} title="Selected Page" />

      <TableBody>
        {pages?.map((page) => (
          <tr key={page._id}>
            <TableCell>
              <CheckBox
                type="checkbox"
                name={page?._id}
                id={page._id}
                handleClick={(e) => {
                  const { id, checked } = e.target;
                  setIsCheck(
                    checked
                      ? [...isCheck, id]
                      : isCheck.filter((i) => i !== id),
                  );
                }}
                isChecked={isCheck?.includes(page._id)}
              />
            </TableCell>

            <TableCell className="font-semibold text-xs uppercase">
              {typeof page?.title === "string"
                ? page.title
                : page?.title?.en || "—"}
            </TableCell>

            <TableCell className="text-sm">
              <span className="text-gray-700 dark:text-gray-400">
                {page?.slug}
              </span>
            </TableCell>

            <TableCell className="text-xs">
              <span
                className={`inline-flex px-2 text-xs font-medium leading-5 rounded-full ${
                  page.status === "published"
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
                  className="p-2 cursor-pointer text-gray-400 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded"
                  onClick={() => history.push(`/pages/${page._id}/edit`)}
                  aria-label={`Edit ${typeof page?.title === "string" ? page.title : page?.title?.en}`}
                >
                  <FiEdit />
                </button>
                <button
                  className="p-2 cursor-pointer text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
                  onClick={() =>
                    handleModalOpen(
                      page._id,
                      typeof page?.title === "string"
                        ? page.title
                        : page?.title?.en,
                    )
                  }
                  aria-label={`Delete ${typeof page?.title === "string" ? page.title : page?.title?.en}`}
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
