import { Router,  Request, Response } from 'express'
import * as cursos from '../controller/cursos.controller'
import multer, { Multer } from 'multer'
import { Auth } from '../middleware/auth'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import multerS3 from 'multer-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'sa-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const upload: Multer = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.BUCKET_NAME || '',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req: Request, file, cb) => {
      let randomNamePhoto = Math.floor(Math.random() * 9999999);
      const originalname = file.originalname || 'default';
      const fileExtension = originalname.split('.').pop(); // Obtém a extensão do arquivo original
      cb(null, `files/cursos${originalname}${randomNamePhoto}${Date.now()}.${fileExtension}`);
    },
  }),
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    const allowed: string[] = ['image/jpg', 'image/jpeg', 'image/png', 'video/mp4', 'application/zip'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  }
})

const router = Router()
//CATEGORY
router.get('/', cursos.listCategory)
router.get('/:slug', cursos.Category)
router.post('/category', Auth.authorizeAdmin, upload.single('photo'), cursos.addCategory)

//SUB-CATEGORY AND COURSE
router.get('/:slug/:slugSubCategory', cursos.subCategory)
router.post('/addcourse', Auth.authorizeAdmin, upload.single('photo'), cursos.addSubcategory)


/*router.get('/:slug/:slugSubCategory/courses', Auth.authorizeUser, cursos.listCourses);
router.get('/:slug/:slugSubCategory/:slugCursos',  Auth.authorizeUser, cursos.Courses);
router.post('/category/subcategory/courses', Auth.authorizeAdmin, upload.single('file'), cursos.addCourse);
*/
export default router