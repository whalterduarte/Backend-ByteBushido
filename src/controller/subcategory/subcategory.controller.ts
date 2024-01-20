import { Request, Response } from "express";
import prisma from "../../libs/prisma";
import slugify from "slugify";
import { UploadedFile } from "../../types/UploadedFile";
//ADD SUB-CATEGORY
export const addSubcategory = async (req: Request, res: Response) => {
  const { title, categoriaId } = req.body;
  const photo: string = `${process.env.BASE}/${
    (req.file as Express.MulterS3.File)?.key
  }`;
  try {
    if (!title) {
      return res.status(400).json({ error: "O título é obrigatório" });
    }
    const slugSub = slugify(title, { lower: true });
    const existingSubCategory = await prisma.subcategoria.findFirst({
      where: {
        slugSub: slugSub,
      },
    });
    if (existingSubCategory) {
      return res
        .status(409)
        .json({ error: `Sub Categoria ja existente:  ${slugSub}` });
    }

    if (!title || !photo) {
      return res.status(404).json({ error: "Preencha os campos" });
    }
    //Accpts only image
    if (req.file) {
      const file = req.file as UploadedFile;
    } else {
      res.status(404).json({ error: "Photo não enviada" });
      return;
    }
    const newSubCategory = await prisma.subcategoria.create({
      data: {
        categoriaId: parseInt(categoriaId, 10),
        slugSub,
        title,
        photo,
      },
    });
    return res.status(201).json({ subCategory: newSubCategory });
  } catch (error) {
    console.error("Erro ao adicionar subcategoria:", error);
    return res.status(500).json({ res: "Error interno", error });
  }
};
