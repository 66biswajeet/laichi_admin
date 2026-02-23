import { Button, Input } from "@windmill/react-ui";
import React, { useRef, useState, useCallback } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Error from "@/components/form/others/Error";
import LabelArea from "@/components/form/selectOption/LabelArea";
import AdminServices from "@/services/AdminServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import ImageLight from "@/assets/img/forgot-password-office.jpeg";
import ImageDark from "@/assets/img/forgot-password-office-dark.jpeg";
// import PasswordStrengthIndicator from "@/components/form/others/PasswordStrengthIndicator"; // Optional

const ResetPassword = () => {
  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useHistory();
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const password = useRef("");
  password.current = watch("newPassword", "");

  const calculatePasswordStrength = useCallback((password) => {
    let strength = 0;
    if (password.length >= 10) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  }, []);

  React.useEffect(() => {
    if (password.current) {
      setPasswordStrength(calculatePasswordStrength(password.current));
    }
  }, [password.current, calculatePasswordStrength]);

  const submitHandler = async ({ newPassword }) => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await AdminServices.resetPassword({ newPassword, token });
      notifySuccess(res.message);
      // Redirect to login after successful reset
      setTimeout(() => history.push("/login"), 2000);
    } catch (err) {
      notifyError(
        err?.response?.data?.message || err.message || "Reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordValidation = {
    required: t("You must specify a password") || "You must specify a password",
    minLength: {
      value: 10,
      message:
        t("Password must have at least 10 characters") ||
        "Password must have at least 10 characters",
    },
    validate: {
      hasUpperCase: (value) =>
        /[A-Z]/.test(value) ||
        t("Password must contain at least one uppercase letter") ||
        "Password must contain at least one uppercase letter",
      hasLowerCase: (value) =>
        /[a-z]/.test(value) ||
        t("Password must contain at least one lowercase letter") ||
        "Password must contain at least one lowercase letter",
      hasNumber: (value) =>
        /[0-9]/.test(value) ||
        t("Password must contain at least one number") ||
        "Password must contain at least one number",
    },
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                {t("ResetPassword")}
              </h1>

              <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                {t("Enter your new password below")}
              </p>

              <form onSubmit={handleSubmit(submitHandler)}>
                <LabelArea label={t("New Password")} />
                <Input
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder={t("Enter new password")}
                  {...register("newPassword", passwordValidation)}
                  className="mt-1"
                  disabled={loading}
                />
                <Error errorName={errors.newPassword} />

                {/* {password.current && (
                  <PasswordStrengthIndicator strength={passwordStrength} />
                )} */}

                <div className="mt-6">
                  <LabelArea label={t("Confirm Password")} />
                  <Input
                    name="confirm_password"
                    type="password"
                    autoComplete="new-password"
                    placeholder={t("Confirm your password")}
                    {...register("confirm_password", {
                      required:
                        t("Please confirm your password") ||
                        "Please confirm your password",
                      validate: (value) =>
                        value === password.current ||
                        t("The passwords do not match") ||
                        "The passwords do not match",
                    })}
                    className="mt-1"
                    disabled={loading}
                  />
                  <Error errorName={errors.confirm_password} />
                </div>

                <Button
                  disabled={loading || !isValid}
                  type="submit"
                  block
                  className="mt-6 h-12"
                >
                  {loading ? t("Resetting...") : t("Reset Password")}
                </Button>
              </form>

              <p className="mt-4 text-center">
                <Link
                  className="text-sm font-medium text-emerald-500 dark:text-emerald-400 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
                  to="/login"
                >
                  {t("Back to Login")}
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
