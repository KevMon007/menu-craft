// src/routes/categories.routes.js
const { Router } = require('express');
const { verifyToken } = require('../middlewares/auth.middleware');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categories.controller');

const router = Router();

// Todas las rutas requieren JWT
router.use(verifyToken);

router.get('/',      getCategories);
router.post('/',     createCategory);
router.put('/:id',   updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;