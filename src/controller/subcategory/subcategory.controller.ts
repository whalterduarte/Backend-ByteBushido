  import { Request, Response } from "express";
  import prisma from "../../libs/prisma";
  import slugify from "slugify";
  import { UploadedFile } from "../../types/UploadedFile";

  export const addSubcategory = async (req: Request, res: Response) => {
    const { title, categoriaId } = req.body;
    
    // Verificar se a foto foi enviada corretamente
    if (!req.file) {
      return res.status(400).json({ error: "A foto é obrigatória" });
    }
    
    const file = req.file as UploadedFile;
    const fileName = file.filename;
    const photoUrl = `${process.env.BASE}/dist/curso/${fileName}`;

    try {
      // Validar se o título e o ID da categoria estão presentes
      if (!title || !categoriaId) {
        return res.status(400).json({ error: "O título e o ID da categoria são obrigatórios" });
      }

      // Verificar se já existe uma subcategoria com o mesmo slug
      const slugSub = slugify(title, { lower: true });
      const existingSubCategory = await prisma.subcategoria.findFirst({
        where: {
          slugSub: slugSub,
        },
      });
      if (existingSubCategory) {
        return res.status(409).json({ error: `Subcategoria já existente: ${slugSub}` });
      }

      // Criar a nova subcategoria no banco de dados
      const newSubCategory = await prisma.subcategoria.create({
        data: {
          categoriaId: parseInt(categoriaId, 10),
          slugSub,
          title,
          photo: photoUrl,
        },
      });

      return res.status(201).json({ subCategory: newSubCategory });
    } catch (error) {
      console.error("Erro ao adicionar subcategoria:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  };
