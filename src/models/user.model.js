import pool from "../config/db.js"

export async function getUserByEmail(email) {
  const query = ` 
        SELECT * 
        FROM users
        WHERE email = $1
    `
  const result = await pool.query(query, [email]) // se le pasa la consulta y el arreglo de 1 valor devuelve un objeto con los datos de la consulta

  return result.rows[0]
}
export async function createUser(name, email, password) {
  const query = ` 
    INSERT INTO users(name,email,password)
    VALUES($1,$2,$3)
    RETURNING id,name,email,created_at
    `
  const result = await pool.query(query, [name, email, password])
  return result.rows[0]
}
export async function getUserById(id) {
  const query = `
    SELECT id, name, email, created_at 
    FROM users 
    WHERE id = $1
  `
  const result = await pool.query(query, [id])
  return result.rows[0]
}
