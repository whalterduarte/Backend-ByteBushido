import { Request, Response } from "express";
import prisma from "../../libs/prisma";
import slugify from "slugify";

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

export const addCursos = async (req: Request, res: Response) => {
  const { title, description, git, subcategoriaId } = req.body;
  const video: string = `${process.env.BASE}/${
    (req.file as Express.MulterS3.File)?.key
  }`;
  try {
    if (!title) {
      return res.status(400).json({ error: "O título é obrigatório" });
    }
    const slugCurso = slugify(title, { lower: true });
    const existngCurse = await prisma.curso.findFirst({
      where: {
        slugCurso: slugCurso,
      },
    });
    if (existngCurse) {
      return res
        .status(409)
        .json({ error: `Curso ja existente:  ${slugCurso}` });
    }
    if (!title || !video || !subcategoriaId) {
      return res.status(404).json({ error: "Preencha os campos" });
    }
    //Accpts only video
    if (req.file) {
      const file = req.file as UploadedFile;
    } else {
      res.status(404).json({ error: "Video não enviado" });
      return;
    }

    const newCurso = await prisma.curso.create({
      data: {
        subcategoriaId: parseInt(subcategoriaId, 10),
        slugCurso,
        title,
        description,
        git,
        video,
      },
    });
    return res.status(201).json({ curso: newCurso });
  } catch (error) {
    console.log("Erro interno", error);
    return res.status(500).json({ err: "Error interno", error });
  }
};
