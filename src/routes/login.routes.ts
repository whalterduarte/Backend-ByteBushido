import { Router, Request, Response } from "express";
import * as list from "../controller/listUser.controller";
import * as login from "../controller/login.controller";
import * as register from "../controller/register.controller";
import { Auth } from "../middleware/auth";
import multer, { Multer } from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../dist/user");
    // Verifique se o diretório de destino existe
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    let randomNamePhoto = Math.floor(Math.random() * 9999999);
    const originalname = file.originalname || "default";
    cb(null, "user" + originalname + randomNamePhoto + Date.now() + ".jpg");
  },
});

const upload: Multer = multer({
  storage: storage,
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    const allowed: string[] = ["image/jpg", "image/jpeg", "image/png"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

const router = Router();

router.get("/users", Auth.authorizeUser, list.getUser);
router.post("/login", login.login);
router.post("/register", upload.single("photo"), register.newUser);

export default router;
