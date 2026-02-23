import Cookies from "js-cookie";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";

//internal import
import { AdminContext } from "@/context/AdminContext";
import AdminServices from "@/services/AdminServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import { auth } from "@/config/firebase";

const useLoginSubmit = () => {
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(AdminContext);
  const history = useHistory();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ name, email, verifyEmail, password, role }) => {
    setLoading(true);
    const cookieTimeOut = 0.5;

    try {
      if (location.pathname === "/login") {
        // Step 1: Authenticate with Firebase Email/Password
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password,
          );
          const user = userCredential.user;

          // Step 2: Check if email is verified
          if (!user.emailVerified) {
            // Email not verified - send verification email and sign out
            try {
              await sendEmailVerification(user);
              notifySuccess(
                "Verification link has been sent. Please check your email to verify your account.",
              );
            } catch (sendError) {
              // Handle rate limiting and other send errors
              let sendErrorMessage = "Email not verified.";

              if (sendError.code === "auth/too-many-requests") {
                sendErrorMessage =
                  "Too many verification attempts. Please try again in a few minutes.";
              } else if (sendError.message?.includes("TOO_MANY_ATTEMPTS")) {
                sendErrorMessage =
                  "Too many verification attempts. Firebase rate-limited this request. Please try again later.";
              } else {
                sendErrorMessage +=
                  " Could not send verification email. Please contact support.";
              }

              notifyError(sendErrorMessage);
            }

            await signOut(auth);
            setLoading(false);
            return;
          }

          // Step 3: Email is verified - proceed with backend login
          const res = await AdminServices.loginAdmin({ email, password });

          if (res) {
            notifySuccess("Login Success!");
            dispatch({ type: "USER_LOGIN", payload: res });
            Cookies.set("adminInfo", JSON.stringify(res), {
              expires: cookieTimeOut,
              sameSite: "None",
              secure: true,
            });
            history.replace("/dashboard");
          }
        } catch (firebaseError) {
          // Handle Firebase authentication errors
          let errorMessage = "Authentication failed";

          switch (firebaseError.code) {
            case "auth/invalid-email":
              errorMessage = "Invalid email address";
              break;
            case "auth/user-disabled":
              errorMessage = "This account has been disabled";
              break;
            case "auth/user-not-found":
              errorMessage = "No account found with this email";
              break;
            case "auth/wrong-password":
              errorMessage = "Incorrect password";
              break;
            case "auth/too-many-requests":
              errorMessage = "Too many failed attempts. Please try again later";
              break;
            case "auth/network-request-failed":
              errorMessage = "Network error. Please check your connection";
              break;
            default:
              errorMessage = firebaseError.message || "Authentication failed";
          }

          notifyError(errorMessage);
          setLoading(false);
          return;
        }
      }

      if (location.pathname === "/signup") {
        const res = await AdminServices.registerAdmin({
          name,
          email,
          password,
          role,
        });

        if (res) {
          notifySuccess("Register Success!");
          dispatch({ type: "USER_LOGIN", payload: res });
          Cookies.set("adminInfo", JSON.stringify(res), {
            expires: cookieTimeOut,
            sameSite: "None",
            secure: true,
          });
          history.replace("/");
        }
      }

      if (location.pathname === "/forgot-password") {
        const res = await AdminServices.forgetPassword({ verifyEmail });

        notifySuccess(res.message);
      }
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    onSubmit,
    register,
    handleSubmit,
    errors,
    loading,
  };
};

export default useLoginSubmit;
