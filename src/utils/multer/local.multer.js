// import multer from "multer";
// import path from "node:path";
// import fs from "node:fs";

// import { fileTypeFromFile } from "file-type";


// const DETECTION_SAMPLE_SIZE = 4100; // video 3gb

// export const readMagicNumber = async (filePath) => {
//     return await fileTypeFromFile(filePath);
// };
// const collectFiles = (req) => {
//     if (req.file) return [req.file]; // single
//     if (Array.isArray(req.files)) return req.files; // array
//     if (req.files) return Object.values(req.files).flat(); // fields
//     return [];
// };
// const removeFiles = (files) =>{
//   Promise.all(files.map((f) => fs.promises.unlink(f.path).catch(() => {})));
// };

// export const validationMagicNumbers = (allowedTypes = []) => {
//   const allowed = allowedTypes.map((t) =>
//     t === "image/jpg" ? "image/jpeg" : t,
//   );

//   return async (req, res, next) => {
//     const files = collectFiles(req);
//     if (!files.length) return next();

//     try {
//       for (const file of files) {
//         const type = await readMagicNumber(file.path);

//         if (!type || !allowed.includes(type.mime)) {
//           throw BadRequestException({
//             message: `Invalid file type: ${file.originalname} content does not match an allowed type`,
//           });
//         }
//       }
//       return next();
//     } catch (error) {
//       await removeFiles(files);
//       return next(error);
//     }
//   };
// };

// export const fileValidation = {
//   images: ["image/png", "image/jpg", "image/jpeg"],
//   videos: ["video/mp4", "video/mpeg", "video/jpeg"],
//   audios: ["audio/webm", "audio/mpeg", "audio/mp4"],
//   documents: [
//     "application/pdf",
//     "application/msword",
//     "application/vnd.ms-excel",
//   ]
// };

// export const localFileUpload = ({customPath = "general" , validation= [] }) => {
// const basePath = `uploads/${customPath}`;

//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       let userBasePath = basePath ;
//   if (req.user?._id) {
//   userBasePath = `${basePath}/${req.user._id}`;
// }
//       const fullPath = path.resolve(`./src/${userBasePath}`);
//       if (!fs.existsSync(fullPath)) {
//         fs.mkdirSync(fullPath, { recursive: true });
//       }
//       cb(null, path.resolve(fullPath));
//     },
//     filename: (req, file, cb) => {
//       const uniqueFileName =
//         Date.now() + "__" + Math.random() + "__" + file.originalname;
//         file.finalPath = `${basePath}/${req.user._id}/${uniqueFileName}`;
//       cb(null, uniqueFileName);
//     },
//   });

//   const fileFilter = (req, file, cb) => {
//   if (!validation.includes(file.mimetype)) {
//     return cb(new Error("Invalid file type"), false);
//   } else {
//     cb(null, true);
//   }
// };
//   return multer({ storage, fileFilter });
// };

import multer from "multer";
import path from "node:path";
import fs from "node:fs";

import { fileTypeFromFile } from "file-type";

import { BadRequestException } from "../../utils/response/error.response.js";

export const readMagicNumber = async (filePath) => {
  return await fileTypeFromFile(filePath);
};

const collectFiles = (req) => {
  if (req.file) return [req.file];

  if (Array.isArray(req.files)) return req.files;

  if (req.files) return Object.values(req.files).flat();

  return [];
};

const removeFiles = async (files) => {
  await Promise.all(
    files.map((file) =>
      fs.promises.unlink(file.path).catch(() => {}),
    ),
  );
};

export const validationMagicNumbers = (allowedTypes = []) => {
  const allowed = allowedTypes.map((type) =>
    type === "image/jpg" ? "image/jpeg" : type,
  );

  return async (req, res, next) => {
    const files = collectFiles(req);

    if (!files.length) return next();

    try {
      for (const file of files) {
        const type = await readMagicNumber(file.path);

        if (!type || !allowed.includes(type.mime)) {
          throw BadRequestException({
            message: `Invalid file type: ${file.originalname} content does not match an allowed type`,
          });
        }
      }

      return next();
    } catch (error) {
      await removeFiles(files);
      return next(error);
    }
  };
};

export const fileValidation = {
  images: ["image/png", "image/jpeg"],

  videos: ["video/mp4", "video/mpeg"],

  audios: ["audio/webm", "audio/mpeg", "audio/mp4"],

  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.ms-excel",
  ],
};

export const localFileUpload = ({
  customPath = "general",
  validation = [],
} = {}) => {
  const basePath = path.join("uploads", customPath);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const userId = req.user?._id;

      const userBasePath = userId
        ? path.join(basePath, String(userId))
        : basePath;

      const fullPath = path.resolve("./src", userBasePath);

      try {
        fs.mkdirSync(fullPath, { recursive: true });
        cb(null, fullPath);
      } catch (error) {
        cb(error);
      }
    },

    filename: (req, file, cb) => {
      const uniqueFileName =
        `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
        path.extname(file.originalname).toLowerCase();

      const userId = req.user?._id;

      const userBasePath = userId
        ? path.join(basePath, String(userId))
        : basePath;

      file.finalPath = path.join(userBasePath, uniqueFileName);

      cb(null, uniqueFileName);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (!validation.includes(file.mimetype)) {
      return cb(
        BadRequestException({
          message: "Invalid file type",
        }),
      );
    }

    return cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 50 * 1024 * 1024,
      files: 10,
    },
  });
};