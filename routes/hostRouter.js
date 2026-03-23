const express = require('express');
const hostRouter = express.Router();
const hostController = require('../controllers/hostController');

hostRouter.post('/add-home', hostController.postAddHome);
hostRouter.get('/host-home', hostController.getHostHomes);
hostRouter.get('/edit-home/:id', hostController.getEditHome);
hostRouter.post('/edit-home', hostController.postEditHome);
hostRouter.post('/delete-home/:id', hostController.postDeleteHome);

module.exports = hostRouter;