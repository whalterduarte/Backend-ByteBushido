import { Router, Request, Response } from "express";
import * as category from "../controller/category/category.controller";
import * as subcategoria from "../controller/subcategory/subcategory.controller";
import * as cursos from "../controller/curso/curso.controller";
import multer, { Multer } from "multer";
import { Auth } from "../middleware/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "sa-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const upload: Multer = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.BUCKET_NAME || "",
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req: Request, file, cb) => {
      let randomNamePhoto = Math.floor(Math.random() * 9999999);
      const originalname = file.originalname || "default";
      const fileExtension = originalname.split(".").pop();
      cb(
        null,
        `files/cursos${originalname}${randomNamePhoto}${Date.now()}.${fileExtension}`
      );
    },
  }),
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    const allowed: string[] = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "video/mp4",
      "application/zip",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

const router = Router();
//CATEGORY
router.get("/", category.listCategory);
router.post(
  "/category",
  Auth.authorizeAdmin,
  (req: Request, res: Response, next: any) => {
    upload.single("photo")(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        // Erros do Multer
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({ error: "Apenas uma foto permitida" });
        }
        return res.status(500).json({ error: "Erro durante o upload" });
      } else if (err) {
        // Outros erros
        return res
          .status(500)
          .json({ error: err.message || "Erro durante o upload" });
      }
      next();
    });
  },
  category.addCategory
);

//SUB CATEGORY
router.post(
  "/categorias/subcategorias",
  Auth.authorizeAdmin,
  (req: Request, res: Response, next: any) => {
    upload.single("photo")(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        // Erros do Multer
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({ error: "Apenas uma foto permitida" });
        }
        return res.status(500).json({ error: "Erro durante o upload" });
      } else if (err) {
        // Outros erros
        return res
          .status(500)
          .json({ error: err.message || "Erro durante o upload" });
      }
      next();
    });
  },
  subcategoria.addSubcategory
);

//Cursos
router.post(
  "/categorias/subcategorias/cursos",
  Auth.authorizeAdmin,
  (req: Request, res: Response, next: any) => {
    upload.single("video")(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        // Erros do Multer
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({ error: "Apenas um aqruivo permitido" });
        }
        return res.status(500).json({ error: "Erro durante o upload" });
      } else if (err) {
        // Outros erros
        return res
          .status(500)
          .json({ error: err.message || "Erro durante o upload" });
      }
      next();
    });
  },
  cursos.addCursos
);
export default router;
