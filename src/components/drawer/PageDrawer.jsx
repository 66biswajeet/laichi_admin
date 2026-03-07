import React, { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useTranslation } from "react-i18next";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import Title from "@/components/form/others/Title";
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import Uploader from "@/components/image-uploader/Uploader";
import DrawerButton from "@/components/form/button/DrawerButton";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import usePageSubmit from "@/hooks/usePageSubmit";

const PageDrawer = ({ id }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    published,
    setPublished,
    isSubmitting,
    handleSelectLanguage,
    editorState,
    setEditorState,
  } = usePageSubmit(id);

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("UpdatePage")}
            description={t("UpdatePageDescription")}
          />
        ) : (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("AddPage")}
            description={t("AddPageDescription")}
          />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="block">
          <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("PageTitle")} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Page Title"
                  name="title"
                  type="text"
                  placeholder={t("PageTitle")}
                />
                <Error errorName={errors.title} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("PageSlug")} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Page Slug"
                  name="slug"
                  type="text"
                  placeholder={t("PageSlug")}
                />
                <Error errorName={errors.slug} />
                <span className="text-xs text-gray-500 mt-1 block">
                  URL-friendly version (e.g., about-us, contact-us)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("PageDescription")} />
              <div className="col-span-8 sm:col-span-4">
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
                  <Editor
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                    wrapperClassName="wrapper-class"
                    editorClassName="editor-class px-4"
                    toolbarClassName="toolbar-class border-b border-gray-200 dark:border-gray-600"
                    toolbar={{
                      options: [
                        "inline",
                        "blockType",
                        "fontSize",
                        "fontFamily",
                        "list",
                        "textAlign",
                        "colorPicker",
                        "link",
                        "embedded",
                        "emoji",
                        "image",
                        "remove",
                        "history",
                      ],
                      inline: {
                        inDropdown: false,
                        options: [
                          "bold",
                          "italic",
                          "underline",
                          "strikethrough",
                          "monospace",
                          "superscript",
                          "subscript",
                        ],
                      },
                      blockType: {
                        inDropdown: true,
                        options: [
                          "Normal",
                          "H1",
                          "H2",
                          "H3",
                          "H4",
                          "H5",
                          "H6",
                          "Blockquote",
                          "Code",
                        ],
                      },
                      fontSize: {
                        options: [
                          8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72,
                        ],
                      },
                      fontFamily: {
                        options: [
                          "Arial",
                          "Georgia",
                          "Impact",
                          "Tahoma",
                          "Times New Roman",
                          "Verdana",
                          "Courier New",
                          "Roboto",
                        ],
                      },
                      list: {
                        inDropdown: false,
                        options: ["unordered", "ordered", "indent", "outdent"],
                      },
                      textAlign: {
                        inDropdown: false,
                        options: ["left", "center", "right", "justify"],
                      },
                      colorPicker: {
                        colors: [
                          "rgb(97,189,109)", "rgb(26,188,156)", "rgb(84,172,210)",
                          "rgb(44,130,201)", "rgb(147,101,184)", "rgb(71,85,119)",
                          "rgb(204,204,204)", "rgb(65,168,95)", "rgb(0,168,133)",
                          "rgb(61,142,185)", "rgb(41,105,176)", "rgb(85,57,130)",
                          "rgb(40,50,78)", "rgb(0,0,0)", "rgb(247,218,100)",
                          "rgb(251,160,38)", "rgb(235,107,86)", "rgb(226,80,65)",
                          "rgb(163,143,132)", "rgb(239,239,239)", "rgb(255,255,255)",
                          "rgb(250,197,28)", "rgb(243,121,52)", "rgb(209,72,65)",
                          "rgb(184,49,47)", "rgb(124,112,107)", "rgb(209,213,216)",
                        ],
                      },
                      link: {
                        inDropdown: false,
                        options: ["link", "unlink"],
                        defaultTargetOption: "_blank",
                      },
                      embedded: {
                        embedCallback: (link) => link,
                        defaultSize: { height: "auto", width: "auto" },
                      },
                      image: {
                        uploadEnabled: true,
                        previewImage: true,
                        inputAccept:
                          "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                        alt: { present: true, mandatory: false },
                        defaultSize: { height: "auto", width: "auto" },
                      },
                      remove: { icon: undefined, className: undefined },
                      history: {
                        inDropdown: false,
                        options: ["undo", "redo"],
                      },
                    }}
                  />
                </div>
                <Error errorName={errors.description} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("HeaderBackground")} />
              <div className="col-span-8 sm:col-span-4">
                <Uploader
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  folder="page"
                />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("MetaTitle")} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Meta Title"
                  name="metaTitle"
                  type="text"
                  placeholder={t("MetaTitle")}
                />
                <span className="text-xs text-gray-500 mt-1 block">
                  For SEO optimization
                </span>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("MetaDescription")} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Meta Description"
                  name="metaDescription"
                  type="text"
                  placeholder={t("MetaDescription")}
                />
                <span className="text-xs text-gray-500 mt-1 block">
                  For SEO optimization
                </span>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("Published")} />
              <div className="col-span-8 sm:col-span-4">
                <SwitchToggle
                  id="published"
                  title=""
                  handleProcess={setPublished}
                  processOption={published}
                />
              </div>
            </div>
          </div>

          <DrawerButton id={id} title="Page" isSubmitting={isSubmitting} />
        </form>
      </Scrollbars>
    </>
  );
};

export default PageDrawer;
