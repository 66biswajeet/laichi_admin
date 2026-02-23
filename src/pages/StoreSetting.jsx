import { useTranslation } from "react-i18next";

//internal import
import Label from "@/components/form/label/Label";
import Error from "@/components/form/others/Error";
import PageTitle from "@/components/Typography/PageTitle";
import InputAreaTwo from "@/components/form/input/InputAreaTwo";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import useStoreSettingSubmit from "@/hooks/useStoreSettingSubmit";
import AnimatedContent from "@/components/common/AnimatedContent";
import SettingContainer from "@/components/settings/SettingContainer";

const StoreSetting = () => {
  const { t } = useTranslation();
  const {
    isSave,
    errors,
    register,
    onSubmit,
    handleSubmit,
    isSubmitting,
    enabledCOD,
    setEnabledCOD,
    enabledStripe,
    setEnabledStripe,
    enabledRazorPay,
    setEnabledRazorPay,
    enabledFbPixel,
    setEnableFbPixel,
    enabledTawkChat,
    setEnabledTawkChat,
    enabledGoogleLogin,
    setEnabledGoogleLogin,
    enabledGithubLogin,
    setEnabledGithubLogin,
    enabledFacebookLogin,
    setEnabledFacebookLogin,
    enabledGoogleAnalytics,
    setEnabledGoogleAnalytics,
    enabledFirebase,
    setEnabledFirebase,
    enabledStallion,
    setEnabledStallion,
    enabledCloudinary,
    setEnabledCloudinary,
  } = useStoreSettingSubmit();

  const handleEnableDisableMethod = (checked, event, id) => {
    if (id === "stripe" && !checked) {
      setEnabledStripe(!enabledStripe);
      setEnabledCOD(true);
    } else if (id === "stripe" && checked) {
      setEnabledStripe(!enabledStripe);
    } else if (id === "cod" && !checked) {
      setEnabledCOD(!enabledCOD);
      setEnabledStripe(true);
    } else {
      setEnabledCOD(!enabledCOD);
    }
    // console.log("value", checked, "event", event.target.value, "id", id);
  };

  return (
    <>
      <PageTitle>{t("StoreSetting")}</PageTitle>
      <AnimatedContent>
        <div className="sm:container w-full md:p-6 p-4 mx-auto bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <SettingContainer
              isSave={isSave}
              title={t("StoreDetails")}
              isSubmitting={isSubmitting}
            >
              <div className="flex-grow scrollbar-hide w-full max-h-full">
                {/* Firebase Configuration Section */}
                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Enable Firebase Config
                  </label>
                  <div className="sm:col-span-4">
                    <SwitchToggle
                      id="firebase"
                      processOption={enabledFirebase}
                      handleProcess={setEnabledFirebase}
                    />
                  </div>
                </div>

                <div
                  style={{
                    height: enabledFirebase ? "auto" : 0,
                    transition: "all .6s",
                    visibility: !enabledFirebase ? "hidden" : "visible",
                    opacity: !enabledFirebase ? "0" : "1",
                  }}
                  className={`${enabledFirebase ? "mb-8" : "mb-2"}`}
                >
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Firebase API Key" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledFirebase}
                        register={register}
                        label="Firebase API Key"
                        name="firebase_api_key"
                        type="password"
                        placeholder="AIzaSy..."
                      />
                      <Error errorName={errors.firebase_api_key} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Firebase Auth Domain" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledFirebase}
                        register={register}
                        label="Firebase Auth Domain"
                        name="firebase_auth_domain"
                        type="text"
                        placeholder="your-app.firebaseapp.com"
                      />
                      <Error errorName={errors.firebase_auth_domain} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Firebase Project ID" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledFirebase}
                        register={register}
                        label="Firebase Project ID"
                        name="firebase_project_id"
                        type="text"
                        placeholder="your-project-id"
                      />
                      <Error errorName={errors.firebase_project_id} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Firebase Storage Bucket" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledFirebase}
                        register={register}
                        label="Firebase Storage Bucket"
                        name="firebase_storage_bucket"
                        type="text"
                        placeholder="your-app.firebasestorage.app"
                      />
                      <Error errorName={errors.firebase_storage_bucket} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Firebase Messaging Sender ID" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledFirebase}
                        register={register}
                        label="Firebase Messaging Sender ID"
                        name="firebase_messaging_sender_id"
                        type="text"
                        placeholder="123456789"
                      />
                      <Error errorName={errors.firebase_messaging_sender_id} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Firebase App ID" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledFirebase}
                        register={register}
                        label="Firebase App ID"
                        name="firebase_app_id"
                        type="password"
                        placeholder="1:123456789:web:abc123"
                      />
                      <Error errorName={errors.firebase_app_id} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
                    <Label label="Firebase Measurement ID" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Firebase Measurement ID"
                        name="firebase_measurement_id"
                        type="text"
                        placeholder="G-XXXXXXXXXX (Optional)"
                      />
                      <Error errorName={errors.firebase_measurement_id} />
                    </div>
                  </div>
                </div>

                {/* Stallion Express Configuration Section */}
                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Enable Stallion Express Shipping
                  </label>
                  <div className="sm:col-span-4">
                    <SwitchToggle
                      id="stallion"
                      processOption={enabledStallion}
                      handleProcess={setEnabledStallion}
                    />
                  </div>
                </div>

                <div
                  style={{
                    height: enabledStallion ? "auto" : 0,
                    transition: "all .6s",
                    visibility: !enabledStallion ? "hidden" : "visible",
                    opacity: !enabledStallion ? "0" : "1",
                  }}
                  className={`${enabledStallion ? "mb-8" : "mb-2"}`}
                >
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Stallion Sandbox API Key" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledStallion}
                        register={register}
                        label="Stallion Sandbox API Key"
                        name="stallion_api_key_sandbox"
                        type="password"
                        placeholder="Your Sandbox API Key"
                      />
                      <Error errorName={errors.stallion_api_key_sandbox} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Stallion Production API Key" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledStallion}
                        register={register}
                        label="Stallion Production API Key"
                        name="stallion_api_key_prod"
                        type="password"
                        placeholder="Your Production API Key"
                      />
                      <Error errorName={errors.stallion_api_key_prod} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Stallion Sandbox Base URL" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Stallion Sandbox Base URL"
                        name="stallion_base_url_sandbox"
                        type="text"
                        placeholder="https://sandbox.stallionexpress.ca/api/v4/"
                      />
                      <Error errorName={errors.stallion_base_url_sandbox} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Stallion Production Base URL" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Stallion Production Base URL"
                        name="stallion_base_url_prod"
                        type="text"
                        placeholder="https://ship.stallionexpress.ca/api/v4/"
                      />
                      <Error errorName={errors.stallion_base_url_prod} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
                    <Label label="Stallion Webhook Secret" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Stallion Webhook Secret"
                        name="stallion_webhook_secret"
                        type="password"
                        placeholder="Your Webhook Secret (Optional)"
                      />
                      <Error errorName={errors.stallion_webhook_secret} />
                    </div>
                  </div>
                </div>

                {/* Cloudinary Configuration Section */}
                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Enable Cloudinary Config
                  </label>
                  <div className="sm:col-span-4">
                    <SwitchToggle
                      id="cloudinary"
                      processOption={enabledCloudinary}
                      handleProcess={setEnabledCloudinary}
                    />
                  </div>
                </div>

                <div
                  style={{
                    height: enabledCloudinary ? "auto" : 0,
                    transition: "all .6s",
                    visibility: !enabledCloudinary ? "hidden" : "visible",
                    opacity: !enabledCloudinary ? "0" : "1",
                  }}
                  className={`${enabledCloudinary ? "mb-8" : "mb-2"}`}
                >
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Cloudinary Cloud Name" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledCloudinary}
                        register={register}
                        label="Cloudinary Cloud Name"
                        name="cloudinary_cloud_name"
                        type="text"
                        placeholder="your-cloud-name"
                      />
                      <Error errorName={errors.cloudinary_cloud_name} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Cloudinary API Key" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledCloudinary}
                        register={register}
                        label="Cloudinary API Key"
                        name="cloudinary_api_key"
                        type="password"
                        placeholder="123456789012345"
                      />
                      <Error errorName={errors.cloudinary_api_key} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Cloudinary API Secret" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledCloudinary}
                        register={register}
                        label="Cloudinary API Secret"
                        name="cloudinary_api_secret"
                        type="password"
                        placeholder="Your API Secret"
                      />
                      <Error errorName={errors.cloudinary_api_secret} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
                    <Label label="Cloudinary Upload Preset" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledCloudinary}
                        register={register}
                        label="Cloudinary Upload Preset"
                        name="cloudinary_upload_preset"
                        type="text"
                        placeholder="your-upload-preset"
                      />
                      <Error errorName={errors.cloudinary_upload_preset} />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  "
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {t("EnableCOD")} <br />
                    <span className="text-xs font-normal text-gray-600 dark:text-gray-400">
                      (This is enabled by default)
                    </span>
                  </label>
                  <div className="sm:col-span-4">
                    <SwitchToggle
                      id="cod"
                      processOption={enabledCOD}
                      handleProcess={handleEnableDisableMethod}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <Label label={t("EnableStripe")} />
                  <div className="sm:col-span-4">
                    <SwitchToggle
                      id="stripe"
                      processOption={enabledStripe}
                      handleProcess={handleEnableDisableMethod}
                    />
                  </div>
                </div>

                <div
                  style={{
                    height: enabledStripe ? "auto" : 0,
                    transition: "all .6s",
                    visibility: !enabledStripe ? "hidden" : "visible",
                    opacity: !enabledStripe ? "0" : "1",
                  }}
                  className={`${enabledStripe ? "mb-8" : "mb-2"}`}
                >
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label={t("StripeKey")} />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledStripe}
                        register={register}
                        label={t("StripeKey")}
                        name="stripe_key"
                        type="password"
                        placeholder={t("StripeKey")}
                      />
                      <Error errorName={errors.stripe_key} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
                    <Label label={t("StripeSecret")} />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledStripe}
                        register={register}
                        label={t("StripeSecret")}
                        name="stripe_secret"
                        type="password"
                        placeholder={t("StripeSecret")}
                      />
                      <Error errorName={errors.stripe_secret} />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <Label label="Enable RazorPay" />
                  <div className="sm:col-span-4">
                    <SwitchToggle
                      id="razorpay"
                      processOption={enabledRazorPay}
                      handleProcess={setEnabledRazorPay}
                    />
                  </div>
                </div>

                <div
                  style={{
                    height: enabledRazorPay ? "auto" : 0,
                    transition: "all .6s",
                    visibility: !enabledRazorPay ? "hidden" : "visible",
                    opacity: !enabledRazorPay ? "0" : "1",
                  }}
                  className={`${enabledRazorPay ? "mb-8" : "mb-2"}`}
                >
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="RazorPay ID" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledRazorPay}
                        register={register}
                        label="RazorPay ID"
                        name="razorpay_id"
                        type="password"
                        placeholder="RazorPay ID"
                      />
                      <Error errorName={errors.razorpay_id} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
                    <Label label="RazorPay Secret" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledRazorPay}
                        register={register}
                        label="RazorPay Secret"
                        name="razorpay_secret"
                        type="password"
                        placeholder="RazorPay Secret"
                      />
                      <Error errorName={errors.razorpay_secret} />
                    </div>
                  </div>
                </div>

                {/* Next api base Url/backend url */}

                {/* <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Next Api Base URL <br />
                    <span className="text-xs font-normal text-gray-600 dark:text-gray-400">
                      (This is required for access to db)
                    </span>
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      pattern={{
                        value: "/^(https?|chrome)://[^s$.?#].[^s]*$/gm",
                        message: "Invalid url format",
                      }}
                      required={true}
                      register={register}
                      label="Next Api Base URL"
                      name="next_api_base_url"
                      type="text"
                      placeholder="Next Api Base URL(You backend live url)"
                    />
                    <Error errorName={errors.next_api_base_url} />
                  </div>
                </div> */}

                {/* next auth secret */}
                {/* <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Next Auth Secret <br />
                    <span className="text-xs font-normal text-gray-600 dark:text-gray-400">
                      (This is required for login or sign up)
                    </span>
                  </label>
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      required={true}
                      register={register}
                      label="Next Auth Secret"
                      name="nextauth_secret"
                      type="password"
                      placeholder="Next Auth Secret(Just add a random value with -base64 32)"
                    />
                    <Error errorName={errors.nextauth_secret} />
                  </div>
                </div> */}

                {/* COMMENTED OUT - Google Login section */}
                {/* <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <Label label={t("EnableGoogleLogin")} />
                  <div className="sm:col-span-4">
                    <SwitchToggle
                      id="google_login"
                      processOption={enabledGoogleLogin}
                      handleProcess={setEnabledGoogleLogin}
                    />
                  </div>
                </div>
                <div
                  style={{
                    height: enabledGoogleLogin ? "auto" : 0,
                    transition: "all .6s",
                    visibility: !enabledGoogleLogin ? "hidden" : "visible",
                    opacity: !enabledGoogleLogin ? "0" : "1",
                  }}
                  className={`${enabledGoogleLogin ? "mb-8" : "mb-2"}`}
                >
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label={t("GoogleClientId")} />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledGoogleLogin}
                        register={register}
                        label={t("GoogleClientId")}
                        name="google_id"
                        type="password"
                        placeholder={t("GoogleClientId")}
                      />
                      <Error errorName={errors.google_id} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
                    <Label label={t("GoogleSecret")} />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledGoogleLogin}
                        register={register}
                        label={t("GoogleSecret")}
                        name="google_secret"
                        type="password"
                        placeholder={t("GoogleSecret")}
                      />
                      <Error errorName={errors.google_secret} />
                    </div>
                  </div>
                </div> */}
                {/* END COMMENTED - Google Login section */}

                {/* COMMENTED OUT - Github Login section */}
                {/* <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <Label label="Enable Github Login" />
                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <Label label="Enable Github Login" />
                  <div className="sm:col-span-4">
                    <SwitchToggle
                      id="github_login"
                      processOption={enabledGithubLogin}
                      handleProcess={setEnabledGithubLogin}
                    />
                  </div>
                </div>
                <div
                  style={{
                    height: enabledGithubLogin ? "auto" : 0,
                    transition: "all .6s",
                    visibility: !enabledGithubLogin ? "hidden" : "visible",
                    opacity: !enabledGithubLogin ? "0" : "1",
                  }}
                  className={`${enabledGithubLogin ? "mb-8" : "mb-2"}`}
                >
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label={"Github ID"} />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledGithubLogin}
                        register={register}
                        label="Github ID"
                        name="github_id"
                        type="password"
                        placeholder="Github ID"
                      />
                      <Error errorName={errors.github_id} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
                    <Label label="Github Secret" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledGithubLogin}
                        register={register}
                        label="Github Secret"
                        name="github_secret"
                        type="password"
                        placeholder="Github Secret"
                      />
                      <Error errorName={errors.github_secret} />
                    </div>
                  </div>
                </div> */}
                {/* END COMMENTED - Github Login section */}

                {/* COMMENTED OUT - Facebook Login section */}
                {/* <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <Label label="Enable Facebook Login" />
                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <Label label="Enable Facebook Login" />
                  <div className="sm:col-span-4">
                    <SwitchToggle
                      id="facebook_login"
                      processOption={enabledFacebookLogin}
                      handleProcess={setEnabledFacebookLogin}
                    />
                  </div>
                </div>
                <div
                  style={{
                    height: enabledFacebookLogin ? "auto" : 0,
                    transition: "all .6s",
                    visibility: !enabledFacebookLogin ? "hidden" : "visible",
                    opacity: !enabledFacebookLogin ? "0" : "1",
                  }}
                  className={`${enabledFacebookLogin ? "mb-8" : "mb-2"}`}
                >
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Facebook ID" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledFacebookLogin}
                        register={register}
                        label="Facebook ID"
                        name="facebook_id"
                        type="password"
                        placeholder="Facebook ID"
                      />
                      <Error errorName={errors.facebook_id} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
                    <Label label="Facebook Secret" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledFacebookLogin}
                        register={register}
                        label="Facebook Secret"
                        name="facebook_secret"
                        type="password"
                        placeholder="Facebook Secret"
                      />
                      <Error errorName={errors.facebook_secret} />
                    </div>
                  </div>
                </div> */}
                {/* END COMMENTED - Facebook Login section */}

                {/* COMMENTED OUT - Google Analytics section */}
                {/* <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <Label label={t("EnableGoggleAnalytics")} />
                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <Label label={t("EnableGoggleAnalytics")} />
                  <div className="sm:col-span-4">
                    <SwitchToggle
                      id="google_analytics"
                      processOption={enabledGoogleAnalytics}
                      handleProcess={setEnabledGoogleAnalytics}
                    />
                  </div>
                </div>
                <div
                  style={{
                    height: enabledGoogleAnalytics ? "auto" : 0,
                    transition: "all .6s",
                    visibility: !enabledGoogleAnalytics ? "hidden" : "visible",
                    opacity: !enabledGoogleAnalytics ? "0" : "1",
                  }}
                  className={`${
                    enabledGoogleAnalytics
                      ? "grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6"
                      : "mb-2"
                  }`}
                >
                  <Label label={t("GoogleAnalyticKey")} />
                  <div className="sm:col-span-4">
                    <InputAreaTwo
                      required={enabledGoogleAnalytics}
                      register={register}
                      label={t("GoogleAnalyticKey")}
                      name="google_analytic_key"
                      type="password"
                      placeholder={t("GoogleAnalyticKey")}
                    />
                    <Error errorName={errors.google_analytic_key} />
                  </div>
                </div> */}
                {/* END COMMENTED - Google Analytics section */}

                {/* FB Pixel  section start */}
                {/* <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {t("EnableFacebookPixel")}
            </label>
            <div className="sm:col-span-4">
              <SwitchToggle
                id="facebook_pixel"
                processOption={enabledFbPixel}
                handleProcess={setEnableFbPixel}
              />
            </div>
          </div>
          <div
            style={{
              height: enabledFbPixel ? "auto" : 0,
              transition: "all .6s",
              visibility: !enabledFbPixel ? "hidden" : "visible",
              opacity: !enabledFbPixel ? "0" : "1",
            }}
            className={`${
              enabledFbPixel
                ? "grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6"
                : "mb-2"
            }`}
          >
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {t("FacebookPixelKey")}
            </label>
            <div className="sm:col-span-4">
              <InputAreaTwo
                required
                register={register}
                label={t("FacebookPixelKey")}
                name="fb_pixel_key"
                type="password"
                placeholder={t("FacebookPixelKey")}
              />
              <Error errorName={errors.fb_pixel_key} />
            </div>
          </div> */}

                {/* COMMENTED OUT - Tawk Chat section */}
                {/* <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <Label label={t("EnableTawkChat")} />
                <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <Label label={t("EnableTawkChat")} />
                  <div className="sm:col-span-4">
                    <SwitchToggle
                      id="tawk_chat"
                      processOption={enabledTawkChat}
                      handleProcess={setEnabledTawkChat}
                    />
                  </div>
                </div>
                <div
                  style={{
                    height: enabledTawkChat ? "auto" : 0,
                    transition: "all .6s",
                    visibility: !enabledTawkChat ? "hidden" : "visible",
                    opacity: !enabledTawkChat ? "0" : "1",
                  }}
                  className={`${enabledTawkChat ? "mb-8" : "mb-2"}`}
                >
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label={t("TawkChatPropertyID")} />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledTawkChat}
                        register={register}
                        label={t("TawkChatPropertyID")}
                        name="tawk_chat_property_id"
                        type="password"
                        placeholder={t("TawkChatPropertyID")}
                      />
                      <Error errorName={errors.tawk_chat_property_id} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
                    <Label label={t("TawkChatWidgetID")} />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        required={enabledTawkChat}
                        register={register}
                        label={t("TawkChatWidgetID")}
                        name="tawk_chat_widget_id"
                        type="password"
                        placeholder={t("TawkChatWidgetID")}
                      />
                      <Error errorName={errors.tawk_chat_widget_id} />
                    </div>
                  </div>
                </div> */}
                {/* END COMMENTED - Tawk Chat section */}

                {/* Warehouse/Store Origin Address Section Start */}
                <div className="border-t border-gray-300 dark:border-gray-600 pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Warehouse/Store Origin Address
                  </h3>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Warehouse Name" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Warehouse Name"
                        name="warehouse_name"
                        type="text"
                        placeholder="Test Store Warehouse"
                      />
                      <Error errorName={errors.warehouse_name} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Address Line 1" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Address Line 1"
                        name="warehouse_address_line1"
                        type="text"
                        placeholder="250 Front St W"
                      />
                      <Error errorName={errors.warehouse_address_line1} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="City" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="City"
                        name="warehouse_city"
                        type="text"
                        placeholder="Toronto"
                      />
                      <Error errorName={errors.warehouse_city} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="State/Province" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="State/Province"
                        name="warehouse_state"
                        type="text"
                        placeholder="ON"
                      />
                      <Error errorName={errors.warehouse_state} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Postal Code" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Postal Code"
                        name="warehouse_postal_code"
                        type="text"
                        placeholder="M5V 3G5"
                      />
                      <Error errorName={errors.warehouse_postal_code} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Country Code" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Country Code"
                        name="warehouse_country"
                        type="text"
                        placeholder="CA"
                      />
                      <Error errorName={errors.warehouse_country} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Phone" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Phone"
                        name="warehouse_phone"
                        type="text"
                        placeholder="4161234567"
                      />
                      <Error errorName={errors.warehouse_phone} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Email" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Email"
                        name="warehouse_email"
                        type="email"
                        placeholder="warehouse@teststore.com"
                      />
                      <Error errorName={errors.warehouse_email} />
                    </div>
                  </div>
                </div>

                {/* Warehouse/Store Origin Address Section End */}

                {/* Product Defaults Section Start */}
                <div className="border-t border-gray-300 dark:border-gray-600 pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Product Default Values
                  </h3>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Default Product Weight (g)" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Default Product Weight"
                        name="default_product_weight"
                        type="number"
                        placeholder="2"
                        step="0.1"
                      />
                      <Error errorName={errors.default_product_weight} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Default Product Length (cm)" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Default Product Length"
                        name="default_product_length"
                        type="number"
                        placeholder="10"
                      />
                      <Error errorName={errors.default_product_length} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Default Product Width (cm)" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Default Product Width"
                        name="default_product_width"
                        type="number"
                        placeholder="10"
                      />
                      <Error errorName={errors.default_product_width} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Default Product Height (cm)" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Default Product Height"
                        name="default_product_height"
                        type="number"
                        placeholder="5"
                      />
                      <Error errorName={errors.default_product_height} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Default Weight Unit" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Default Weight Unit"
                        name="default_weight_unit"
                        type="text"
                        placeholder="kg"
                      />
                      <Error errorName={errors.default_weight_unit} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <Label label="Default Dimension Unit" />
                    <div className="sm:col-span-4">
                      <InputAreaTwo
                        register={register}
                        label="Default Dimension Unit"
                        name="default_dim_unit"
                        type="text"
                        placeholder="cm"
                      />
                      <Error errorName={errors.default_dim_unit} />
                    </div>
                  </div>
                </div>

                {/* Product Defaults Section End */}
              </div>
            </SettingContainer>
          </form>
        </div>
      </AnimatedContent>
    </>
  );
};

export default StoreSetting;
