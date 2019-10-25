const app = require('./app');
const dbConnection = require('./database');

const init = async () => {
  try {
    await dbConnection(); 
    console.log('Database running on port 27017');
    
    app.listen(3000);
    console.log('Server running on port 3000');
  } catch (err) {
    console.log('APP err: ', err);
    return;
  }
}

init();
