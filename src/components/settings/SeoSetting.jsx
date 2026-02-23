import { Button } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { FiSettings, FiCopy, FiCheck } from "react-icons/fi";
import { useState } from "react";

//internal import
import Error from "@/components/form/others/Error";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import InputAreaTwo from "@/components/form/input/InputAreaTwo";
import Uploader from "@/components/image-uploader/Uploader";
import TextAreaCom from "@/components/form/others/TextAreaCom";
import SettingServices from "@/services/SettingServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const SeoSetting = ({
  errors,
  register,
  isSave,
  favicon,
  setFavicon,
  metaImg,
  setMetaImg,
  isSubmitting,
}) => {
  const { t } = useTranslation();

  // Sitemap generator state
  const [sitemapUrls, setSitemapUrls] = useState("");
  const [generatedSitemapUrl, setGeneratedSitemapUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateSitemap = async () => {
    if (!sitemapUrls.trim()) {
      return notifyError("Please enter at least one URL");
    }

    try {
      setIsGenerating(true);
      const urlList = sitemapUrls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      if (urlList.length === 0) {
        return notifyError("Please enter valid URLs");
      }

      const response = await SettingServices.generateSitemap({ urls: urlList });
      setGeneratedSitemapUrl(response.sitemapUrl);
      notifySuccess("Sitemap generated successfully!");
    } catch (error) {
      notifyError(error?.response?.data?.message || "Failed to generate sitemap");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopySitemapUrl = () => {
    navigator.clipboard.writeText(generatedSitemapUrl);
    setCopied(true);
    notifySuccess("Sitemap URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="sticky top-0 z-20 flex justify-end">
        {isSubmitting ? (
          <Button disabled={true} type="button" className="h-10 px-6">
            <img
              src={spinnerLoadingImage}
              alt="Loading"
              width={20}
              height={10}
            />{" "}
            <span className="font-serif ml-2 font-light">
              {" "}
              {t("Processing")}
            </span>
          </Button>
        ) : (
          <Button type="submit" className="h-10 px-6 ">
            {" "}
            {isSave ? t("SaveBtn") : t("UpdateBtn")}
          </Button>
        )}
      </div>
      <div className="grid grid-cols-12 font-sans">
        <div className="col-span-12 md:col-span-12 lg:col-span-12 mr-3 ">
          <div className="inline-flex md:text-lg text-base text-gray-800 font-semibold dark:text-gray-400 mb-3 relative">
            <FiSettings className="mt-1 mr-2" />
            Seo Settings
          </div>

          <hr className="md:mb-12 mb-2" />
          <div className="lg:px-6 pt-4 lg:pl-40 lg:pr-40 md:pl-5 md:pr-5 flex-grow scrollbar-hide w-full max-h-full pb-0">
            <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">
                {t("Favicon")}
              </label>
              <div className="sm:col-span-3">
                <Uploader imageUrl={favicon} setImageUrl={setFavicon} />
              </div>
            </div>
            <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">
                {t("MetaTitle")}
              </label>
              <div className="sm:col-span-3">
                <InputAreaTwo
                  register={register}
                  label={t("MetaTitle")}
                  name="meta_title"
                  type="text"
                  placeholder={t("MetaTitle")}
                />
                <Error errorName={errors.meta_title} />
              </div>
            </div>
            <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">
                {t("MetaDescription")}
              </label>
              <div className="sm:col-span-3">
                <TextAreaCom
                  required={true}
                  register={register}
                  label={t("MetaDescription")}
                  name="meta_description"
                  type="text"
                  placeholder={t("MetaDescription")}
                />
                <Error errorName={errors.meta_description} />
              </div>
            </div>
            <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">
                {t("MetaUrl")}
              </label>
              <div className="sm:col-span-3">
                <InputAreaTwo
                  register={register}
                  label={t("MetaUrl")}
                  name="meta_url"
                  type="text"
                  placeholder={t("MetaUrl")}
                />
                <Error errorName={errors.meta_url} />
              </div>
            </div>
            <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">
                {t("MetaKeyword")}
              </label>
              <div className="sm:col-span-3">
                <TextAreaCom
                  register={register}
                  label={t("MetaKeyword")}
                  name="meta_keywords"
                  type="text"
                  placeholder={t("MetaKeyword")}
                />
                <Error errorName={errors.meta_keywords} />
              </div>
            </div>
            <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">
                {t("MetaImage")}
              </label>
              <div className="sm:col-span-3">
                <Uploader imageUrl={metaImg} setImageUrl={setMetaImg} />
              </div>
            </div>

            {/* XML Sitemap Generator */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="inline-flex md:text-lg text-base text-gray-800 font-semibold dark:text-gray-400 mb-6 relative">
                <FiSettings className="mt-1 mr-2" />
                XML Sitemap Generator
              </div>

              <div className="grid md:grid-cols-5 sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">
                  Page URLs
                </label>
                <div className="sm:col-span-3">
                  <textarea
                    value={sitemapUrls}
                    onChange={(e) => setSitemapUrls(e.target.value)}
                    placeholder="Enter complete URLs (one per line)&#10;Example:&#10;https://example.com/&#10;https://example.com/about&#10;https://example.com/products"
                    className="w-full px-3 py-2 text-sm leading-5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-blue-400 dark:focus:border-blue-500"
                    rows="8"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Enter the complete URLs you want to include in the sitemap (one per line)
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-5 sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <div className="sm:col-span-2"></div>
                <div className="sm:col-span-3">
                  <Button
                    type="button"
                    onClick={handleGenerateSitemap}
                    disabled={isGenerating}
                    className="w-full sm:w-auto"
                  >
                    {isGenerating ? (
                      <>
                        <img
                          src={spinnerLoadingImage}
                          alt="Loading"
                          width={20}
                          height={10}
                          className="inline mr-2"
                        />
                        Generating...
                      </>
                    ) : (
                      "Generate XML Sitemap"
                    )}
                  </Button>
                </div>
              </div>

              {generatedSitemapUrl && (
                <div className="grid md:grid-cols-5 sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">
                    Generated Sitemap URL
                  </label>
                  <div className="sm:col-span-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={generatedSitemapUrl}
                        readOnly
                        className="flex-1 px-3 py-2 text-sm leading-5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
                      />
                      <Button
                        type="button"
                        onClick={handleCopySitemapUrl}
                        layout="outline"
                        className="flex items-center gap-2"
                      >
                        {copied ? (
                          <>
                            <FiCheck className="text-green-500" />
                            Copied
                          </>
                        ) : (
                          <>
                            <FiCopy />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                      ✓ Sitemap generated successfully! You can now use this URL in your robots.txt or submit to search engines.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeoSetting;
