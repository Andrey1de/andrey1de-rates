/*
 * GET home page.
 */
import express = require('express');
import logger from '../shared/logger';

const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    res.render('index', { title: 'Express' });
});

export default router;