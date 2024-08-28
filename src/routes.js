const express = require('express');
const router = express.Router();
const { createClient } = require('redis');

// Configure Redis client
const client = createClient({
  url: 'redis://127.0.0.1:6379'
});

client.on('error', (err) => {
  console.error('Error connecting to Redis', err);
});

client.connect();

// Create a new todo with a deliberate error
router.post('/', async (req, res, next) => {
  const { id, task } = req.body;
  try {
    let deliberateError = null;
    deliberateError.NadeemOnTheWayToVegas(); // This will cause an error
    await client.hSet('todos', id, task);
    res.status(201).send(`Todo with id ${id} created`);
  } catch (err) {
    next(err); // Pass the error to Sentry
  }
});

// Get all todos
router.get('/', async (req, res, next) => {
  try {
    const todos = await client.hGetAll('todos');
    res.status(200).json(todos);
  } catch (err) {
    next(err); // Pass the error to Sentry
  }
});

// Get a single todo by id
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const task = await client.hGet('todos', id);
    if (!task) {
      res.status(404).send(`Todo with id ${id} not found`);
    } else {
      res.status(200).json({ id, task });
    }
  } catch (err) {
    next(err); // Pass the error to Sentry
  }
});

// Update a todo by id
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { task } = req.body;
  try {
    await client.hSet('todos', id, task);
    res.status(200).send(`Todo with id ${id} updated`);
  } catch (err) {
    next(err); // Pass the error to Sentry
  }
});

// Delete a todo by id
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await client.hDel('todos', id);
    if (result === 0) {
      res.status(404).send(`Todo with id ${id} not found`);
    } else {
      res.status(200).send(`Todo with id ${id} deleted`);
    }
  } catch (err) {
    next(err); // Pass the error to Sentry
  }
});

module.exports = router;
