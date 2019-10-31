const app = require('./app');
const dbConnection = require('./database');

const init = async () => {
  try {
    await dbConnection(); 
    console.log(`Database running on port ${process.env.DB_PORT}`);
    
    app.listen(process.env.APP_PORT);
    console.log(`Server running on port ${process.env.APP_PORT}`);
  } catch (err) {
    console.log('APP err: ', err);
    return;
  }
}

init();
