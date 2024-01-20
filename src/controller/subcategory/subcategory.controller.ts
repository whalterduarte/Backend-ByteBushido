// SubcategoriaController.ts

import { Request, Response } from "express";
import prisma from "../../libs/prisma";

// MULTER
interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export const addSubcategory = async (req: Request, res: Response) => {
  return res.status(200).json({ res: "SUB" });
};
