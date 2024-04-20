import { Router, Request, Response } from "express";
import multer, { Multer } from "multer";
import path from "path";
import * as categoryController from "../controller/category/category.controller";
import * as subcategoryController from "../controller/subcategory/subcategory.controller";
import * as cursoController from "../controller/curso/curso.controller";
import { Auth } from "../middleware/auth";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../dist/curso");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const randomName = Math.floor(Math.random() * 9999999);
    const originalname = file.originalname || "default";
    const extension = path.extname(originalname);
    cb(null, `curso_${randomName}_${Date.now()}${extension}`);
  },
});

const upload: Multer = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
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

// CATEGORY
router.get("/", Auth.authorizeUser, categoryController.listCategory);

router.post(
  "/category",
  Auth.authorizeAdmin,
  upload.single("photo"),
  categoryController.addCategory
);

// SUBCATEGORY
router.post(
  "/categorias/subcategorias",
  Auth.authorizeAdmin,
  upload.single("photo"),
  subcategoryController.addSubcategory
);

// CURSO
router.post(
  "/categorias/subcategorias/cursos",
  Auth.authorizeAdmin,
  upload.single("video"),
  cursoController.addCursos
);

export default router;
