import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha muito curta")
});

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha muito curta")
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido")
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(6, "Senha muito curta")
});

export const analysisSchema = z.object({
  teamA: z.string().min(2),
  teamB: z.string().min(2),
  competition: z.string().min(2),
  matchDate: z.string().optional()
});

export const createPixSchema = z.object({
  packageId: z.string().min(1)
});

export const confirmPixSchema = z.object({
  purchaseId: z.string().min(5)
});
