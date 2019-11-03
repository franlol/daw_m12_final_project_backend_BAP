const jwt = require('jsonwebtoken');
// old token Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGJjNTc2NjMzNGQ0Zjg0OTQyYzIzMTAiLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwibmFtZSI6IlVzZXIgZm9yIEplc3QgdGVzdHNhMWFzZCIsInN1cm5hbWUiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiY3AiOiIwMDAwMCIsImNyZWF0ZWRBdCI6IjIwMTktMTEtMDFUMTY6MDM6NTAuMjAzWiIsInVwZGF0ZWRBdCI6IjIwMTktMTEtMDJUMTE6MTQ6NTUuNDkyWiIsIl9fdiI6MCwiaWF0IjoxNTcyNjk4MDU2LCJleHAiOjE1NzI3ODQ0NTZ9.ddcieN387wXFmbDdHMyK-VB13IUK-j7j7SYBc4ZRbng

const verifyToken = (req, res, next) => {
  const token = req.headers['access-token'].split(" ")[1];

  if (!token) {
    res.status(403);
    return res.json({
      message: 'Valid token must be provided'
    });
  }

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

    req.session.user = decrypted;

    next();

  } catch (err) {
    res.status(401);
    res.json({
      message: 'Token invalid',
    });
  }
}

module.exports = verifyToken;
