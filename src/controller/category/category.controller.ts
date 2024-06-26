import { Request, Response } from "express";
import prisma from "../../libs/prisma";
import slugify from "slugify";
import { UploadedFile } from "../../types/UploadedFile";

// LOGICA CATEGORIA
//GET E LISTA PELA DATA
export const listCategory = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = 10;
  try {
    const categoriesWithSubcategoriesAndCourses =
      await prisma.categoria.findMany({
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          subcategorias: {
            include: {
              cursos: true,
            },
          },
        },
      });

    return res.json({ categories: categoriesWithSubcategoriesAndCourses });
  } catch (error) {
    console.error("Erro ao listar categorias:", error);
    return res.status(500).json({ Server: "Erro ao listar categorias" });
  }
};

//POST ADICIONA CATEGORIA
export const addCategory = async (req: Request, res: Response) => {
  const { title } = req.body as {
    title: string;
  };
  const file = req.file as UploadedFile;
  const fileName = file.filename;
  const photo = `${process.env.BASE}/dist/curso/${fileName}`;
  try {
    if (!title) {
      return res.status(400).json({ Server: "O título é obrigatório" });
    }
    const slug = slugify(title, { lower: true });
    const existingCategory = await prisma.categoria.findFirst({
      where: {
        slug: slug,
      },
    });
    if (existingCategory) {
      return res.status(409).json({ Server: "Categoria ja existente" });
    }

    if (!photo || !title) {
      return res.status(404).json({ Server: "Preencha os campos" });
    }
    //Accpts only image
    if (req.file) {
      const file = req.file as UploadedFile;
    } else {
      res.status(404).json({ Server: "Foto não enviada" });
      return;
    }
    const newCategory = await prisma.categoria.create({
      data: {
        slug,
        title,
        photo,
      },
    });

    return res.status(201).json({ category: newCategory });
  } catch (error) {
    console.error("Erro ao adicionar categoria:", error);
    return res.status(500).json({ Server: "Erro ao adicionar categoria" });
  }
};
