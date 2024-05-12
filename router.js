import Router from 'express'
import Controller from './Controller.js'


const router = new Router();

router.post('/posts', Controller.create);
router.get('/test', Controller.Test);
//router.post('/request', Controller.getAll);
// router.get('/posts/:id', Controller.getOne)
// router.put('/posts', Controller.update)
// router.delete('/posts/:id', Controller.delete)

export default router;