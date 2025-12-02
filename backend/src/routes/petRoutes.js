const express = require('express');
const router = express.Router();
const petController = require('../controller/petController');

// GET /api/pets
router.get('/', (req, res) => petController.getAll(req, res));

// GET /api/pets/:id
router.get('/:id', (req, res) => petController.getById(req, res));

// POST /api/pets
router.post('/', (req, res) => petController.create(req, res));

// PUT /api/pets/:id
router.put('/:id', (req, res) => petController.update(req, res));

// DELETE /api/pets/:id
router.delete('/:id', (req, res) => petController.remove(req, res));

module.exports = router;
