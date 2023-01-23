const express = require('express');
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const router = express.Router();

router.get('/', auth, sauceCtrl.sauceAll);
router.get('/:id', auth, sauceCtrl.sauceId);
router.post('/', auth, multer, sauceCtrl.sauceAdd);
router.put('/:id', auth, multer, sauceCtrl.sauceUpdate);
router.delete('/:id', auth, sauceCtrl.sauceDelete);
router.post('/:id/like', auth, sauceCtrl.sauceLike);

module.exports = router;