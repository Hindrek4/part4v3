const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
let Blog = require('./models/blog');
const config = require('./utils/config');
const logger = require('./utils/logger');
require('dotenv').config();
const mongoose = require('mongoose');
const middleware = require('./utils/middleware');
const blogsRouter = require('./controllers/blogs');
const loginRouter = require('./controllers/login');
const usersRouter = require('./controllers/users'); 

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });


app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
app.use(middleware.requestLogger);
app.use('/api/blogs', blogsRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter); // Correct path

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

logger.info('connecting to', config.MONGODB_URI);


app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
