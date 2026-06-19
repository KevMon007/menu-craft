// src/routes/products.routes.js
const { Router } = require('express');
const { verifyToken } = require('../middlewares/auth.middleware');
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/products.controller');

const router = Router();

router.use(verifyToken);

router.get('/',      getProducts);
router.post('/',     createProduct);
router.put('/:id',   updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;