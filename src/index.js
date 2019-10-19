const app = require('./app');

const init = () => {
  app.listen(3000);
  console.log('Server running on port 3000');
}

init();
