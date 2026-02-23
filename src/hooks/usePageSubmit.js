import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import { SidebarContext } from "@/context/SidebarContext";
import PageServices from "@/services/PageServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import useTranslationValue from "./useTranslationValue";

const usePageSubmit = (id) => {
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
    useContext(SidebarContext);
  const [imageUrl, setImageUrl] = useState("");
  const [language, setLanguage] = useState("en");
  const [published, setPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resData, setResData] = useState({});
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const { handlerTextTranslateHandler } = useTranslationValue();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Get HTML from editor
      const contentState = editorState.getCurrentContent();
      const rawContent = convertToRaw(contentState);
      const htmlContent = draftToHtml(rawContent);

      const titleTranslates = await handlerTextTranslateHandler(
        data.title,
        language,
        resData?.title
      );

      const descriptionTranslates = {
        ...resData?.description,
        [language]: htmlContent,
      };

      const metaTitleTranslates = await handlerTextTranslateHandler(
        data.metaTitle || data.title,
        language,
        resData?.metaTitle
      );

      const metaDescriptionTranslates = await handlerTextTranslateHandler(
        data.metaDescription || "",
        language,
        resData?.metaDescription
      );

      const pageData = {
        title: {
          ...titleTranslates,
          [language]: data.title,
        },
        slug: data.slug,
        description: descriptionTranslates,
        metaTitle: {
          ...metaTitleTranslates,
          [language]: data.metaTitle || data.title,
        },
        metaDescription: {
          ...metaDescriptionTranslates,
          [language]: data.metaDescription || "",
        },
        headerBg: imageUrl,
        status: published ? "publish" : "draft",
        published: published,
        lang: language,
      };

      if (id) {
        const res = await PageServices.updatePage(id, pageData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        reset();
      } else {
        const res = await PageServices.addPage(pageData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        reset();
      }
    } catch (err) {
      setIsSubmitting(false);
      notifyError(err ? err?.response?.data?.message : err?.message);
      closeDrawer();
    }
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    if (Object.keys(resData).length > 0) {
      setValue("title", resData.title[lang ? lang : "en"]);
      setValue("metaTitle", resData.metaTitle?.[lang ? lang : "en"] || "");
      setValue(
        "metaDescription",
        resData.metaDescription?.[lang ? lang : "en"] || ""
      );

      // Set editor content for the selected language
      const description = resData.description?.[lang ? lang : "en"] || "";
      if (description) {
        const contentBlock = htmlToDraft(description);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks
          );
          const newEditorState = EditorState.createWithContent(contentState);
          setEditorState(newEditorState);
        }
      }
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setResData({});
      setImageUrl("");
      setValue("title", "");
      setValue("slug", "");
      setValue("metaTitle", "");
      setValue("metaDescription", "");
      setEditorState(EditorState.createEmpty());
      setPublished(false);
      setLanguage("en");
      clearErrors("title");
      clearErrors("slug");
      return;
    }
    if (id) {
      (async () => {
        try {
          const res = await PageServices.getPageById(id);
          if (res) {
            setResData(res);
            setValue("title", res.title[lang ? lang : "en"]);
            setValue("slug", res.slug);
            setValue("metaTitle", res.metaTitle?.[lang ? lang : "en"] || "");
            setValue(
              "metaDescription",
              res.metaDescription?.[lang ? lang : "en"] || ""
            );
            setImageUrl(res.headerBg);
            setPublished(res.published);

            // Set editor content
            const description = res.description?.[lang ? lang : "en"] || "";
            if (description) {
              const contentBlock = htmlToDraft(description);
              if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(
                  contentBlock.contentBlocks
                );
                const newEditorState =
                  EditorState.createWithContent(contentState);
                setEditorState(newEditorState);
              }
            }
          }
        } catch (err) {
          notifyError(err ? err?.response?.data?.message : err?.message);
        }
      })();
    }
  }, [id, setValue, isDrawerOpen, lang, clearErrors]);

  return {
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
  };
};

export default usePageSubmit;
