import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().email().toLowerCase(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  email: z.string().email().toLowerCase(),
  username: z.string().min(3),
  password: z.string().min(8),
});
