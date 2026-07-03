import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import { getUserById } from "../models/user.model.js"


dotenv.config()
export async function authMiddleware(req, res, next) {
  try{
    const authHeader = req.headers,
    
    //verificar existencia del header
    if (!authHeader){
        return res.status(401).json({message: 'Token no proporcionado'})

    }
    const token = authHeader.split(' ')[1] // extraer el token

    const payload = jwt.verify(token, JWT_SECRET) // verficar token

    const user = await getUserById(payload.id) // buscar usuario

    if(!user){
        res.status(401).json({message: 'Usuario no encontrado'})
    }
    req.user = user // guardar el usuario para los siguientes controladores
    next()

  } catch (error){
    return res.status(401).json({message: 'token invalido'})
  } 

}
