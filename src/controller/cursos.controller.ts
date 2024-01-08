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
  //GET POR CATEGORIA DINAMICA
  export const Category = async (req: Request, res: Response) => {
    const {slug} = req.params
    const categoria = await prisma.categoria.findFirst({
      where:{
        slug
      }
    })
    try {
      if (!categoria) {
        return res.status(404).json({status: false, Server: 'Nenhum categoria encontrado'})
      }
      return await res.json({status: true, categoria})
  
    } catch (error) {
      console.log(error)
      return res.status(404).json({Server: 'Error interno'})
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


// LOGICA SUB-CATEGORIA
  //GET ALL E LISTA PELA DATA
  export const listSubcategories = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
  const pageSize = 5; 
  try {
    const subCategory = await prisma.subcategoria.findMany({
      take: pageSize, 
      skip: (page - 1) * pageSize,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ subCategory });
  } catch (error) {
    console.error('Erro ao listar sub categorias:', error);
    return res.status(500).json({ error: 'Erro ao listar sub categorias' });
  }
  };

  //GET SUB-CATEGORY

  export const subCategory = async (req: Request, res: Response) => {
    const {slugSubCategory} = req.params
    
    const subCategoria = await prisma.subcategoria.findFirst({
      where:{
        slugSubCategory
      }
    })
    try {
      if (!subCategoria) {
        return res.status(404).json({status: false, Server: 'Nenhum sub categoria encontrado'})
      }
      return await res.json({status: true, subCategoria})
  
    } catch (error) {
      console.log(error)
      return res.status(404).json({Server: 'Error interno'})
    }
  };



  //POST SUB-CATEGORIA
  export const addSubcategory = async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(404).json({ error: 'File not sent' });
    }
  
    const file = req.file as UploadedFile;
  
    const { slugSubCategory, title, categoriaId } = req.body;
    if (!slugSubCategory || !title || !categoriaId) {
      return res.status(400).json({ error: 'title e categoriaId são campos obrigatórios' });
    }
  
    try {
      const existingSubcategory = await prisma.subcategoria.findFirst({
        where: {
          slugSubCategory: slugSubCategory,
        },
      });
  
      if (existingSubcategory) {
        return res.status(409).json({ error: 'Subcategory with the same slug already exists' });
      }
  
      const photo: string = `${process.env.BASE}/${(req.file as Express.MulterS3.File)?.key}`;
  
      const newSubcategory = await prisma.subcategoria.create({
        data: {
          slugSubCategory,
          title,
          photo,
          categoriaId: parseInt(categoriaId),
        },
      });
  
      return res.status(201).json({ subcategory: newSubcategory });
    } catch (error) {
      console.error('Erro ao adicionar subcategoria:', error);
      return res.status(500).json({ error: 'Erro ao adicionar subcategoria' });
    }
  };