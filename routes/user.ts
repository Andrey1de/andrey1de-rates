/*
 * GET users listing.
 */
import express = require('express');
const router = express.Router();
import logger from '../shared/logger';


router.get('/', (req: express.Request, res: express.Response) => {
    res.send("respond with a resource");
});

export default router;