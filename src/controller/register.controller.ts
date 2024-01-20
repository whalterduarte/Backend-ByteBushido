import { Request, Response } from "express";
import prisma from "../libs/prisma";
import { user } from "../types/user";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { config } from "dotenv";

export const newUser = async (req: Request, res: Response) => {
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
  //Accpts only image
  if (req.file) {
    const file = req.file as UploadedFile;
  } else {
    res.status(404).json({ error: "File not sent" });
    return;
  }

  const { email, name, git, linkedin, password }: user = await req.body;

  if (!email || !password || !name || !git) {
    return res.status(404).json({ error: "Preencha os campos" });
  }
  const photo: string = `${process.env.BASE}/${
    (req.file as Express.MulterS3.File)?.key
  }`;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res.json({ Server: "Usuario ja cadastrado" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        linkedin,
        git,
        password: hashedPassword,
        photo,
        role: "user",
      },
    });
    const jwtKey: string = process.env.JWT_KEY || "whalter";
    const token = JWT.sign({ userId: newUser.id, email, name }, jwtKey, {
      expiresIn: "2h",
    });

    res.json({
      success: true,
      userId: newUser.id,
      name,
      email,
      git,
      linkedin,
      token,
      photo,
    });
  } catch (error) {
    console.log(error);
    res.json({ error, Server: "Error interno" });
  }
};
