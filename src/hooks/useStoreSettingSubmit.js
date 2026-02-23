import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

//internal import
import useDisableForDemo from "./useDisableForDemo";
import { SidebarContext } from "@/context/SidebarContext";
import SettingServices from "@/services/SettingServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const useStoreSettingSubmit = (id) => {
  const { setIsUpdate } = useContext(SidebarContext);
  const [isSave, setIsSave] = useState(true);
  const [metaImg, setMetaImg] = useState("");
  const [favicon, setFavicon] = useState("");
  const [enabledCOD, setEnabledCOD] = useState(true);
  const [enabledStripe, setEnabledStripe] = useState(true);
  const [enabledRazorPay, setEnabledRazorPay] = useState(true);
  const [enabledFbPixel, setEnableFbPixel] = useState(true);
  const [enabledTawkChat, setEnabledTawkChat] = useState(false);
  const [enabledGoogleLogin, setEnabledGoogleLogin] = useState(true);
  const [enabledGithubLogin, setEnabledGithubLogin] = useState(false);
  const [enabledFacebookLogin, setEnabledFacebookLogin] = useState(false);
  const [enabledGoogleAnalytics, setEnabledGoogleAnalytics] = useState(false);
  const [enabledFirebase, setEnabledFirebase] = useState(false);
  const [enabledStallion, setEnabledStallion] = useState(false);
  const [enabledCloudinary, setEnabledCloudinary] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleDisableForDemo } = useDisableForDemo();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (handleDisableForDemo()) {
      return; // Exit the function if the feature is disabled
    }
    try {
      setIsSubmitting(true);
      const settingData = {
        name: "storeSetting",
        setting: {
          cod_status: enabledCOD,
          stripe_status: enabledStripe,
          razorpay_status: enabledRazorPay,
          stripe_key: data.stripe_key,
          stripe_secret: data.stripe_secret,
          razorpay_id: data.razorpay_id,
          razorpay_secret: data.razorpay_secret,
          google_login_status: enabledGoogleLogin,
          github_login_status: enabledGithubLogin,
          facebook_login_status: enabledFacebookLogin,
          google_id: data.google_id,
          google_secret: data.google_secret,
          github_id: data.github_id,
          github_secret: data.github_secret,
          facebook_id: data.facebook_id,
          facebook_secret: data.facebook_secret,
          // nextauth_secret: data.nextauth_secret,
          // next_api_base_url: data.next_api_base_url,
          google_analytic_status: enabledGoogleAnalytics,
          google_analytic_key: data.google_analytic_key,
          fb_pixel_status: enabledFbPixel,
          fb_pixel_key: data.fb_pixel_key,
          tawk_chat_status: enabledTawkChat,
          tawk_chat_property_id: data.tawk_chat_property_id,
          tawk_chat_widget_id: data.tawk_chat_widget_id,
          firebase_status: enabledFirebase,
          firebase_api_key: data.firebase_api_key,
          firebase_auth_domain: data.firebase_auth_domain,
          firebase_project_id: data.firebase_project_id,
          firebase_storage_bucket: data.firebase_storage_bucket,
          firebase_messaging_sender_id: data.firebase_messaging_sender_id,
          firebase_app_id: data.firebase_app_id,
          firebase_measurement_id: data.firebase_measurement_id,
          stallion_status: enabledStallion,
          stallion_api_key_sandbox: data.stallion_api_key_sandbox,
          stallion_api_key_prod: data.stallion_api_key_prod,
          stallion_base_url_sandbox: data.stallion_base_url_sandbox,
          stallion_base_url_prod: data.stallion_base_url_prod,
          stallion_webhook_secret: data.stallion_webhook_secret,
          cloudinary_status: enabledCloudinary,
          cloudinary_cloud_name: data.cloudinary_cloud_name,
          cloudinary_api_key: data.cloudinary_api_key,
          cloudinary_api_secret: data.cloudinary_api_secret,
          cloudinary_upload_preset: data.cloudinary_upload_preset,
          // Warehouse/Store Origin Address
          warehouse_name: data.warehouse_name,
          warehouse_address_line1: data.warehouse_address_line1,
          warehouse_city: data.warehouse_city,
          warehouse_state: data.warehouse_state,
          warehouse_postal_code: data.warehouse_postal_code,
          warehouse_country: data.warehouse_country,
          warehouse_phone: data.warehouse_phone,
          warehouse_email: data.warehouse_email,
          // Product Defaults
          default_product_weight: data.default_product_weight || 0.5,
          default_product_length: data.default_product_length || 10,
          default_product_width: data.default_product_width || 10,
          default_product_height: data.default_product_height || 5,
          default_weight_unit: data.default_weight_unit || "kg",
          default_dim_unit: data.default_dim_unit || "cm",
        },
      };

      // console.log("store setting", settingData, "data", data);
      // return;

      if (!isSave) {
        const res = await SettingServices.updateStoreSetting(settingData);
        setIsUpdate(true);
        setIsSubmitting(false);
        window.location.reload();
        notifySuccess(res.message);
      } else {
        const res = await SettingServices.addStoreSetting(settingData);
        setIsUpdate(true);
        setIsSubmitting(false);
        window.location.reload();
        notifySuccess(res.message);
      }
    } catch (err) {
      // console.log("err", err);
      notifyError(err?.response?.data?.message || err?.message);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await SettingServices.getStoreSetting();
        // console.log("res>>>", res);
        if (res) {
          setIsSave(false);
          // for store setting
          setEnabledCOD(res.cod_status);
          setEnabledStripe(res.stripe_status);
          setEnabledRazorPay(res.razorpay_status);
          setEnableFbPixel(res.fb_pixel_status);
          setEnabledTawkChat(res.tawk_chat_status);
          setEnabledGoogleLogin(res.google_login_status);
          setEnabledGithubLogin(res.github_login_status);
          setEnabledFacebookLogin(res.facebook_login_status);
          setEnabledGoogleAnalytics(res.google_analytic_status);
          setEnabledFirebase(res.firebase_status);
          setEnabledStallion(res.stallion_status);
          setEnabledCloudinary(res.cloudinary_status);
          setValue("stripe_key", res.stripe_key);
          setValue("stripe_secret", res.stripe_secret);
          setValue("razorpay_id", res.razorpay_id);
          setValue("razorpay_secret", res.razorpay_secret);
          setValue("google_id", res.google_id);
          setValue("google_secret", res.google_secret);
          setValue("github_id", res.github_id);
          setValue("github_secret", res.github_secret);
          setValue("facebook_id", res.facebook_id);
          setValue("facebook_secret", res.facebook_secret);
          // setValue("nextauth_secret", res.nextauth_secret);
          // setValue("next_api_base_url", res.next_api_base_url);
          setValue("google_analytic_key", res.google_analytic_key);
          setValue("fb_pixel_key", res.fb_pixel_key);
          setValue("tawk_chat_property_id", res.tawk_chat_property_id);
          setValue("tawk_chat_widget_id", res.tawk_chat_widget_id);
          setValue("firebase_api_key", res.firebase_api_key);
          setValue("firebase_auth_domain", res.firebase_auth_domain);
          setValue("firebase_project_id", res.firebase_project_id);
          setValue("firebase_storage_bucket", res.firebase_storage_bucket);
          setValue(
            "firebase_messaging_sender_id",
            res.firebase_messaging_sender_id,
          );
          setValue("firebase_app_id", res.firebase_app_id);
          setValue("firebase_measurement_id", res.firebase_measurement_id);
          setValue("stallion_api_key_sandbox", res.stallion_api_key_sandbox);
          setValue("stallion_api_key_prod", res.stallion_api_key_prod);
          setValue("stallion_base_url_sandbox", res.stallion_base_url_sandbox);
          setValue("stallion_base_url_prod", res.stallion_base_url_prod);
          setValue("stallion_webhook_secret", res.stallion_webhook_secret);
          setValue("cloudinary_cloud_name", res.cloudinary_cloud_name);
          setValue("cloudinary_api_key", res.cloudinary_api_key);
          setValue("cloudinary_api_secret", res.cloudinary_api_secret);
          setValue("cloudinary_upload_preset", res.cloudinary_upload_preset);
          // Set warehouse fields
          setValue("warehouse_name", res.warehouse_name);
          setValue("warehouse_address_line1", res.warehouse_address_line1);
          setValue("warehouse_city", res.warehouse_city);
          setValue("warehouse_state", res.warehouse_state);
          setValue("warehouse_postal_code", res.warehouse_postal_code);
          setValue("warehouse_country", res.warehouse_country);
          setValue("warehouse_phone", res.warehouse_phone);
          setValue("warehouse_email", res.warehouse_email);
          // Set product default fields
          setValue("default_product_weight", res.default_product_weight || 0.5);
          setValue("default_product_length", res.default_product_length || 10);
          setValue("default_product_width", res.default_product_width || 10);
          setValue("default_product_height", res.default_product_height || 5);
          setValue("default_weight_unit", res.default_weight_unit || "kg");
          setValue("default_dim_unit", res.default_dim_unit || "cm");
        }
      } catch (err) {
        notifyError(err?.response?.data?.message || err.message);
      }
    })();
  }, []);

  return {
    errors,
    register,
    isSave,
    favicon,
    setFavicon,
    metaImg,
    setMetaImg,
    isSubmitting,
    onSubmit,
    handleSubmit,
    enabledCOD,
    setEnabledCOD,
    enabledStripe,
    setEnabledStripe,
    enabledFirebase,
    setEnabledFirebase,
    enabledStallion,
    setEnabledStallion,
    enabledCloudinary,
    setEnabledCloudinary,
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
  };
};

export default useStoreSettingSubmit;
