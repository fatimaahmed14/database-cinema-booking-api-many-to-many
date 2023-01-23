const express = require('express');
const {
    getByScreenId,
    createTicket
} = require('./controller');

const router = express.Router();

router.get('/:screenId', getByScreenId);
router.post('/', createTicket);

module.exports = router;