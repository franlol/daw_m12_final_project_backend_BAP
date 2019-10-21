const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['access-token'];
  
  try {
    const decrypted = jwt.verify(token, process.env.TOKEN_KEY);
    res.user = decrypted;

    // const expiry = jwt.decode(token).exp;
    // const now = new Date();
    // return now.getTime() > expiry * 1000;

  } catch (err) {
    res.status(401);
    return res.json({
      message: 'Token invalid',
    });
  }
  next();
}

module.exports = verifyToken;