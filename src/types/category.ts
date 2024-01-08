import { Subcategoria } from '@prisma/client';

export type Category = {
  id: number;
  slug: string;
  title: string;
  photo: string;
  subcategorias: Subcategoria[];
  createdAt: string;
};