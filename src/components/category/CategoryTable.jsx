import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import { Link } from "react-router-dom";
import { IoRemoveSharp } from "react-icons/io5";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useState } from "react";

//internal import

import CheckBox from "@/components/form/others/CheckBox";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import MainDrawer from "@/components/drawer/MainDrawer";
import CategoryDrawer from "@/components/drawer/CategoryDrawer";
import ShowHideButton from "@/components/table/ShowHideButton";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const CategoryTable = ({
  data,
  lang,
  isCheck,
  categories,
  setIsCheck,
  useParamId,
  showChild,
}) => {
  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  const { showingTranslateValue } = useUtilsFunction();
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (categoryId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  return (
    <>
      {isCheck?.length < 1 && (
        <DeleteModal useParamId={useParamId} id={serviceId} title={title} />
      )}

      <MainDrawer>
        <CategoryDrawer id={serviceId} data={data} lang={lang} />
      </MainDrawer>

      <TableBody>
        {categories?.map((category) => (
          <TableRow
            key={category._id}
            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
          >
            <TableCell>
              <CheckBox
                type="checkbox"
                name="category"
                id={category._id}
                handleClick={handleClick}
                isChecked={isCheck?.includes(category._id)}
              />
            </TableCell>

            <TableCell className="font-semibold uppercase text-xs">
              {category?._id?.substring(20, 24)}
            </TableCell>
            <TableCell className="text-sm font-medium">
              {category.index ?? 0}
            </TableCell>
            <TableCell>
              {category?.icon ? (
                <Avatar
                  className="hidden mr-3 md:block bg-gray-50 border border-gray-200 dark:bg-gray-700 dark:border-gray-600 shadow-sm p-1"
                  src={category?.icon}
                  alt={category?.parent}
                />
              ) : (
                <Avatar
                  src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                  alt="product"
                  className="hidden p-1 mr-2 md:block bg-gray-50 shadow-none"
                />
              )}
            </TableCell>

            <TableCell className="font-medium text-sm">
              {category?.children.length > 0 ? (
                <Link
                  to={`/categories/${category?._id}`}
                  className="text-blue-700 hover:text-blue-800 font-medium transition-colors duration-150"
                >
                  {showingTranslateValue(category?.name)}

                  <>
                    {showChild && (
                      <>
                        {" "}
                        <div className="pl-2 mt-2 space-y-1.5">
                          {category?.children?.map((child) => (
                            <div key={child._id}>
                              <Link
                                to={`/categories/${child?._id}`}
                                className="text-blue-700"
                              >
                                <div className="flex text-xs items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                  <span className="text-xs text-blue-500 pr-2">
                                    <IoRemoveSharp />
                                  </span>
                                  <span>
                                    {showingTranslateValue(child.name)}
                                  </span>
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                </Link>
              ) : (
                <span className="text-gray-700 dark:text-gray-300">
                  {showingTranslateValue(category?.name)}
                </span>
              )}
            </TableCell>
            <TableCell className="text-sm">
              {category?.children && category?.children.length > 0 ? (
                <div>
                  <button
                    onClick={() => toggleRow(category._id)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:scale-105"
                  >
                    {expandedRows[category._id] ? (
                      <FiChevronDown className="w-4 h-4" />
                    ) : (
                      <FiChevronRight className="w-4 h-4" />
                    )}
                    <span className="text-xs">
                      {category.children.length}{" "}
                      {category.children.length === 1
                        ? "Subcategory"
                        : "Subcategories"}
                    </span>
                  </button>
                  {expandedRows[category._id] && (
                    <div className="mt-2 ml-4 space-y-1.5 border-l-2 border-blue-300 dark:border-blue-600 pl-3 animate-slideDown">
                      {category.children.map((child) => (
                        <div
                          key={child._id}
                          className="flex items-center text-xs hover:translate-x-1 transition-transform duration-200"
                        >
                          <span className="text-blue-400 pr-1.5">
                            <IoRemoveSharp />
                          </span>
                          <Link
                            to={`/categories/${child._id}`}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                          >
                            {showingTranslateValue(child.name)}
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-gray-400 text-xs italic">
                  No subcategories
                </span>
              )}
            </TableCell>

            <TableCell className="text-center">
              <ShowHideButton
                id={category._id}
                category
                status={category.status}
              />
            </TableCell>
            <TableCell>
              <EditDeleteButton
                id={category?._id}
                parent={category}
                isCheck={isCheck}
                children={category?.children}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                title={showingTranslateValue(category?.name)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default CategoryTable;
