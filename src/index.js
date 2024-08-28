// Require this first!
require("../instrument");
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const Sentry = require('@sentry/node');

// Initialize the app
const app = express();
const port = 3000;


// Body parser middleware
app.use(bodyParser.json());

// Routes
app.use('/api/todos', routes);

// Add this after all routes,
// but before any and other error-handling middlewares are defined
Sentry.setupExpressErrorHandler(app);
// Generic error handler for other errors
app.use((err, req, res, next) => {
  // Log the error (for development purposes)
  console.error(err);

  // Send error response
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

// Start the server
app.listen(port, () => {
  console.log(`Todo API listening at http://localhost:${port}`);
});
