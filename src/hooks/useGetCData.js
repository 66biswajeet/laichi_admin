import { AdminContext } from "@/context/AdminContext";
import { useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

const useGetCData = () => {
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;

  const location = useLocation();
  // const path = location?.pathname?.split("/")[1];
  const path = location?.pathname?.split("?")[0].split("/")[1];
  //   console.log("location", location?.pathname?.split("/")[1]);

  const [role, setRole] = useState();
  const [accessList, setAccessList] = useState([]);

  // Function to decrypt data
  const decryptData = async (encryptedData, iv) => {
    const secretKey = import.meta.env.VITE_APP_ENCRYPT_PASSWORD; // Your secret password

    // Ensure the secret key is exactly 32 bytes
    const keyBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(secretKey),
    );

    // Convert the encrypted data from hex to a Uint8Array
    const encryptedArray = new Uint8Array(
      encryptedData.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)),
    );

    // Decode IV from hex to ArrayBuffer (must be 16 bytes)
    const ivBuffer = new Uint8Array(
      iv.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)),
    );

    // Decrypt using Web Crypto API
    try {
      const decrypted = await crypto.subtle.decrypt(
        {
          name: "AES-CBC",
          iv: ivBuffer, // IV should be 16 bytes long
        },
        await crypto.subtle.importKey(
          "raw",
          keyBuffer,
          { name: "AES-CBC" },
          false,
          ["decrypt"],
        ),
        encryptedArray, // The encrypted data as Uint8Array
      );

      // Convert the decrypted bytes back to a string
      const decodedData = new TextDecoder().decode(decrypted);
      return decodedData;
    } catch (error) {
      console.error("Decryption failed:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchDecryptedData = async () => {
      // Case 1: adminInfo already contains a direct access_list (no encryption)
      if (
        Array.isArray(adminInfo?.access_list) &&
        adminInfo.access_list.length > 0
      ) {
        setAccessList(adminInfo.access_list);
        if (adminInfo.role) setRole(adminInfo.role);
        return;
      }

      // Case 2: encrypted data present
      if (
        adminInfo?.data &&
        adminInfo?.iv &&
        typeof adminInfo.data === "string" &&
        typeof adminInfo.iv === "string"
      ) {
        try {
          const decryptedString = await decryptData(
            adminInfo.data,
            adminInfo.iv,
          );
          if (!decryptedString) throw new Error("Decryption returned null");

          const decryptedArray = JSON.parse(decryptedString);
          if (!Array.isArray(decryptedArray) || decryptedArray.length === 0) {
            throw new Error("Decrypted payload is not a valid array");
          }

          // accessList = all except last element, role = last element
          const roleFromData = decryptedArray[decryptedArray.length - 1];
          const accessFromData = decryptedArray.slice(
            0,
            decryptedArray.length - 1,
          );

          setRole(roleFromData);
          setAccessList(accessFromData);
          return;
        } catch (error) {
          console.error("Failed to decrypt and parse data:", error);
          // fallthrough to safe fallback below
        }
      }

      // Fallback: set empty access list and keep role if present on adminInfo
      setAccessList(
        Array.isArray(adminInfo?.access_list) ? adminInfo.access_list : [],
      );
      setRole(adminInfo?.role);
    };

    fetchDecryptedData();
  }, [adminInfo]);
  // console.log("adminInfo", adminInfo, "accessList", accessList);

  return {
    role,
    path,
    accessList,
  };
};

export default useGetCData;
