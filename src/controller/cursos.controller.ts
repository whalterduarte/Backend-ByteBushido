import { Request, Response } from "express"
import prisma from "../libs/prisma"
  //MULTER 
    //Types img
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
// LOGICA CATEGORIA 
  //GET E LISTA PELA DATA
export const listCategory = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = 3; 
  try {
    const categories = await prisma.categoria.findMany({
      take: pageSize, 
      skip: (page - 1) * pageSize,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ categories });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return res.status(500).json({ error: 'Erro ao listar categorias' });
  }
};

  //POST ADICIONA CATEGORIA
  export const addCategory = async (req: Request, res: Response) => {
  //Accpts only image
  if(req.file){
  const file = req.file as UploadedFile
 }else{
   res.status(404).json({error: 'File not sent'})
   return
 }
    const { slug, title} = req.body;
    const photo: string = `${process.env.BASE}/${(req.file as Express.MulterS3.File)?.key}`;
    try {
      const existingCategory = await prisma.categoria.findFirst({
        where: {
          slug: slug
        }
      })
      if(existingCategory) {
       return res.status(409).json({error: 'Categoria ja existente'})
      }

     if(!slug || !title) {
      return res.status(404).json({error: 'Preencha os campos'})
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
      console.error('Erro ao adicionar categoria:', error);
      return res.status(500).json({ error: 'Erro ao adicionar categoria' });
    }
  };