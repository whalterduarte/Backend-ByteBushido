import { Request, Response, NextFunction } from "express";
import prisma from "../libs/prisma";
import JWT from "jsonwebtoken";

export const Auth = {
  private: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verificação de autenticação
      if (req.headers.authorization) {
        const jwtKey: string = process.env.JWT_KEY as string;
        const [authType, token] = req.headers.authorization.split(" ");

        if (authType === "Bearer") {
          JWT.verify(token, jwtKey);
          next();
          return;
        }
      }

      res.status(403).json({
        error: "Não autorizado. Token ausente ou em formato inválido.",
      });
    } catch (error) {
      if (error instanceof JWT.JsonWebTokenError) {
        console.error("Erro na verificação do token:", { status: 404 });
        res
          .status(403)
          .json({ error: "Não autorizado. Token inválido ou expirado." });
      } else {
        console.error("Erro na autenticação:");
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  },

  // Middleware para autorizar usuários
  authorizeUser: async (req: Request, res: Response, next: NextFunction) => {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (userId) {
      try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if ((user && user.role === "user") || (user && user.role === "admin")) {
          next();
        } else {
          res.status(403).json({
            error:
              "Acesso proibido. Você não tem permissão para acessar esta rota como usuário.",
          });
        }
      } catch (error) {
        console.error("Erro ao autorizar usuário:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    } else {
      res.status(403).json({
        error: "Acesso proibido. Token inválido ou usuário não encontrado.",
      });
    }
  },

  // Middleware para autorizar administradores
  authorizeAdmin: async (req: Request, res: Response, next: NextFunction) => {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (userId) {
      try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user && user.role === "admin") {
          next();
        } else {
          res.status(403).json({
            error:
              "Acesso proibido. Você não tem permissão de administrador para acessar esta rota.",
          });
        }
      } catch (error) {
        console.error("Erro ao autorizar administrador:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    } else {
      res.status(403).json({
        error: "Acesso proibido. Token inválido ou usuário não encontrado.",
      });
    }
  },
};

// Função auxiliar para obter o ID do usuário a partir do token
function getUserIdFromToken(
  authorizationHeader: string | undefined
): number | null {
  if (authorizationHeader) {
    const [, token] = authorizationHeader.split("Bearer ");
    try {
      const decodedToken: any = JWT.verify(
        token,
        process.env.JWT_KEY as string
      );
      return decodedToken.userId;
    } catch (error) {
      console.error("Erro ao obter ID do usuário a partir do token:", error);
    }
  }
  return null;
}
