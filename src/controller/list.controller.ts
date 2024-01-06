import { Request, Response } from "express"
import prisma from "../libs/prisma"

export const getAllUsers = async (req:Request, res:Response) =>{
  const users = await prisma.user.findMany({})
  try {
    if(users.length === 0){
      return res.status(404).json({error: 'Não a nenhum usuario cadastrado'})
    }
    res.json({users})
  } catch (error) {
    console.log(error)
    return res.json({Server: 'Error interno', error})
  }
  
}

