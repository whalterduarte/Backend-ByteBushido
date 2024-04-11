import { Request, Response } from "express";
import prisma from "../libs/prisma";
import { user } from "../types/user";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
require("dotenv").config;

export const login = async (req: Request, res: Response) => {
  const { email, password }: user =  req.body;
  if (!email || !password) {
    return res.status(404).json({ error: "Preencha os campos" });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "Usuario não encontrado" });
    }
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Senha incorreta" });
    } else {
      const role: string = existingUser.role;
      const jwtKey: string = process.env.JWT_KEY || "whalter";
      const token = JWT.sign({ userId: existingUser.id, email }, jwtKey, {
        expiresIn: "2h",
      });

      return res.json({
        success: true,
        userId: existingUser.id,
        email,
        role,
        token,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro durante o login" });
  }
};
