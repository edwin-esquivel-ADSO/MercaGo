import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../server";
import { AuthRequest } from "../middlewares/auth.middleware";

// Esquema de validación Zod para Registro
const registerSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  role: z.enum(["CLIENTE", "TENDERO", "ADMIN"]).default("CLIENTE"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// Esquema de validación Zod para Login
const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "Ya existe un usuario registrado con este correo electrónico.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        role: validatedData.role,
        phone: validatedData.phone,
        address: validatedData.address,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        address: true,
        createdAt: true,
      },
    });

    const secret = process.env.JWT_SECRET || "mercago_super_secure_jwt_secret_key_2026_production_ready";
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      secret,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Usuario registrado satisfactoriamente.",
      token,
      user: newUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Error en los datos suministrados.",
        errors: error.errors,
      });
      return;
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Credenciales de acceso inválidas (usuario no encontrado).",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Credenciales de acceso inválidas (contraseña incorrecta).",
      });
      return;
    }

    const secret = process.env.JWT_SECRET || "mercago_super_secure_jwt_secret_key_2026_production_ready";
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Autenticación exitosa.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Error en los datos suministrados.",
        errors: error.errors,
      });
      return;
    }
    next(error);
  }
};

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "No autenticado." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        address: true,
        stores: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "Usuario no encontrado." });
      return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
