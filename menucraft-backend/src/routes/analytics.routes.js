const { Router } = require('express');
const { verifyToken } = require('../middlewares/auth.middleware');
const { recordEvent, getDashboardAnalytics } = require('../controllers/analytics.controller');

const router = Router();

router.post('/events', recordEvent);
router.get('/dashboard', verifyToken, getDashboardAnalytics);

module.exports = router;
