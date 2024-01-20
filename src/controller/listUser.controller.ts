import { Request, Response } from "express";
import prisma from "../libs/prisma";
import { getUserIdFromToken } from "../middleware/auth";

export const getUser = async (req: Request, res: Response) => {
  try {
    // Obtém o ID do usuário a partir do token
    const userId = getUserIdFromToken(req.headers.authorization);

    // Verifica se o usuário está autenticado
    if (!userId) {
      return res.status(403).json({
        error: "Acesso proibido. Token inválido ou usuário não encontrado.",
      });
    }

    // Busca o usuário pelo ID obtido do token
    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Verifica se o usuário foi encontrado
    if (!user) {
      return res.status(403).json({
        error: "Acesso proibido. Usuário não encontrado.",
      });
    }

    // Retorna os dados do usuário logado
    return res.json({ user });
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};
