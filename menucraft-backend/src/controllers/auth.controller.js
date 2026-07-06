// src/controllers/auth.controller.js
// Issue #10 - Autenticación JWT: registro y login

const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const pool   = require('../config/db');

const BCRYPT_ROUNDS = 10;
const JWT_SECRET    = process.env.JWT_SECRET;
const JWT_EXPIRES   = process.env.JWT_EXPIRES_IN || '8h';

// ─── POST /api/auth/register ─────────────────────────────────
// Crea el restaurante y el usuario administrador inicial
const register = async (req, res) => {
  const { nombre_restaurante, slug, nombre_usuario, email, password } = req.body;

  // Validación básica
  if (!nombre_restaurante || !slug || !nombre_usuario || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    // Verificar que el slug no exista
    const slugExiste = await pool.query(
      'SELECT id FROM restaurantes WHERE slug = $1',
      [slug]
    );
    if (slugExiste.rows.length > 0) {
      return res.status(409).json({ error: 'El slug ya está en uso' });
    }

    // Verificar que el email no exista
    const emailExiste = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );
    if (emailExiste.rows.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // Hashear contraseña con bcrypt (factor de costo 10)
    const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Crear restaurante y usuario en una transacción
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const restoResult = await client.query(
        'INSERT INTO restaurantes (nombre, slug) VALUES ($1, $2) RETURNING id',
        [nombre_restaurante, slug]
      );
      const restaurante_id = restoResult.rows[0].id;

      await client.query(
        `INSERT INTO usuarios (restaurante_id, nombre, email, password_hash, rol)
         VALUES ($1, $2, $3, $4, 'admin')`,
        [restaurante_id, nombre_usuario, email, password_hash]
      );

      await client.query('COMMIT');

      return res.status(201).json({
        message: 'Restaurante y administrador creados exitosamente',
        slug,
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('[Auth] Error en register:', err.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────
// Valida credenciales, genera JWT y lo entrega en cookie httpOnly
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    // Buscar usuario con su restaurante
    const result = await pool.query(
      `SELECT u.id, u.nombre, u.email, u.password_hash, u.rol, u.restaurante_id,
              r.nombre AS nombre_restaurante, r.slug
       FROM usuarios u
       JOIN restaurantes r ON r.id = u.restaurante_id
       WHERE u.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = result.rows[0];

    // Comparar contraseña con el hash
    const passwordValido = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar JWT con usuario_id y restaurante_id
    const token = jwt.sign(
      {
        usuario_id:     usuario.id,
        restaurante_id: usuario.restaurante_id,
        rol:            usuario.rol,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    // Entregar token en cookie httpOnly (mitiga XSS)
    res.cookie('token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   8 * 60 * 60 * 1000, // 8 horas en ms
    });

    return res.status(200).json({
      message: 'Login exitoso',
      token,
      usuario: {
        id:                  usuario.id,
        nombre:              usuario.nombre,
        email:               usuario.email,
        rol:                 usuario.rol,
        restaurante_id:      usuario.restaurante_id,
        nombre_restaurante:  usuario.nombre_restaurante,
        slug:                usuario.slug,
      },
    });
  } catch (err) {
    console.error('[Auth] Error en login:', err.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── POST /api/auth/logout ────────────────────────────────────
const logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
};

module.exports = { register, login, logout };