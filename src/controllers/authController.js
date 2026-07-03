import dotenv from "dotenv"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { getUserByEmail, createUser } from "../models/user.model.js"

export async function register(req, res) {
  try {
    const { email, password, name } = req.body
    // Verificar que no exista
    const existente = await getUserByEmail(email)
    if (existente) {
      return res.status(409).JSON({ error: "El email ya esta registrado" })
    }
    //  Hashear contraseña en caso de que no exista
    const passwordHash = await bcrypt.hash(password, 10)

    // Crear usuario
    const user = await createUser({ email, passwordHash, name })

    //   Generar el token de usuario
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })
    res.status(201).JSON({ user, token })
  } catch (error) {
    console.error(error)
    res.status(500).JSON({ error: "Error al registrar usuario" })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body

    const user = await getUserByEmail(email)
    if (!user) {
      return res.status(401).JSON({ error: "Credenciales invalidas" })
    }
    const passwordValida = await bcrypt.compare(password, user.password_hash)
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })
    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    })
  } catch (error) {
    res.status(500).json({ error: "Error al Iniciar Sesion" })
  }
}
