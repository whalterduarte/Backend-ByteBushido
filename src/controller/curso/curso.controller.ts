import { Request, Response } from "express";
import prisma from "../../libs/prisma";
import slugify from "slugify";
import { UploadedFile } from "../../types/UploadedFile";

//ADD CURSO
export const addCursos = async (req: Request, res: Response) => {
  const { title, description, git, subcategoriaId } = req.body;
  const file = req.file as UploadedFile;
  const fileName = file.filename;
  const video = `${process.env.BASE}/dist/curso/${fileName}`;
  try {
    if (!title) {
      return res.status(400).json({ Server: "O título é obrigatório" });
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
        .json({ Server: `Curso ja existente:  ${slugCurso}` });
    }
    if (!title || !video || !subcategoriaId) {
      return res.status(404).json({ Server: "Preencha os campos" });
    }
    //Accpts only video
    if (req.file) {
      const file = req.file as UploadedFile;
    } else {
      res.status(404).json({ Server: "Video não enviado" });
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
    return res.status(500).json({ err: "Erro interno", error });
  }
};
