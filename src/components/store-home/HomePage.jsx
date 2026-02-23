import { Button, WindmillContext } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import {
  FiSettings,
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { useContext, useState } from "react";
import { MultiSelect } from "react-multi-select-component";

import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Tabs as TabsComponent,
} from "react-tabs";

//internal import
import Error from "@/components/form/others/Error";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import Uploader from "@/components/image-uploader/Uploader";
import InputAreaTwo from "@/components/form/input/InputAreaTwo";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import TextAreaCom from "@/components/form/others/TextAreaCom";
import SelectProductLimit from "@/components/form/selectOption/SelectProductLimit";

const HomePage = ({
  register,
  errors,
  coupons,
  headerLogo,
  setHeaderLogo,
  sliderImage,
  setSliderImage,
  sliderImageTwo,
  setSliderImageTwo,
  sliderImageThree,
  setSliderImageThree,
  sliderImageFour,
  setSliderImageFour,
  sliderImageFive,
  setSliderImageFive,
  placeholderImage,
  setPlaceHolderImage,
  quickSectionImage,
  setQuickSectionImage,
  heroImage,
  setHeroImage,
  getYourDailyNeedImageLeft,
  setGetYourDailyNeedImageLeft,
  getYourDailyNeedImageRight,
  setGetYourDailyNeedImageRight,
  footerLogo,
  setFooterLogo,
  paymentImage,
  setPaymentImage,
  isSave,
  isCoupon,
  isSliderFullWidth,
  setIsCoupon,
  setIsSliderFullWidth,
  featuredCategories,
  setFeaturedCategories,
  popularProducts,
  setPopularProducts,
  setQuickDelivery,
  quickDelivery,
  setLatestDiscounted,
  latestDiscounted,
  setDailyNeeds,
  dailyNeeds,
  setFeaturePromo,
  featurePromo,
  setFooterBlock1,
  footerBlock1,
  setFooterBlock2,
  footerBlock2,
  setFooterBlock3,
  footerBlock3,
  setFooterBlock4,
  footerBlock4,
  setFooterSocialLinks,
  footerSocialLinks,
  setFooterPaymentMethod,
  footerPaymentMethod,
  allowPromotionBanner,
  setAllowPromotionBanner,
  isSubmitting,
  setLeftRightArrow,
  leftRightArrow,
  setBottomDots,
  bottomDots,
  setBothSliderOption,
  bothSliderOption,
  getButton1image,
  setGetButton1image,
  getButton2image,
  setGetButton2image,
  setFooterBottomContact,
  footerBottomContact,
  setCategoriesMenuLink,
  categoriesMenuLink,
  setAboutUsMenuLink,
  aboutUsMenuLink,
  setContactUsMenuLink,
  contactUsMenuLink,
  setOffersMenuLink,
  offersMenuLink,
  setFaqMenuLink,
  faqMenuLink,
  setPrivacyPolicyMenuLink,
  privacyPolicyMenuLink,
  setTermsConditionsMenuLink,
  termsConditionsMenuLink,
  setServiceMenuLink,
  serviceMenuLink,
  setHelpMenuLink,
  helpMenuLink,
  serviceElements,
  setServiceElements,
  helpElements,
  setHelpElements,
  handleAddServiceElement,
  handleRemoveServiceElement,
  handleServiceElementImageChange,
  handleAddHelpElement,
  handleRemoveHelpElement,
  handleHelpElementImageChange,
  couponList,
  setCouponList,
  showcaseEnabled,
  setShowcaseEnabled,
  showcaseRightImage,
  setShowcaseRightImage,
  testimonialsEnabled,
  setTestimonialsEnabled,
  testimonialsList,
  setTestimonialsList,
  handleAddTestimonial,
  handleRemoveTestimonial,
  handleToggleTestimonialVerified,
  ctaHeroEnabled,
  setCtaHeroEnabled,
  ctaHeroBgImage,
  setCtaHeroBgImage,
  featuredCategoryImages,
  setFeaturedCategoryImages,
  handleFeaturedCategoryImageChange,
  footerLinks,
  setFooterLinks,
  handleAddFooterLink,
  handleRemoveFooterLink,
  handleFooterLinkChange,
}) => {
  const { mode } = useContext(WindmillContext);
  const { t } = useTranslation();
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const [isFeaturedExpanded, setIsFeaturedExpanded] = useState(false);
  const [isPopularExpanded, setIsPopularExpanded] = useState(false);
  const [isTestimonialsExpanded, setIsTestimonialsExpanded] = useState(false);
  const [isCtaHeroExpanded, setIsCtaHeroExpanded] = useState(false);
  const [isLatestDiscountExpanded, setIsLatestDiscountExpanded] =
    useState(false);
  const [isFooterExpanded, setIsFooterExpanded] = useState(false);
  // track which category uploader is open
  const [uploaderVisible, setUploaderVisible] = useState({});

  // console.log("mode", mode);

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

      {/*  ====================================================== Header ====================================================== */}
      <div className="col-span-12 md:col-span-12 lg:col-span-12">
        <div
          className="inline-flex md:text-lg text-base text-white font-semibold mb-0 cursor-pointer items-center w-full justify-between bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md"
          onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
        >
          <div className="flex items-center">
            <FiSettings className="mt-1 mr-2" />
            {t("Header")}
          </div>
          {isHeaderExpanded ? (
            <FiChevronUp className="text-xl" />
          ) : (
            <FiChevronDown className="text-xl" />
          )}
        </div>

        <hr className="md:mb-6 mb-3" />

        {isHeaderExpanded && (
          <div className="flex-grow scrollbar-hide w-full max-h-full xl:px-10 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-4 mt-2 shadow-sm">
            <div className="inline-flex md:text-base text-sm my-3 text-gray-500 dark:text-gray-400">
              <strong>{t("HeaderContacts")}</strong>
            </div>
            <hr className="md:mb-12 mb-3" />

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("HeaderText")}
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label={t("HeaderText")}
                  name="help_text"
                  type="text"
                  placeholder={t("weAreAvailable")}
                />
                <Error errorName={errors.help_text} />
                {/* Homepage Hero Settings */}
                <div className="inline-flex md:text-base text-sm my-3 text-gray-500 dark:text-gray-400">
                  <strong>Homepage Hero</strong>
                </div>
                <hr className="md:mb-6 mb-3" />
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Hero Title
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Hero Title"
                      name="hero_title"
                      type="text"
                      placeholder="Enter hero title"
                    />
                    <Error errorName={errors.hero_title} />
                  </div>
                </div>
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Hero Subtitle
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Hero Subtitle"
                      name="hero_subtitle"
                      type="text"
                      placeholder="Enter hero subtitle"
                    />
                    <Error errorName={errors.hero_subtitle} />
                  </div>
                </div>
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Primary Button Label
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Primary Button Label"
                      name="hero_primary_label"
                      type="text"
                      placeholder="Design Now"
                    />
                    <Error errorName={errors.hero_primary_label} />
                  </div>
                </div>
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Primary Button Link
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Primary Button Link"
                      name="hero_primary_link"
                      type="text"
                      placeholder="/design"
                    />
                    <Error errorName={errors.hero_primary_link} />
                  </div>
                </div>
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Secondary Button Label
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Secondary Button Label"
                      name="hero_secondary_label"
                      type="text"
                      placeholder="Talk with an expert"
                    />
                    <Error errorName={errors.hero_secondary_label} />
                  </div>
                </div>
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Secondary Button Link
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Secondary Button Link"
                      name="hero_secondary_link"
                      type="text"
                      placeholder="/contact"
                    />
                    <Error errorName={errors.hero_secondary_link} />
                  </div>
                </div>
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Feature One
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Feature One"
                      name="hero_feature_one"
                      type="text"
                      placeholder="Free Delivery"
                    />
                    <Error errorName={errors.hero_feature_one} />
                  </div>
                </div>
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Feature Two
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Feature Two"
                      name="hero_feature_two"
                      type="text"
                      placeholder="Rush Delivery"
                    />
                    <Error errorName={errors.hero_feature_two} />
                  </div>
                </div>
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Feature Three
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Feature Three"
                      name="hero_feature_three"
                      type="text"
                      placeholder="Talk with an expert"
                    />
                    <Error errorName={errors.hero_feature_three} />
                  </div>
                </div>
                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Hero Image
                  </label>
                  <div className="sm:col-span-4">
                    <Uploader
                      imageUrl={heroImage}
                      setImageUrl={setHeroImage}
                      targetWidth={1200}
                      targetHeight={600}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("PhoneNumber")}
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label={t("PhoneNumber")}
                  name="phone_number"
                  type="text"
                  placeholder="+01234560352"
                />
                <Error errorName={errors.phone_number} />
              </div>
            </div>
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
              <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("HeaderLogo")}
              </label>
              <div className="sm:col-span-4">
                <Uploader
                  imageUrl={headerLogo}
                  setImageUrl={setHeaderLogo}
                  targetWidth={87}
                  targetHeight={25}
                />
              </div>
            </div>
          </div>
        )}

        {/*  ================= Menu Editor  ======================== */}
        {
          <div className="grid md:grid-cols-5 sm:grid-cols-6 scrollbar-hide w-full max-h-full pb-0">
            <div className="md:col-span-1 sm:col-span-2"></div>
            <div className="sm:col-span-4 md:pl-3 sm:pl-2">
              <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400 relative">
                <strong>{t("MenuEditor")}</strong>
              </div>

              <hr className="md:mb-12 mb-3" />

              <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <div className="col-span-4">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {t("Categories")} / Products
                  </label>
                  <InputAreaTwo
                    register={register}
                    label={t("Categories")}
                    name="categories"
                    type="text"
                    placeholder={t("Categories")}
                  />
                  <Error errorName={errors.categories} />
                </div>
              </div>

              <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <div>
                  <h4 className="font-medium font-serif md:text-base text-sm mb-2 dark:text-gray-300">
                    {t("Categories")} / Products
                  </h4>

                  <SwitchToggle
                    title={""}
                    handleProcess={setCategoriesMenuLink}
                    processOption={categoriesMenuLink}
                  />
                </div>
                <div>
                  <h4 className="font-medium font-serif md:text-base text-sm mb-2 dark:text-gray-300">
                    Service
                  </h4>

                  <SwitchToggle
                    title={""}
                    handleProcess={setServiceMenuLink}
                    processOption={serviceMenuLink}
                  />
                </div>
                <div>
                  <h4 className="font-medium font-serif md:text-base text-sm mb-2 dark:text-gray-300">
                    Help
                  </h4>

                  <SwitchToggle
                    title={""}
                    handleProcess={setHelpMenuLink}
                    processOption={helpMenuLink}
                  />
                </div>
              </div>

              {/* Service Configuration */}
              {serviceMenuLink && (
                <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Service Configuration
                  </h3>

                  <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <div className="col-span-12 md:col-span-6">
                      <label className="block md:text-sm text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Display Name
                      </label>
                      <InputAreaTwo
                        register={register}
                        label="Service Display Name"
                        name="service_display_name"
                        type="text"
                        placeholder="Enter service display name"
                      />
                      <Error errorName={errors.service_display_name} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        Service Elements
                      </h4>
                      <Button
                        type="button"
                        onClick={handleAddServiceElement}
                        className="px-4 py-2 text-sm"
                      >
                        + Add Element
                      </Button>
                    </div>

                    {serviceElements?.map((element, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-3 p-4 mb-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
                      >
                        <div className="col-span-12 md:col-span-4">
                          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Element Name
                          </label>
                          <InputAreaTwo
                            register={register}
                            label="Element Name"
                            name={`service_element_name_${index}`}
                            type="text"
                            placeholder="Element name"
                          />
                        </div>
                        <div className="col-span-12 md:col-span-3">
                          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Image
                          </label>
                          <Uploader
                            imageUrl={element.image}
                            setImageUrl={(url) =>
                              handleServiceElementImageChange(index, url)
                            }
                            targetWidth={200}
                            targetHeight={200}
                          />
                        </div>
                        <div className="col-span-12 md:col-span-4">
                          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Page Link
                          </label>
                          <InputAreaTwo
                            register={register}
                            label="Page Link"
                            name={`service_element_link_${index}`}
                            type="text"
                            placeholder="/page-url"
                          />
                        </div>
                        <div className="col-span-12 md:col-span-1 flex items-end">
                          <Button
                            type="button"
                            onClick={() => handleRemoveServiceElement(index)}
                            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Help Configuration */}
              {helpMenuLink && (
                <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Help Configuration
                  </h3>

                  <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <div className="col-span-12 md:col-span-6">
                      <label className="block md:text-sm text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Display Name
                      </label>
                      <InputAreaTwo
                        register={register}
                        label="Help Display Name"
                        name="help_display_name"
                        type="text"
                        placeholder="Enter help display name"
                      />
                      <Error errorName={errors.help_display_name} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        Help Elements
                      </h4>
                      <Button
                        type="button"
                        onClick={handleAddHelpElement}
                        className="px-4 py-2 text-sm"
                      >
                        + Add Element
                      </Button>
                    </div>

                    {helpElements?.map((element, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-3 p-4 mb-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
                      >
                        <div className="col-span-12 md:col-span-4">
                          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Element Name
                          </label>
                          <InputAreaTwo
                            register={register}
                            label="Element Name"
                            name={`help_element_name_${index}`}
                            type="text"
                            placeholder="Element name"
                          />
                        </div>
                        <div className="col-span-12 md:col-span-3">
                          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Image
                          </label>
                          <Uploader
                            imageUrl={element.image}
                            setImageUrl={(url) =>
                              handleHelpElementImageChange(index, url)
                            }
                            targetWidth={200}
                            targetHeight={200}
                          />
                        </div>
                        <div className="col-span-12 md:col-span-4">
                          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Page Link
                          </label>
                          <InputAreaTwo
                            register={register}
                            label="Page Link"
                            name={`help_element_link_${index}`}
                            type="text"
                            placeholder="/page-url"
                          />
                        </div>
                        <div className="col-span-12 md:col-span-1 flex items-end">
                          <Button
                            type="button"
                            onClick={() => handleRemoveHelpElement(index)}
                            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        }

        {/*  ================== Menu Editor ======================== */}
      </div>

      {/*  ====================================================== Main Slider ====================================================== */}
      {/*  ====================================================== Main Slider (commented out) ====================================================== */}
      {false && (
        <div className="col-span-12 md:col-span-12 lg:col-span-12 mt-5">
          <div className="inline-flex md:text-lg text-base text-gray-800 font-semibold dark:text-gray-400 mb-3">
            <FiSettings className="mt-1 mr-2" /> {t("MainSlider")}
          </div>

          <hr className="mb-3" />

          <div className="flex-grow scrollbar-hide w-full max-h-full xl:px-10">
            <TabsComponent>
              <Tabs>
                <TabList>
                  <Tab>{t("Slider")} 1</Tab>
                  <Tab>{t("Slider")} 2</Tab>
                  <Tab>{t("Slider")} 3</Tab>
                  <Tab>{t("Slider")} 4</Tab>
                  <Tab>{t("Slider")} 5</Tab>
                  <Tab>{t("Options")}</Tab>
                </TabList>

                <TabPanel className="md:mt-10 mt-3">
                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                    <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderImages")}
                    </label>
                    <div className="sm:col-span-4">
                      <Uploader
                        imageUrl={sliderImage}
                        setImageUrl={setSliderImage}
                        targetWidth={1200}
                        targetHeight={200}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                    <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 ">
                      {t("SliderTitle")}
                    </label>
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={true}
                        register={register}
                        label={t("SliderTitle")}
                        name="slider_title"
                        type="text"
                        placeholder={t("SliderTitle")}
                      />
                      <Error errorName={errors.slider_title} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                    <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderDescription")}
                    </label>
                    <div className="sm:col-span-4">
                      <TextAreaCom
                        required={true}
                        register={register}
                        label="Slider Description"
                        name="slider_description"
                        type="text"
                        placeholder="Slider Description"
                      />
                      <Error errorName={errors.slider_description} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                    <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderButtonName")}
                    </label>
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={true}
                        register={register}
                        label={t("SliderButtonName")}
                        name="slider_button_name"
                        type="text"
                        placeholder={t("SliderButtonName")}
                      />
                      <Error errorName={errors.slider_button_name} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                    <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderButtonLink")}
                    </label>
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={true}
                        register={register}
                        label="Slider Button Link"
                        name="slider_button_link"
                        type="text"
                        placeholder="Slider Button Link"
                      />
                      <Error errorName={errors.slider_button_link} />
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderImages")}
                    </label>
                    <div className="sm:col-span-4">
                      <Uploader
                        imageUrl={sliderImageTwo}
                        setImageUrl={setSliderImageTwo}
                        targetWidth={1200}
                        targetHeight={200}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderTitle")}
                    </label>
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Slider Title"
                        name="slider_title_two"
                        type="text"
                        placeholder={t("SliderTitle")}
                      />
                      <Error errorName={errors.slider_title_two} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderDescription")}
                    </label>
                    <div className="sm:col-span-4">
                      <TextAreaCom
                        register={register}
                        label="Slider Description Two"
                        name="slider_description_two"
                        type="text"
                        placeholder={t("SliderDescription")}
                      />
                      <Error errorName={errors.slider_description_two} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderButtonName")}
                    </label>
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Slider Button Name"
                        name="slider_button_name_two"
                        type="text"
                        placeholder={t("SliderButtonName")}
                      />
                      <Error errorName={errors.slider_button_name_two} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderButtonLink")}
                    </label>
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Slider Button Link"
                        name="slider_button_link_two"
                        type="text"
                        placeholder={t("SliderButtonLink")}
                      />
                      <Error errorName={errors.slider_button_link_two} />
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderImages")}
                    </label>
                    <div className="sm:col-span-4">
                      <Uploader
                        imageUrl={sliderImageThree}
                        setImageUrl={setSliderImageThree}
                        targetWidth={1200}
                        targetHeight={200}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderTitle")}
                    </label>
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label=" Slider Title"
                        name="slider_title_three"
                        type="text"
                        placeholder={t("SliderTitle")}
                      />
                      <Error errorName={errors.slider_title_three} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderDescription")}
                    </label>
                    <div className="sm:col-span-4">
                      <TextAreaCom
                        register={register}
                        label="Slider Description"
                        name="slider_description_three"
                        type="text"
                        placeholder={t("SliderDescription")}
                      />

                      <Error errorName={errors.slider_description_three} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderButtonName")}
                    </label>
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Slider Button Name"
                        name="slider_button_name_three"
                        type="text"
                        placeholder={t("SliderButtonName")}
                      />
                      <Error errorName={errors.slider_button_name_three} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderButtonLink")}
                    </label>
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Slider Button Link"
                        name="slider_button_link_three"
                        type="text"
                        placeholder={t("SliderButtonLink")}
                      />
                      <Error errorName={errors.slider_button_link_three} />
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderImages")}
                    </label>
                    <div className="sm:col-span-4">
                      <Uploader
                        imageUrl={sliderImageFour}
                        setImageUrl={setSliderImageFour}
                        targetWidth={1200}
                        targetHeight={200}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderTitle")}
                    </label>
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label=" Slider Title"
                        name="slider_title_four"
                        type="text"
                        placeholder={t("SliderTitle")}
                      />
                      <Error errorName={errors.slider_title_four} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderDescription")}
                    </label>
                    <div className="sm:col-span-4">
                      <TextAreaCom
                        register={register}
                        label="Slider Description"
                        name="slider_description_four"
                        type="text"
                        placeholder={t("SliderDescription")}
                      />
                      <Error errorName={errors.slider_description_four} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderButtonName")}
                    </label>
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Slider Button Name"
                        name="slider_button_name_four"
                        type="text"
                        placeholder={t("SliderButtonName")}
                      />
                      <Error errorName={errors.slider_button_name_four} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderButtonLink")}
                    </label>
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Slider Button Link"
                        name="slider_button_link_four"
                        type="text"
                        placeholder={t("SliderButtonLink")}
                      />
                      <Error errorName={errors.slider_button_link_four} />
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderImages")}
                    </label>
                    <div className="sm:col-span-4">
                      <Uploader
                        imageUrl={sliderImageFive}
                        setImageUrl={setSliderImageFive}
                        targetWidth={1200}
                        targetHeight={200}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderTitle")}
                    </label>
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label=" Slider Title"
                        name="slider_title_five"
                        type="text"
                        placeholder={t("SliderTitle")}
                      />
                      <Error errorName={errors.slider_title_five} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderDescription")}
                    </label>
                    <div className="sm:col-span-4">
                      <TextAreaCom
                        register={register}
                        label="Slider Description"
                        name="slider_description_five"
                        type="text"
                        placeholder={t("SliderDescription")}
                      />
                      <Error errorName={errors.slider_description_five} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderButtonName")}
                    </label>
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Slider Button Name"
                        name="slider_button_name_five"
                        type="text"
                        placeholder={t("SliderButtonName")}
                      />
                      <Error errorName={errors.slider_button_name_five} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("SliderButtonLink")}
                    </label>
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Slider Button Link"
                        name="slider_button_link_five"
                        type="text"
                        placeholder={t("SliderButtonLink")}
                      />
                      <Error errorName={errors.slider_button_link_five} />
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="grid md:grid-cols-3 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                    <div>
                      <div className="relative">
                        <h4 className="font-medium md:text-base text-sm mb-2 dark:text-gray-400">
                          {" "}
                          {t("LeftRighArrows")}
                        </h4>
                      </div>
                      <SwitchToggle
                        title={""}
                        handleProcess={setLeftRightArrow}
                        processOption={leftRightArrow}
                      />
                    </div>
                    <div>
                      <div className="relative">
                        <h4 className="font-medium md:text-base text-sm mb-2 dark:text-gray-400">
                          {t("BottomDots")}
                        </h4>
                      </div>
                      <SwitchToggle
                        title={""}
                        handleProcess={setBottomDots}
                        processOption={bottomDots}
                      />
                    </div>
                    <div>
                      <div className="relative">
                        <h4 className="font-medium md:text-base text-sm mb-2 dark:text-gray-400">
                          {t("Both")}
                        </h4>
                      </div>
                      <SwitchToggle
                        title={""}
                        handleProcess={setBothSliderOption}
                        processOption={bothSliderOption}
                      />
                    </div>
                  </div>
                </TabPanel>
              </Tabs>
            </TabsComponent>
          </div>
        </div>
      )}

      {/*  ======================================================Discount Coupon Code Box ====================================================== */}
      {/*  ======================================================Discount Coupon Code Box (commented out) ====================================================== */}
      {false && (
        <div className="col-span-12 md:col-span-12 lg:col-span-12 mt-5">
          <div className="inline-flex md:text-lg text-base text-gray-800 font-semibold dark:text-gray-400 mb-3">
            <FiSettings className="mt-1 mr-2" />
            {t("DiscountCouponTitle1")}
          </div>

          <hr className="md:mb-12 mb-3" />

          <div className="xl:px-10 flex-grow scrollbar-hide w-full max-h-full">
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("ShowHide")}
              </label>
              <div className="sm:col-span-4">
                <SwitchToggle
                  title=""
                  handleProcess={setIsCoupon}
                  processOption={isCoupon}
                  name="isCoupon"
                />
              </div>
            </div>

            <div
              className={`grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 relative transition-2`}
              style={{
                height: isCoupon ? "auto" : 0,
                transition: "ease-out 0.4s",

                visibility: !isCoupon ? "hidden" : "visible",
                opacity: !isCoupon ? "0" : "1",
              }}
            >
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("HomePageDiscountTitle")}
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label={t("HomePageDiscountTitle")}
                  name="discount_title"
                  type="text"
                  placeholder={t("HomePageDiscountTitle")}
                />
                <Error errorName={errors.phone_number} />
              </div>
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("SuperDiscountActiveCouponCode")}
              </label>
              <div className="sm:col-span-4">
                <MultiSelect
                  options={coupons}
                  value={couponList}
                  className={mode}
                  onChange={(v) => setCouponList(v)}
                  labelledBy="Select Coupon"
                />
              </div>
            </div>

            <div
              style={{
                height: isCoupon
                  ? "auto"
                  : isSliderFullWidth
                    ? "auto"
                    : isSliderFullWidth
                      ? "auto"
                      : "auto",
                transition: "all 0.5s",
                visibility: isCoupon ? "hidden" : "visible",
                opacity: isCoupon ? "0" : "1",
              }}
            >
              <div>
                <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400">
                  <div className="relative">
                    <strong>{t("SliderFullWidth")}</strong>
                  </div>
                </div>

                <hr className="mb-4 mt-2" />

                <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 ">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {t("SliderFullWidth")}
                  </label>
                  <div className="sm:col-span-4 ">
                    <SwitchToggle
                      title=""
                      handleProcess={setIsSliderFullWidth}
                      processOption={isSliderFullWidth}
                      name={isSliderFullWidth}
                    />
                  </div>
                </div>
              </div>

              {!isSliderFullWidth && !isCoupon && (
                <div>
                  <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400 mt-5 ">
                    <div className="relative">
                      <strong> {t("PlaceHolderImage")} </strong>
                    </div>
                  </div>
                  <hr className="mb-4 mt-2" />

                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mt-4 md:mb-6 mb-3 pb-2">
                    <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {t("PlaceHolderImage")}
                    </label>
                    <div className="sm:col-span-4">
                      <Uploader
                        imageUrl={placeholderImage}
                        setImageUrl={setPlaceHolderImage}
                      />
                      <div className="text-xs text-center text-gray-400">
                        <em>( {t("ImagesResolution")} )</em>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/*  ====================================================== Promotion Banner ===================================================== */}
      {/*  ====================================================== Promotion Banner (commented out) ====================================================== */}
      {false && (
        <div className="col-span-12 md:col-span-12 lg:col-span-12">
          <div className="inline-flex md:text-lg text-base text-gray-800 font-semibold dark:text-gray-400 mb-3 md:mt-0 mt-10">
            <FiSettings className="mt-1 mr-2" /> {t("PromotionBanner")}
          </div>

          <hr className="md:mb-12 mb-3" />

          <div className="xl:px-10 flex-grow scrollbar-hide w-full max-h-full pb-0">
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("EnableThisBlock")}
              </label>
              <div className="sm:col-span-4">
                <SwitchToggle
                  title=""
                  handleProcess={setAllowPromotionBanner}
                  processOption={allowPromotionBanner}
                  name={allowPromotionBanner}
                />
              </div>
            </div>

            <div
              style={{
                height: allowPromotionBanner ? "auto" : 0,
                transition: "all 0.4s",
                visibility: !allowPromotionBanner ? "hidden" : "visible",
                opacity: !allowPromotionBanner ? "0" : "1",
              }}
            >
              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {t("Title")}
                </label>
                <div className="sm:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="Title"
                    name="promotion_title"
                    type="text"
                    placeholder={t("Title")}
                  />
                  <Error errorName={errors.promotion_title} />
                </div>
              </div>

              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {t("Description")}
                </label>
                <div className="sm:col-span-4">
                  <TextAreaCom
                    register={register}
                    label="Promotion Description"
                    name="promotion_description"
                    type="text"
                    placeholder={t("PromotionDescription")}
                  />

                  <Error errorName={errors.promotion_description} />
                </div>
              </div>

              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {t("ButtonName")}
                </label>
                <div className="sm:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="Button Name"
                    name="promotion_button_name"
                    type="text"
                    placeholder={t("ButtonName")}
                  />
                  <Error errorName={errors.promotion_button_name} />
                </div>
              </div>

              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {t("ButtonLink")}
                </label>
                <div className="sm:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="Button Link "
                    name="promotion_button_link"
                    type="text"
                    placeholder="https://InfotechIndia-store.vercel.app/search?category=fruits-vegetable&_id=632aca2b4d87ff2494210be8"
                  />
                  <Error errorName={errors.promotion_button_link} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*  ====================================================== Featured Categories ====================================================== */}
      <div className="col-span-12 md:col-span-12 lg:col-span-12 md:mt-0 mt-15">
        <div
          className="inline-flex md:text-lg text-base text-white font-semibold mb-0 cursor-pointer items-center w-full justify-between bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md"
          onClick={() => setIsFeaturedExpanded(!isFeaturedExpanded)}
        >
          <div className="flex items-center">
            <FiSettings className="mt-1 mr-2" /> {t("FeaturedCategories")}
          </div>
          {isFeaturedExpanded ? (
            <FiChevronUp className="text-xl" />
          ) : (
            <FiChevronDown className="text-xl" />
          )}
        </div>

        <hr className="md:mb-12 mb-3" />

        <div
          className={`xl:px-10 flex-grow scrollbar-hide w-full max-h-full pb-0 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-4 mt-2 shadow-sm ${isFeaturedExpanded ? "" : "hidden"}`}
        >
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {t("EnableThisBlock")}
            </label>
            <div className="sm:col-span-4">
              <SwitchToggle
                title=""
                handleProcess={setFeaturedCategories}
                processOption={featuredCategories}
                name={featuredCategories}
              />
            </div>
          </div>

          <div
            style={{
              height: featuredCategories ? "auto" : 0,
              transition: "all 0.5s",
              visibility: !featuredCategories ? "hidden" : "visible",
              opacity: !featuredCategories ? "0" : "1",
            }}
          >
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("Title")}
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="feature_title"
                  type="text"
                  placeholder={t("Title")}
                />
                <Error errorName={errors.feature_title} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("FeaturedCategories")}
              </label>
              <div className="sm:col-span-4">
                <TextAreaCom
                  register={register}
                  label="Feature Description"
                  name="feature_description"
                  type="text"
                  placeholder={t("FeaturedCategories")}
                />

                <Error errorName={errors.feature_description} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("ProductsLimit")}
              </label>
              <div className="sm:col-span-4">
                <SelectProductLimit
                  register={register}
                  required={true}
                  label="Feature Products Limit"
                  name="feature_product_limit"
                />
                <Error errorName={errors.feature_product_limit} />
              </div>
            </div>

            {/* Category Featured Images Section */}
            {featuredCategoryImages &&
              Object.keys(featuredCategoryImages).length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                    Category Featured Images (Homepage Display)
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                    Upload custom images for each category to display on the
                    homepage featured section. These are different from the
                    category icons shown in the navbar.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.keys(featuredCategoryImages).map((categoryId) => {
                      const categoryData = featuredCategoryImages[categoryId];
                      const hasImage =
                        categoryData.image && categoryData.image.trim() !== "";
                      const isUploaderOpen = uploaderVisible[categoryId];

                      return (
                        <div
                          key={categoryId}
                          className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-3 shadow-sm"
                        >
                          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            {categoryData.name}
                          </h4>

                          {!hasImage && !isUploaderOpen ? (
                            <div
                              onClick={() =>
                                setUploaderVisible((s) => ({
                                  ...s,
                                  [categoryId]: true,
                                }))
                              }
                              style={{
                                minHeight: "200px",
                                border: "3px dashed #9CA3AF",
                                borderRadius: "8px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.3s",
                                backgroundColor:
                                  mode === "dark" ? "#374151" : "#F9FAFB",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#3B82F6";
                                e.currentTarget.style.backgroundColor =
                                  mode === "dark" ? "#4B5563" : "#EFF6FF";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "#9CA3AF";
                                e.currentTarget.style.backgroundColor =
                                  mode === "dark" ? "#374151" : "#F9FAFB";
                              }}
                            >
                              <svg
                                className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Upload Image
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Click to browse
                              </p>
                            </div>
                          ) : (
                            <div>
                              <Uploader
                                imageUrl={categoryData.image}
                                setImageUrl={(url) => {
                                  handleFeaturedCategoryImageChange(
                                    categoryId,
                                    url,
                                  );
                                  // hide uploader after image is set
                                  setUploaderVisible((s) => ({
                                    ...s,
                                    [categoryId]: false,
                                  }));
                                }}
                                targetWidth={600}
                                targetHeight={600}
                              />
                            </div>
                          )}

                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Recommended: 600x600px
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
          </div>

          {/* <div className="flex flex-row-reverse pb-6">
                  <Button type="submit" className="h-10 px-6">
                    Save
                  </Button>
                </div> */}
        </div>
      </div>

      {/*  ====================================================== Popular Products ====================================================== */}
      <div className="col-span-12 md:col-span-12 lg:col-span-12 md:mt-0 mt-15">
        <div
          className="inline-flex md:text-lg text-base text-white font-semibold mb-0 cursor-pointer items-center w-full justify-between bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md"
          onClick={() => setIsPopularExpanded(!isPopularExpanded)}
        >
          <div className="flex items-center">
            <FiSettings className="mt-1 mr-2" />
            {t("PopularProductsTitle")}
          </div>
          {isPopularExpanded ? (
            <FiChevronUp className="text-xl" />
          ) : (
            <FiChevronDown className="text-xl" />
          )}
        </div>

        <hr className="md:mb-12 mb-3" />

        <div
          className={`xl:px-10 flex-grow scrollbar-hide w-full max-h-full pb-0 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-4 mt-2 shadow-sm ${isPopularExpanded ? "" : "hidden"}`}
        >
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {t("EnableThisBlock")}
            </label>
            <div className="sm:col-span-4">
              <SwitchToggle
                title=""
                handleProcess={setPopularProducts}
                processOption={popularProducts}
                name={popularProducts}
              />
            </div>
          </div>

          <div
            style={{
              height: popularProducts ? "auto" : 0,
              transition: "all 0.5s",
              visibility: !popularProducts ? "hidden" : "visible",
              opacity: !popularProducts ? "0" : "1",
            }}
          >
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("Title")}
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="popular_title"
                  type="text"
                  placeholder={t("Title")}
                />
                <Error errorName={errors.popular_title} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("Description")}
              </label>
              <div className="sm:col-span-4">
                <TextAreaCom
                  register={register}
                  label="Popular Description"
                  name="popular_description"
                  type="text"
                  placeholder={t("PopularDescription")}
                />
                <Error errorName={errors.popular_description} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("ProductsLimit")}
              </label>
              <div className="sm:col-span-4">
                <SelectProductLimit
                  register={register}
                  required={true}
                  label="Popular Products Limit"
                  name="popular_product_limit"
                />
                <Error errorName={errors.popular_product_limit} />
              </div>
            </div>
          </div>

          {/* <div className="flex flex-row-reverse pb-6">
                  <Button type="submit" className="h-10 px-6">
                    Save
                  </Button>
                </div> */}
        </div>
      </div>

      {/* Quick Delivery Section removed */}

      {/*  ====================================================== Latest Discounted Products ====================================================== */}
      <div className="col-span-12 md:col-span-12 lg:col-span-12 md:mt-0 mt-10">
        <div
          className="inline-flex md:text-lg text-base text-white font-semibold mb-0 cursor-pointer items-center w-full justify-between bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md"
          onClick={() => setIsLatestDiscountExpanded(!isLatestDiscountExpanded)}
        >
          <div className="flex items-center">
            <FiSettings className="mt-1 mr-2" />{" "}
            {t("LatestDiscountedProductsTitle")}
          </div>
          {isLatestDiscountExpanded ? (
            <FiChevronUp className="text-xl" />
          ) : (
            <FiChevronDown className="text-xl" />
          )}
        </div>

        <hr className="md:mb-12 mb-3" />

        <div
          className={`xl:px-10 flex-grow scrollbar-hide w-full max-h-full pb-0 ${isLatestDiscountExpanded ? "" : "hidden"}`}
        >
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {t("EnableThisBlock")}
            </label>
            <div className="sm:col-span-4">
              <SwitchToggle
                title=""
                handleProcess={setLatestDiscounted}
                processOption={latestDiscounted}
                name={latestDiscounted}
              />
            </div>
          </div>

          <div
            style={{
              height: latestDiscounted ? "auto" : 0,
              transition: "all 0.5s",
              visibility: !latestDiscounted ? "hidden" : "visible",
              opacity: !latestDiscounted ? "0" : "1",
            }}
          >
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("Title")}
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="latest_discount_title"
                  type="text"
                  placeholder={t("Title")}
                />
                <Error errorName={errors.latest_discount_title} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("Description")}
              </label>
              <div className="sm:col-span-4">
                <TextAreaCom
                  register={register}
                  label="Latest Discount Description"
                  name="latest_discount_description"
                  type="text"
                  placeholder={t("LatestDiscountDescription")}
                />
                <Error errorName={errors.latest_discount_description} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("ProductsLimit")}
              </label>
              <div className="sm:col-span-4">
                <SelectProductLimit
                  register={register}
                  required={true}
                  label="Latest Discount Products Limit"
                  name="latest_discount_product_limit"
                />
                <Error errorName={errors.latest_discount_product_limit} />
              </div>
            </div>
          </div>

          {/* <div className="flex flex-row-reverse pb-6">
                  <Button type="submit" className="h-10 px-6">
                    Save
                  </Button>
                </div> */}
        </div>
      </div>

      {/* Get Your Daily Needs section removed */}

      {/*  ====================================================== CTA Hero Section ====================================================== */}
      <div className="col-span-12 md:col-span-12 lg:col-span-12 md:mt-0 mt-10">
        <div
          className="inline-flex md:text-lg text-base text-white font-semibold mb-0 cursor-pointer items-center w-full justify-between bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md"
          onClick={() => setIsCtaHeroExpanded(!isCtaHeroExpanded)}
        >
          <div className="flex items-center">
            <FiSettings className="mt-1 mr-2" /> CTA Hero Section
          </div>
          {isCtaHeroExpanded ? (
            <FiChevronUp className="text-xl" />
          ) : (
            <FiChevronDown className="text-xl" />
          )}
        </div>

        <hr className="md:mb-12 mb-3" />

        <div
          className={`xl:px-10 flex-grow scrollbar-hide w-full max-h-full pb-0 ${isCtaHeroExpanded ? "" : "hidden"}`}
        >
          {/* Enable/Disable Toggle */}
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {t("EnableThisBlock")}
            </label>
            <div className="sm:col-span-4">
              <SwitchToggle
                title=""
                handleProcess={setCtaHeroEnabled}
                processOption={ctaHeroEnabled}
                name={ctaHeroEnabled}
              />
            </div>
          </div>

          <div
            style={{
              height: ctaHeroEnabled ? "auto" : 0,
              transition: "all 0.5s",
              visibility: !ctaHeroEnabled ? "hidden" : "visible",
              opacity: !ctaHeroEnabled ? "0" : "1",
            }}
          >
            {/* Background Image */}
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Background Image
              </label>
              <div className="sm:col-span-4">
                <Uploader
                  imageUrl={ctaHeroBgImage}
                  setImageUrl={setCtaHeroBgImage}
                  folder="cta-hero"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: 1920x600px. A warehouse or production image works
                  great.
                </p>
              </div>
            </div>

            {/* Title */}
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Title
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="cta_hero_title"
                  type="text"
                  placeholder="Are you ready to make your next favorite t-shirt?"
                />
                <Error errorName={errors.cta_hero_title} />
              </div>
            </div>

            {/* Subtitle (Optional) */}
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Subtitle (Optional)
              </label>
              <div className="sm:col-span-4">
                <TextAreaCom
                  register={register}
                  label="Subtitle"
                  name="cta_hero_subtitle"
                  type="text"
                  placeholder="Create custom designs with premium quality materials"
                />
                <Error errorName={errors.cta_hero_subtitle} />
              </div>
            </div>

            {/* Button Text */}
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Button Text
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Button Text"
                  name="cta_hero_button_text"
                  type="text"
                  placeholder="Shop Products"
                />
                <Error errorName={errors.cta_hero_button_text} />
              </div>
            </div>

            {/* Button Link */}
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Button Link
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Button Link"
                  name="cta_hero_button_link"
                  type="text"
                  placeholder="/search?category="
                />
                <Error errorName={errors.cta_hero_button_link} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  ====================================================== Customer Testimonials Section ====================================================== */}
      <div className="col-span-12 md:col-span-12 lg:col-span-12 md:mt-0 mt-10">
        <div
          className="inline-flex md:text-lg text-base text-white font-semibold mb-0 cursor-pointer items-center w-full justify-between bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md"
          onClick={() => setIsTestimonialsExpanded(!isTestimonialsExpanded)}
        >
          <div className="flex items-center">
            <FiSettings className="mt-1 mr-2" /> Customer Testimonials
          </div>
          {isTestimonialsExpanded ? (
            <FiChevronUp className="text-xl" />
          ) : (
            <FiChevronDown className="text-xl" />
          )}
        </div>

        <hr className="md:mb-12 mb-3" />

        <div
          className={`xl:px-10 flex-grow scrollbar-hide w-full max-h-full pb-0 ${isTestimonialsExpanded ? "" : "hidden"}`}
        >
          {/* Enable/Disable Toggle */}
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {t("EnableThisBlock")}
            </label>
            <div className="sm:col-span-4">
              <SwitchToggle
                title=""
                handleProcess={setTestimonialsEnabled}
                processOption={testimonialsEnabled}
                name={testimonialsEnabled}
              />
            </div>
          </div>

          <div
            style={{
              height: testimonialsEnabled ? "auto" : 0,
              transition: "all 0.5s",
              visibility: !testimonialsEnabled ? "hidden" : "visible",
              opacity: !testimonialsEnabled ? "0" : "1",
            }}
          >
            {/* Main Title */}
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Main Title
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Main Title"
                  name="testimonials_main_title"
                  type="text"
                  placeholder="Over 1,000,000+ Satisfied Customers"
                />
                <Error errorName={errors.testimonials_main_title} />
              </div>
            </div>

            {/* Main Subtitle */}
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Main Subtitle
              </label>
              <div className="sm:col-span-4">
                <TextAreaCom
                  register={register}
                  label="Main Subtitle"
                  name="testimonials_main_subtitle"
                  type="text"
                  placeholder="Get inspired from some of our happy customers"
                />
                <Error errorName={errors.testimonials_main_subtitle} />
              </div>
            </div>

            {/* Testimonials List */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  Testimonials (Total: {testimonialsList.length})
                </h3>
                <Button
                  type="button"
                  onClick={handleAddTestimonial}
                  className="h-10 px-4"
                >
                  + Add Testimonial
                </Button>
              </div>

              {[...testimonialsList]
                .slice()
                .reverse()
                .map((testimonial, revIndex) => (
                  <div
                    key={testimonialsList.length - 1 - revIndex}
                    className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Testimonial {revIndex + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveTestimonial(
                            testimonialsList.length - 1 - revIndex,
                          )
                        }
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Testimonial Title */}
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Title
                      </label>
                      <div className="sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="Title"
                          name={`testimonial_${testimonialsList.length - 1 - revIndex}_title`}
                          type="text"
                          placeholder="Great Shirts & Great Company!"
                        />
                      </div>
                    </div>

                    {/* Testimonial Text */}
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Review Text
                      </label>
                      <div className="sm:col-span-4">
                        <TextAreaCom
                          register={register}
                          label="Review Text"
                          name={`testimonial_${testimonialsList.length - 1 - revIndex}_text`}
                          type="text"
                          placeholder="Enter customer review..."
                        />
                      </div>
                    </div>

                    {/* Customer Name */}
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Customer Name
                      </label>
                      <div className="sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="Customer Name"
                          name={`testimonial_${testimonialsList.length - 1 - revIndex}_customer_name`}
                          type="text"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Rating (1-5)
                      </label>
                      <div className="sm:col-span-4">
                        <InputAreaTwo
                          register={register}
                          label="Rating"
                          name={`testimonial_${testimonialsList.length - 1 - revIndex}_rating`}
                          type="number"
                          min="1"
                          max="5"
                          placeholder="5"
                        />
                      </div>
                    </div>

                    {/* Verified Status */}
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Verified Review
                      </label>
                      <div className="sm:col-span-4">
                        <SwitchToggle
                          title=""
                          handleProcess={() =>
                            handleToggleTestimonialVerified(
                              testimonialsList.length - 1 - revIndex,
                            )
                          }
                          processOption={testimonial.verified}
                          name={`testimonial_${testimonialsList.length - 1 - revIndex}_verified`}
                        />
                      </div>
                    </div>

                    {/* Verified Text (only shown if verified) */}
                    {testimonial.verified && (
                      <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                        <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                          Verified Badge Text
                        </label>
                        <div className="sm:col-span-4">
                          <InputAreaTwo
                            register={register}
                            label="Verified Text"
                            name={`testimonial_${testimonialsList.length - 1 - revIndex}_verified_text`}
                            type="text"
                            placeholder="Verified Review on Yotpo"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

              {testimonialsList.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No testimonials added yet. Click "Add Testimonial" to start.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Promo Section removed */}

      {/* Best Selling Showcase removed */}

      {/*  ====================================================== Footer Section ====================================================== */}
      <div className="col-span-12 md:col-span-12 lg:col-span-12 md:mt-0 mt-10">
        <div
          className="inline-flex md:text-lg text-base text-white font-semibold mb-0 cursor-pointer items-center w-full justify-between bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md"
          onClick={() => setIsFooterExpanded(!isFooterExpanded)}
        >
          <div className="flex items-center">
            <FiSettings className="mt-1 mr-2" /> {t("FooterTitle")}
          </div>
          {isFooterExpanded ? (
            <FiChevronUp className="text-xl" />
          ) : (
            <FiChevronDown className="text-xl" />
          )}
        </div>

        <hr className="md:mb-12 mb-3" />

        <div
          className={`xl:px-10 flex-grow scrollbar-hide w-full max-h-full pb-0 ${isFooterExpanded ? "" : "hidden"}`}
        >
          <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400 relative">
            <strong>{t("Block")} 1</strong>
          </div>
          <hr className="md:mb-12 mb-3" />
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {t("EnableThisBlock")}
            </label>
            <div className="sm:col-span-4">
              <SwitchToggle
                title=""
                handleProcess={setFooterBlock1}
                processOption={footerBlock1}
                name={footerBlock1}
              />
            </div>
          </div>

          <div
            style={{
              height: footerBlock1 ? "auto" : 0,
              transition: "all 0.5s",
              visibility: !footerBlock1 ? "hidden" : "visible",
              opacity: !footerBlock1 ? "0" : "1",
            }}
          >
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-4">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("Title")}
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_one_title"
                  type="text"
                  placeholder="Company"
                />
                <Error errorName={errors.footer_block_one_title} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("Link")} 1
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_one_link_one_title"
                  type="text"
                  placeholder={t("AboutUs")}
                />
                <Error errorName={errors.footer_block_one_link_one_title} />
              </div>
              <label className="md:col-span-1 sm:col-span-2"></label>
              <div className="sm:col-span-4 mb-5">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_one_link_one"
                  type="text"
                  placeholder={t("Link")}
                />
                <Error errorName={errors.footer_block_one_link_one} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("Link")} 2
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_one_link_two_title"
                  type="text"
                  placeholder={t("ContactUs")}
                />
                <Error errorName={errors.footer_block_one_link_two_title} />
              </div>
              <label className="md:col-span-1 sm:col-span-2"></label>
              <div className="sm:col-span-4  mb-5">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_one_link_two"
                  type="text"
                  placeholder={t("Link")}
                />
                <Error errorName={errors.footer_block_one_link_two} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("Link")} 3
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_one_link_three_title"
                  type="text"
                  placeholder={t("Careers")}
                />
                <Error errorName={errors.footer_block_one_link_three_title} />
              </div>
              <label className="md:col-span-1 sm:col-span-2"></label>
              <div className="sm:col-span-4  mb-5">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_one_link_three"
                  type="text"
                  placeholder={t("Link")}
                />
                <Error errorName={errors.footer_block_one_link_three} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("Link")} 4
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_one_link_four_title"
                  type="text"
                  placeholder={t("LatestNews")}
                />
                <Error errorName={errors.footer_block_one_link_four_title} />
              </div>
              <label className="md:col-span-1 sm:col-span-2"></label>
              <div className="sm:col-span-4 mb-5">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_one_link_four"
                  type="text"
                  placeholder={t("Link")}
                />
                <Error errorName={errors.footer_block_one_link_four} />
              </div>
            </div>
          </div>

          <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400 relative md:mt-0 mt-24">
            <strong>{t("Block")} 2</strong>
          </div>
          <hr className="md:mb-12 mb-3" />
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {t("EnableThisBlock")}
            </label>
            <div className="sm:col-span-4">
              <SwitchToggle
                title=""
                handleProcess={setFooterBlock2}
                processOption={footerBlock2}
                name={footerBlock2}
              />
            </div>
          </div>

          <div
            style={{
              height: footerBlock2 ? "auto" : 0,
              transition: "all 0.5s",
              visibility: !footerBlock2 ? "hidden" : "visible",
              opacity: !footerBlock2 ? "0" : "1",
            }}
          >
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("Title")}
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_two_title"
                  type="text"
                  placeholder={t("TopCategory")}
                />
                <Error errorName={errors.footer_block_two_title} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("Link")} 1
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_two_link_one_title"
                  type="text"
                  placeholder={t("FishAndMeat")}
                />
                <Error errorName={errors.footer_block_two_link_one_title} />
              </div>
              <label className="md:col-span-1 sm:col-span-2"></label>
              <div className="sm:col-span-4  mb-5">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_two_link_one"
                  type="text"
                  placeholder={t("Link")}
                />
                <Error errorName={errors.footer_block_two_link_one} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("Link")} 2
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_two_link_two_title"
                  type="text"
                  placeholder={t("SoftDrinks")}
                />
                <Error errorName={errors.footer_block_two_link_two_title} />
              </div>
              <label className="md:col-span-1 sm:col-span-2"></label>
              <div className="sm:col-span-4  mb-5">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_two_link_two"
                  type="text"
                  placeholder={t("Link")}
                />
                <Error errorName={errors.footer_block_two_link_two} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("Link")} 3
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_two_link_three_title"
                  type="text"
                  placeholder={t("BabyCare")}
                />
                <Error errorName={errors.footer_block_two_link_three_title} />
              </div>
              <label className="md:col-span-1 sm:col-span-2"></label>
              <div className="sm:col-span-4  mb-5">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_two_link_three"
                  type="text"
                  placeholder={t("Link")}
                />
                <Error errorName={errors.footer_block_two_link_three} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("Link")} 4
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_two_link_four_title"
                  type="text"
                  placeholder={t("BeautyAndHealth")}
                />
                <Error errorName={errors.footer_block_two_link_four_title} />
              </div>
              <label className="md:col-span-1 sm:col-span-2"></label>
              <div className="sm:col-span-4  mb-5">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_two_link_four"
                  type="text"
                  placeholder={t("Link")}
                />
                <Error errorName={errors.footer_block_two_link_four} />
              </div>
            </div>
          </div>

          <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400 relative md:mt-0 mt-24">
            <strong>{t("Block")} 3</strong>
          </div>
          <hr className="md:mb-12 mb-3" />
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {t("EnableThisBlock")}
            </label>
            <div className="sm:col-span-4">
              <SwitchToggle
                title=""
                handleProcess={setFooterBlock3}
                processOption={footerBlock3}
                name={footerBlock3}
              />
            </div>
          </div>

          <div
            style={{
              height: footerBlock3 ? "auto" : 0,
              transition: "all 0.5s",
              visibility: !footerBlock3 ? "hidden" : "visible",
              opacity: !footerBlock3 ? "0" : "1",
            }}
          >
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("Title")}
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_three_title"
                  type="text"
                  placeholder="My Account"
                />
                <Error errorName={errors.footer_block_three_title} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("Link")} 1
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_three_link_one_title"
                  type="text"
                  placeholder={t("Dashboard")}
                />
                <Error errorName={errors.footer_block_three_link_one_title} />
              </div>
              <label className="md:col-span-1 sm:col-span-2"></label>
              <div className="sm:col-span-4  mb-5">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_three_link_one"
                  type="text"
                  placeholder={t("Link")}
                />
                <Error errorName={errors.footer_block_three_link_one} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("Link")} 2
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_three_link_two_title"
                  type="text"
                  placeholder={t("MyOrders")}
                />
                <Error errorName={errors.footer_block_three_link_two_title} />
              </div>
              <label className="md:col-span-1 sm:col-span-2"></label>
              <div className="sm:col-span-4  mb-5">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_three_link_two"
                  type="text"
                  placeholder={t("Link")}
                />
                <Error errorName={errors.footer_block_three_link_two} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("Link")} 3
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_three_link_three_title"
                  type="text"
                  placeholder="Recent Orders"
                />
                <Error errorName={errors.footer_block_three_link_three_title} />
              </div>
              <label className="md:col-span-1 sm:col-span-2"></label>
              <div className="sm:col-span-4  mb-5">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_three_link_three"
                  type="text"
                  placeholder={t("Link")}
                />
                <Error errorName={errors.footer_block_three_link_three} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-1">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("Link")} 4
              </label>

              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_three_link_four_title"
                  type="text"
                  placeholder="Updated Profile"
                />
                <Error errorName={errors.footer_block_three_link_four_title} />
              </div>
              <label className="md:col-span-1 sm:col-span-2"></label>
              <div className="sm:col-span-4  mb-5">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_three_link_four"
                  type="text"
                  placeholder={t("Link")}
                />
                <Error errorName={errors.footer_block_three_link_four} />
              </div>
            </div>
          </div>

          <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400 relative md:mt-0 mt-24">
            <strong>{t("Block")} 4</strong>
          </div>

          <hr className="md:mb-12 mb-3" />

          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {t("EnableThisBlock")}
            </label>
            <div className="sm:col-span-4">
              <SwitchToggle
                title=""
                handleProcess={setFooterBlock4}
                processOption={footerBlock4}
                name={footerBlock4}
              />
            </div>
          </div>

          <div
            style={{
              height: footerBlock4 ? "auto" : 0,
              transition: "all 0.5s",
              visibility: !footerBlock4 ? "hidden" : "visible",
              opacity: !footerBlock4 ? "0" : "1",
            }}
          >
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("FooterLogo")}
              </label>
              <div className="sm:col-span-4">
                <Uploader imageUrl={footerLogo} setImageUrl={setFooterLogo} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("FooterAddress")}
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_four_address"
                  type="text"
                  placeholder="Address"
                />
                <Error errorName={errors.footer_block_four_address} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("FooterPhone")}
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_four_phone"
                  type="text"
                  placeholder={t("Phone")}
                />
                <Error errorName={errors.footer_block_four_phone} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("FooterEmail")}
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="footer_block_four_email"
                  type="text"
                  placeholder="Email"
                />
                <Error errorName={errors.footer_block_four_email} />
              </div>
            </div>
          </div>

          <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400 relative mt-24 md:mt-0">
            <strong>{t("SocialLinks")}</strong>
          </div>
          <hr className="md:mb-12 mb-3" />
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {t("EnableThisBlock")}
            </label>
            <div className="sm:col-span-4">
              <SwitchToggle
                title=""
                handleProcess={setFooterSocialLinks}
                processOption={footerSocialLinks}
                name={footerSocialLinks}
              />
            </div>
          </div>

          <div
            style={{
              height: footerSocialLinks ? "auto" : 0,
              transition: "all 0.5s",
              visibility: !footerSocialLinks ? "hidden" : "visible",
              opacity: !footerSocialLinks ? "0" : "1",
            }}
          >
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Facebook
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="social_facebook"
                  type="text"
                  placeholder="Facebook link"
                />
                <Error errorName={errors.social_facebook} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Twitter
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="social_twitter"
                  type="text"
                  placeholder="Twitter Link"
                />
                <Error errorName={errors.social_twitter} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Pinterest
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="social_pinterest"
                  type="text"
                  placeholder="Pinterest Link"
                />
                <Error errorName={errors.social_pinterest} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Linkedin
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="social_linkedin"
                  type="text"
                  placeholder="Linkedin Link"
                />
                <Error errorName={errors.social_linkedin} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                WhatsApp
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label="Title"
                  name="social_whatsapp"
                  type="text"
                  placeholder="whatsApp Link"
                />
                <Error errorName={errors.social_whatsapp} />
              </div>
            </div>
          </div>

          <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400 relative mt-24 md:mt-0">
            <strong>{t("PaymentMethod")}</strong>
          </div>
          <hr className="md:mb-12 mb-3" />
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {t("EnableThisBlock")}
            </label>
            <div className="sm:col-span-4">
              <SwitchToggle
                title=""
                handleProcess={setFooterPaymentMethod}
                processOption={footerPaymentMethod}
                name={footerPaymentMethod}
              />
            </div>
          </div>

          <div
            style={{
              height: footerPaymentMethod ? "auto" : 0,
              transition: "all 0.5s",
              visibility: !footerPaymentMethod ? "hidden" : "visible",
              opacity: !footerPaymentMethod ? "0" : "1",
            }}
          >
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("PaymentMethod")}
              </label>
              <div className="sm:col-span-4">
                <Uploader
                  imageUrl={paymentImage}
                  setImageUrl={setPaymentImage}
                />
              </div>
            </div>
          </div>

          {/* <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Visibility
                  </label>
                  <div className="sm:col-span-4">
                    <SwitchToggle
                      title={""}
                      // handleProcess={setSliderFullWidth}
                      // processOption={}
                    />
                  </div>
                </div> */}

          <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400 relative mt-16 md:mt-0">
            <strong>{t("FooterBottomContact")}</strong>
          </div>

          <hr className="md:mb-12 mb-3" />

          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {t("EnableThisBlock")}
            </label>
            <div className="sm:col-span-4">
              <SwitchToggle
                title=""
                handleProcess={setFooterBottomContact}
                processOption={footerBottomContact}
                name={footerBottomContact}
              />
            </div>
          </div>

          <div
            style={{
              height: footerBottomContact ? "auto" : 0,
              transition: "all 0.5s",
              visibility: !footerBottomContact ? "hidden" : "visible",
              opacity: !footerBottomContact ? "0" : "1",
            }}
            className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3"
          >
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {t("FooterBottomContact")}
            </label>
            <div className="sm:col-span-4 mb-20 md:mb-0">
              <InputAreaTwo
                register={register}
                label="Title"
                name="footer_Bottom_Contact"
                type="text"
                placeholder={t("FooterBottomContact")}
              />
              <Error errorName={errors.footer_Bottom_Contact} />
            </div>
          </div>

          {/* Copyright Text Section */}
          <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400 relative mt-16">
            <strong>{t("FooterBottomBarSettings")}</strong>
          </div>

          <hr className="md:mb-12 mb-3" />

          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {t("CopyrightText")}
            </label>
            <div className="sm:col-span-4">
              <InputAreaTwo
                register={register}
                label="Copyright Text"
                name="footer_copyright_text"
                type="text"
                placeholder="© 2026, Your Store Name"
              />
              <Error errorName={errors.footer_copyright_text} />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                This text appears in the footer bottom bar. For policy links
                (Refund, Privacy, Terms, etc.), go to Settings → General
                Settings → Footer Page Links section.
              </p>
            </div>
          </div>

          {/* Footer Page Links Section */}
          <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400 relative mt-16">
            <strong>{t("FooterPageLinks")}</strong>
          </div>

          <hr className="md:mb-12 mb-3" />

          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <div className="md:col-span-1 sm:col-span-2">
              <p className="block md:text-sm text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("FooterLinksDescription")}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                These links appear at the bottom of the footer in a single row,
                separated by dots.
              </p>
            </div>
            <div className="sm:col-span-4">
              <Button
                type="button"
                onClick={handleAddFooterLink}
                className="h-10 px-6 mb-4"
              >
                <FiPlus className="mr-2" />
                {t("AddLink")}
              </Button>

              {footerLinks && footerLinks.length > 0 && (
                <div className="space-y-4">
                  {footerLinks.map((link, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Link {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFooterLink(index)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">
                            {t("LinkTitle")}
                          </label>
                          <input
                            type="text"
                            value={link.title || ""}
                            onChange={(e) =>
                              handleFooterLinkChange(
                                index,
                                "title",
                                e.target.value,
                              )
                            }
                            placeholder="e.g., Refund policy, Privacy policy"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-gray-600 dark:text-gray-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">
                            {t("LinkURL")}
                          </label>
                          <input
                            type="text"
                            value={link.url || ""}
                            onChange={(e) =>
                              handleFooterLinkChange(
                                index,
                                "url",
                                e.target.value,
                              )
                            }
                            placeholder="e.g., /refund-policy, /privacy-policy"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-gray-600 dark:text-gray-200"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(!footerLinks || footerLinks.length === 0) && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  No footer links added yet. Click "Add Link" to create one.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
