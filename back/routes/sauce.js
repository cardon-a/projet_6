const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');

router.get('/', sauceCtrl.sauceAll);
router.get('/:id', sauceCtrl.sauceId);
router.post('/', sauceCtrl.sauceAdd);
router.put('/:id', sauceCtrl.sauceUpdate);
router.delete('/:id', sauceCtrl.sauceDelete);
router.post('/:id/like', sauceCtrl.sauceLike);

module.exports = router;