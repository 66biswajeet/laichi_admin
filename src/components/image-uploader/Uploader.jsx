// import React, { useEffect, useState } from "react";
// import { t } from "i18next";
// import axios from "axios";
// import { useDropzone } from "react-dropzone";
// import { DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { FiUploadCloud, FiXCircle } from "react-icons/fi";
// import Pica from "pica";

// // Internal imports
// import useUtilsFunction from "@/hooks/useUtilsFunction";
// import { notifyError, notifySuccess } from "@/utils/toast";
// import Container from "@/components/image-uploader/Container";

// const Uploader = ({
//   setImageUrl,
//   imageUrl,
//   product,
//   folder,
//   targetWidth = 800, // Set default fixed width
//   targetHeight = 800, // Set default fixed height
// }) => {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [err, setError] = useState("");
//   const pica = Pica(); // Initialize Pica instance
//   const { globalSetting } = useUtilsFunction();

//   const { getRootProps, getInputProps, fileRejections } = useDropzone({
//     accept: {
//       "image/*": [".jpeg", ".jpg", ".png", ".webp"],
//     },
//     multiple: product ? true : false,
//     maxSize: 5242880, // 5 MB in bytes
//     maxFiles: globalSetting?.number_of_image_per_product || 2,
//     onDrop: async (acceptedFiles) => {
//       const resizedFiles = await Promise.all(
//         acceptedFiles.map((file) =>
//           resizeImageToFixedDimensions(file, targetWidth, targetHeight)
//         )
//       );
//       setFiles(
//         resizedFiles.map((file) =>
//           Object.assign(file, {
//             preview: URL.createObjectURL(file),
//           })
//         )
//       );
//     },
//   });

//   const resizeImageToFixedDimensions = async (file, width, height) => {
//     const img = new Image();
//     img.src = URL.createObjectURL(file);

//     await img.decode();

//     // Calculate scaling to fit within target dimensions while preserving aspect ratio
//     const scale = Math.min(width / img.width, height / img.height);
//     const scaledWidth = img.width * scale;
//     const scaledHeight = img.height * scale;

//     // Create intermediate canvas for scaled image
//     const scaledCanvas = document.createElement("canvas");
//     scaledCanvas.width = scaledWidth;
//     scaledCanvas.height = scaledHeight;

//     // Create final canvas with target dimensions
//     const finalCanvas = document.createElement("canvas");
//     finalCanvas.width = width;
//     finalCanvas.height = height;

//     return new Promise((resolve) => {
//       pica
//         .resize(img, scaledCanvas, {
//           unsharpAmount: 80,
//           unsharpRadius: 0.6,
//           unsharpThreshold: 2,
//         })
//         .then((result) => {
//           // Center the scaled image on the final canvas with white background
//           const ctx = finalCanvas.getContext("2d");

//           // Fill background with white
//           ctx.fillStyle = "#ffffff";
//           ctx.fillRect(0, 0, width, height);

//           const x = (width - scaledWidth) / 2;
//           const y = (height - scaledHeight) / 2;
//           ctx.drawImage(result, x, y, scaledWidth, scaledHeight);

//           return pica.toBlob(finalCanvas, file.type, 0.9);
//         })
//         .then((blob) => {
//           const resizedFile = new File([blob], file.name, { type: file.type });
//           resolve(resizedFile);
//         });
//     });
//   };

//   useEffect(() => {
//     if (fileRejections) {
//       fileRejections.map(({ file, errors }) => (
//         <li key={file.path}>
//           {file.path} - {file.size} bytes
//           <ul>
//             {errors.map((e) => (
//               <li key={e.code}>
//                 {e.code === "too-many-files"
//                   ? notifyError(
//                       `Maximum ${globalSetting?.number_of_image_per_product} Image Can be Upload!`
//                     )
//                   : notifyError(e.message)}
//               </li>
//             ))}
//           </ul>
//         </li>
//       ));
//     }

//     if (files) {
//       files.forEach((file) => {
//         if (
//           product &&
//           imageUrl?.length + files?.length >
//             globalSetting?.number_of_image_per_product
//         ) {
//           return notifyError(
//             `Maximum ${globalSetting?.number_of_image_per_product} Image Can be Upload!`
//           );
//         }

//         setLoading(true);
//         setError("Uploading....");

//         const name = file.name.replaceAll(/\s/g, "");
//         const public_id = name?.substring(0, name.lastIndexOf("."));

//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append(
//           "upload_preset",
//           import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET
//         );
//         formData.append("cloud_name", import.meta.env.VITE_APP_CLOUD_NAME);
//         formData.append("folder", folder);
//         formData.append("public_id", public_id);

//         axios({
//           url: import.meta.env.VITE_APP_CLOUDINARY_URL,
//           method: "POST",
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//           data: formData,
//         })
//           .then((res) => {
//             notifySuccess("Image Uploaded successfully!");
//             setLoading(false);
//             if (product) {
//               setImageUrl((imgUrl) => [...imgUrl, res.data.secure_url]);
//             } else {
//               setImageUrl(res.data.secure_url);
//             }
//           })
//           .catch((err) => {
//             console.error("err", err);
//             notifyError(err.Message);
//             setLoading(false);
//           });
//       });
//     }
//   }, [files]);

//   const thumbs = files.map((file) => (
//     <div key={file.name}>
//       <div>
//         <img
//           className="inline-flex border-2 border-gray-100 w-24 max-h-24"
//           src={file.preview}
//           alt={file.name}
//         />
//       </div>
//     </div>
//   ));

//   useEffect(
//     () => () => {
//       files.forEach((file) => URL.revokeObjectURL(file.preview));
//     },
//     [files]
//   );

//   const handleRemoveImage = async (img) => {
//     try {
//       setLoading(false);
//       notifyError("Image delete successfully!");
//       if (product) {
//         const result = imageUrl?.filter((i) => i !== img);
//         setImageUrl(result);
//       } else {
//         setImageUrl("");
//       }
//     } catch (err) {
//       console.error("err", err);
//       notifyError(err.Message);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full text-center">
//       <div
//         className="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 pt-5 pb-6"
//         {...getRootProps()}
//       >
//         <input {...getInputProps()} />
//         <span className="mx-auto flex justify-center">
//           <FiUploadCloud className="text-3xl text-emerald-500" />
//         </span>
//         <p className="text-sm mt-2">{t("DragYourImage")}</p>
//         <em className="text-xs text-gray-400">{t("imageFormat")}</em>
//       </div>

//       <div className="text-emerald-500">{loading && err}</div>
//       <aside className="flex flex-row flex-wrap mt-4">
//         {product ? (
//           <DndProvider backend={HTML5Backend}>
//             <Container
//               setImageUrl={setImageUrl}
//               imageUrl={imageUrl}
//               handleRemoveImage={handleRemoveImage}
//             />
//           </DndProvider>
//         ) : !product && imageUrl ? (
//           <div className="relative">
//             <img
//               className="inline-flex border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2"
//               src={imageUrl}
//               alt="product"
//             />
//             <button
//               type="button"
//               className="absolute top-0 right-0 text-red-500 focus:outline-none"
//               onClick={() => handleRemoveImage(imageUrl)}
//             >
//               <FiXCircle />
//             </button>
//           </div>
//         ) : (
//           thumbs
//         )}
//       </aside>
//     </div>
//   );
// };

// export default Uploader;

import React, { useEffect, useState } from "react";
import { t } from "i18next";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FiUploadCloud, FiXCircle } from "react-icons/fi";
import Pica from "pica";

// Internal imports
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { notifyError, notifySuccess } from "@/utils/toast";
import Container from "@/components/image-uploader/Container";

const Uploader = ({
  setImageUrl,
  imageUrl,
  product,
  folder,
  targetWidth = 800, // Set default fixed width
  targetHeight = 800, // Set default fixed height
}) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState("");
  const pica = Pica(); // Initialize Pica instance
  const { globalSetting } = useUtilsFunction();

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: product ? true : false,
    maxSize: 5242880, // 5 MB in bytes
    maxFiles: globalSetting?.number_of_image_per_product || 2,
    onDrop: async (acceptedFiles) => {
      const resizedFiles = await Promise.all(
        acceptedFiles.map((file) =>
          resizeImageToFixedDimensions(file, targetWidth, targetHeight),
        ),
      );
      setFiles(
        resizedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
    },
  });

  const resizeImageToFixedDimensions = async (file, width, height) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    // Ensure crossOrigin not set here; if images come from local file it's fine.
    await img.decode();

    // Calculate scaling to fit within target dimensions while preserving aspect ratio
    const scale = Math.min(width / img.width, height / img.height);
    const scaledWidth = Math.max(1, Math.round(img.width * scale));
    const scaledHeight = Math.max(1, Math.round(img.height * scale));

    // Create intermediate canvas for scaled image (exact scaled size)
    const scaledCanvas = document.createElement("canvas");
    scaledCanvas.width = scaledWidth;
    scaledCanvas.height = scaledHeight;

    // Create final canvas with target dimensions (center scaled image here)
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = width;
    finalCanvas.height = height;

    // Choose output type: keep png/webp, otherwise prefer png for logos (better sharpness)
    const originalType = file.type || "image/jpeg";
    const outputType =
      originalType === "image/png" || originalType === "image/webp"
        ? originalType
        : "image/png";

    // Perform high-quality resize to scaledCanvas, then composite onto finalCanvas
    await pica.resize(img, scaledCanvas, {
      unsharpAmount: 80,
      unsharpRadius: 0.6,
      unsharpThreshold: 2,
    });

    const ctx = finalCanvas.getContext("2d");
    // Fill background white for consistent appearance (prevents dark/transparent bands)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    const x = Math.round((width - scaledWidth) / 2);
    const y = Math.round((height - scaledHeight) / 2);

    // draw the scaled canvas onto centered final canvas
    ctx.drawImage(scaledCanvas, x, y, scaledWidth, scaledHeight);

    // Create blob from final canvas. Use higher quality for lossy formats.
    const quality =
      outputType === "image/jpeg" || outputType === "image/webp" ? 0.95 : 0.92;

    const blob = await pica.toBlob(finalCanvas, outputType, quality);

    // Ensure filename extension matches output type
    const ext = outputType.split("/")[1] || "png";
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const newName = `${baseName}.${ext}`;

    return new File([blob], newName, { type: outputType });
  };

  useEffect(() => {
    if (fileRejections && fileRejections.length) {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((e) => {
          if (e.code === "too-many-files") {
            notifyError(
              `Maximum ${globalSetting?.number_of_image_per_product} Image Can be Upload!`,
            );
          } else {
            notifyError(e.message);
          }
        });
      });
    }

    if (!files || files.length === 0) return;

    // Upload each file
    files.forEach((file) => {
      if (
        product &&
        (imageUrl?.length || 0) + files.length >
          globalSetting?.number_of_image_per_product
      ) {
        return notifyError(
          `Maximum ${globalSetting?.number_of_image_per_product} Image Can be Upload!`,
        );
      }

      setLoading(true);
      setError("Uploading....");

      const name = file.name.replaceAll(/\s/g, "");
      const public_id = name?.substring(0, name.lastIndexOf(".")) || name;

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET,
      );
      formData.append("cloud_name", import.meta.env.VITE_APP_CLOUD_NAME);
      formData.append("folder", folder);
      formData.append("public_id", public_id);

      // Resolve Cloudinary URL safely; fallback to a constructed endpoint when env var is missing
      const cloudName = import.meta.env.VITE_APP_CLOUD_NAME;
      const cloudinaryUrl =
        import.meta.env.VITE_APP_CLOUDINARY_URL ||
        (cloudName
          ? `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
          : undefined);

      if (!cloudinaryUrl) {
        notifyError(
          "Cloudinary configuration is missing (VITE_APP_CLOUDINARY_URL)",
        );
        setLoading(false);
        return;
      }

      axios({
        url: cloudinaryUrl,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      })
        .then((res) => {
          notifySuccess("Image Uploaded successfully!");
          setLoading(false);
          if (product) {
            setImageUrl((imgUrl) => [...(imgUrl || []), res.data.secure_url]);
          } else {
            setImageUrl(res.data.secure_url);
          }
        })
        .catch((err) => {
          console.error("err", err);
          notifyError(err?.message || "Upload failed");
          setLoading(false);
        });
    });
  }, [files]);

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <div>
        <img
          className="inline-flex border-2 border-gray-100 w-24 max-h-24"
          src={file.preview}
          alt={file.name}
        />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files],
  );

  const handleRemoveImage = async (img) => {
    try {
      setLoading(false);
      notifyError("Image delete successfully!");
      if (product) {
        const result = imageUrl?.filter((i) => i !== img);
        setImageUrl(result);
      } else {
        setImageUrl("");
      }
    } catch (err) {
      console.error("err", err);
      notifyError(err?.message || "Remove failed");
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-center">
      {/* Display recommended image size */}
      {targetWidth && targetHeight && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-left">
          Recommended size: {targetWidth} × {targetHeight} px
        </p>
      )}
      <div
        className="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 pt-5 pb-6"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <span className="mx-auto flex justify-center">
          <FiUploadCloud className="text-3xl text-emerald-500" />
        </span>
        <p className="text-sm mt-2">{t("DragYourImage")}</p>
        <em className="text-xs text-gray-400">{t("imageFormat")}</em>
      </div>

      <div className="text-emerald-500">{loading && err}</div>
      <aside className="flex flex-row flex-wrap mt-4">
        {product ? (
          <DndProvider backend={HTML5Backend}>
            <Container
              setImageUrl={setImageUrl}
              imageUrl={imageUrl}
              handleRemoveImage={handleRemoveImage}
            />
          </DndProvider>
        ) : !product && imageUrl ? (
          <div className="relative">
            <img
              className="inline-flex border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2"
              src={imageUrl}
              alt="product"
            />
            <button
              type="button"
              className="absolute top-0 right-0 text-red-500 focus:outline-none"
              onClick={() => handleRemoveImage(imageUrl)}
            >
              <FiXCircle />
            </button>
          </div>
        ) : (
          thumbs
        )}
      </aside>
    </div>
  );
};

export default Uploader;
