import e from "express";
import multer from "multer";

const storage = multer.diskStorage({
  filename: (_req: e.Request, file: Express.Multer.File, cb: Function) => {
    cb(null, file.originalname);
  },
});

const multerUpload = multer({ storage: storage });

export default multerUpload;
