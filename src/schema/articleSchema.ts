import { z } from "zod";

export const articleSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    cover_image_url: z.string().url(),
    category: z.string().transform(Number),
  })
  .required();

export const categorySchema = z
  .object({
    name: z.string().min(1),
  })
  .required();
