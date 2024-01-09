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
    // Aceita apenas imagens
    if (!req.file) {
      res.status(404).json({ error: 'Arquivo não enviado' });
      return;
    }
  
    const { title, categoriaId } = req.body;
    const photo: string = `${process.env.BASE}/${(req.file as Express.MulterS3.File)?.key}`;
  
    try {
      // Verifica se todos os campos necessários estão preenchidos
      if (!title || !categoriaId) {
        return res.status(404).json({ error: 'Preencha todos os campos obrigatórios' });
      }
  
      // Gera um slug único
      const slug = await generateUniqueSlugSubcategory(title);
  
      // Converte categoriaId para um número
      const categoriaIdNumber = parseInt(categoriaId, 10);
  
      // Cria uma nova subcategoria associada à categoria especificada
      const newSubcategory = await prisma.subcategoria.create({
        data: {
          slugSubCategory: slug,
          title,
          photo,
          categoriaId: categoriaIdNumber,
        },
      });
  
      return res.status(201).json({ subcategory: newSubcategory });
    } catch (error) {
      console.error('Erro ao adicionar subcategoria:', error);
      return res.status(500).json({ error: 'Erro ao adicionar subcategoria' });
    }
  };
  
  // Função para gerar slugs únicos (verifica se já existe no banco de dados)
  async function generateUniqueSlugSubcategory(title: string): Promise<string> {
    if (!title) {
      console.error('Erro ao gerar slug: o título não pode ser vazio ou undefined.');
      return ''; // Ou outra estratégia apropriada para lidar com títulos vazios ou indefinidos
    }
  
    let slug = title.toLowerCase().replace(/\s+/g, '-');
  
    // Verifica se o slug já existe no banco de dados
    const existingSubcategory = await prisma.subcategoria.findFirst({
      where: {
        slugSubCategory: slug,
      },
    });
  
    // Adiciona um sufixo ao slug se já existir
    if (existingSubcategory) {
      let counter = 1;
      while (true) {
        const newSlug = `${slug}-${counter}`;
        const existing = await prisma.subcategoria.findFirst({
          where: {
            slugSubCategory: newSlug,
          },
        });
        if (!existing) {
          slug = newSlug;
          break;
        }
        counter++;
      }
    }
  
    return slug;
  }
  
  // CURSOS/////////////////

 // Lista todos os cursos
export const listCourses = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = 5; 

  try {
    const courses = await prisma.curso.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ courses });
  } catch (error) {
    console.error('Erro ao listar cursos:', error);
    return res.status(500).json({ error: 'Erro ao listar cursos' });
  }
};

// Recupera detalhes de um curso específico
export const getCourse = async (req: Request, res: Response) => {
  const { slugCursos } = req.params;

  try {
    const course = await prisma.curso.findFirst({
      where: {
        slugCursos,
      },
    });

    if (!course) {
      return res.status(404).json({ status: false, message: 'Nenhum curso encontrado' });
    }

    return res.json({ status: true, course });
  } catch (error) {
    console.error('Erro ao obter curso:', error);
    return res.status(500).json({ error: 'Erro ao obter curso' });
  }
};

  export const Courses = async (req: Request, res: Response) => {
    return res.json({})
  };
  
  //ADD CURSO
  export const addCourse = async (req: Request, res: Response) => {
    // Aceita apenas vídeos
    if (!req.file) {
      res.status(404).json({ error: 'Arquivo não enviado' });
      return;
    }
  
    const { subcategoriaId, title } = req.body;
    const video: string = `${process.env.BASE}/${(req.file as Express.MulterS3.File)?.key}`;
  
    try {
      // Verifica se a subcategoria existe
      const subcategoriaIdNumber = parseInt(subcategoriaId, 10);
  
      const existingSubcategory = await prisma.subcategoria.findUnique({
        where: {
          id: subcategoriaIdNumber,
        },
      });
  
      if (!existingSubcategory) {
        return res.status(404).json({ error: 'Subcategoria não encontrada' });
      }
  
      // Verifica se o título foi fornecido
      if (!title) {
        return res.status(400).json({ error: 'O título do curso é obrigatório' });
      }
  
      // Gera um slug único
      const uniqueSlug = await generateUniqueSlug(title);
  
      // Cria um novo curso associado à subcategoria especificada
      const newCourse = await prisma.curso.create({
        data: {
          slugCursos: uniqueSlug,
          title,
          file: video,
          subcategoriaId: subcategoriaIdNumber,
        },
      });
  
      return res.status(201).json({ course: newCourse });
    } catch (error) {
      console.error('Erro ao adicionar curso:', error);
      return res.status(500).json({ error: 'Erro ao adicionar curso' });
    }
  };
  
  // Função para gerar slugs únicos (verifica se já existe no banco de dados)
  async function generateUniqueSlug(title: string): Promise<string> {
    if (!title) {
      console.error('Erro ao gerar slug: o título não pode ser vazio ou undefined.');
      return ''; // Ou outra estratégia apropriada para lidar com títulos vazios ou indefinidos
    }
  
    let slug = title.toLowerCase().replace(/\s+/g, '-');
  
    // Verifica se o slug já existe no banco de dados
    const existingCourse = await prisma.curso.findFirst({
      where: {
        slugCursos: slug,
      },
    });
  
    // Adiciona um sufixo ao slug se já existir
    if (existingCourse) {
      let counter = 1;
      while (true) {
        const newSlug = `${slug}-${counter}`;
        const existing = await prisma.curso.findFirst({
          where: {
            slugCursos: newSlug,
          },
        });
        if (!existing) {
          slug = newSlug;
          break;
        }
        counter++;
      }
    }
  
    return slug;
  }
  