const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['access-token'];

  try {
    const decrypted = jwt.verify(token, process.env.TOKEN_KEY);

    const expiry = decrypted.exp;
    const now = new Date();
    const expired = now.getTime() > expiry * 1000;

    if (expired) {
      res.status(401);
      return res.json({
        message: 'Token expired',
      });
    }

    res.user = decrypted;

  } catch (err) {
    res.status(401);
    return res.json({
      message: 'Token invalid',
    });
  }
  next();
}

module.exports = verifyToken;
