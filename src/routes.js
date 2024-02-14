const { Router } = require('express');
const controller = require('./controller');
const pool = require('../db');

const router = Router();

router.post('/login', controller.getUserLogin);
router.post('/singup', controller.checkUndAddUsersingup);
router.get('/teilnehmer', controller.getTeilnehmerData);
router.get('/dozenten', controller.getDozentenData);



module.exports = router;