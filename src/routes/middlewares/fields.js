const emailRegex = require('email-regex');

const checkUserFields = (req, res, next) => {
  const { username, name, surname, email, password, postalCode } = req.body;

  if (!username || !name || !surname || !email || !password || !postalCode) {
    res.status(422);
    return res.json({
      auth: false,
      code: 4,
      message: 'All fields are required'
    });
  }

  next();
};

const updateProfileUserFields = (req, res, next) => {
  const { username, name, surname, email, postalCode } = req.body;

  if (!username || !name || !surname || !email || !postalCode) {
    res.status(422);
    return res.json({
      auth: false,
      code: 4,
      message: 'All fields are required'
    });
  }

  next();
};

const verifyUserFields = (req, res, next) => {
  const { username, email, password } = req.body;

  const onlyLettersRegex = new RegExp('^[a-zA-Z]+$');
  const validUsername = username.length > 3 && onlyLettersRegex.test(username);
  if (!validUsername) {
    res.status(422);
    return res.json({
      auth: false,
      code: 5,
      message: 'Invalid username'
    });
  }

  const validEmail = emailRegex({ exact: true }).test(email);
  if (!validEmail) {
    res.status(422);
    return res.json({
      auth: false,
      code: 6,
      message: 'Invalid email'
    });
  }

  //More than 8 characters, 1 lowercase letter, 1 uppercase letter and 1 digit
  const passRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})');
  const validPass = passRegex.test(password);
  if (!validPass) {
    res.status(422);
    return res.json({
      auth: false,
      code: 7,
      message: 'Invalid password'
    });
  }

  next();
};

const updateProfileVerifyUserFields = (req, res, next) => {
  const { username, email, password } = req.body;

  const onlyLettersRegex = new RegExp('^[a-zA-Z]+$');
  const validUsername = username.length > 3 && onlyLettersRegex.test(username);
  if (!validUsername) {
    res.status(422);
    return res.json({
      auth: false,
      code: 5,
      message: 'Invalid username'
    });
  }

  const validEmail = emailRegex({ exact: true }).test(email);
  if (!validEmail) {
    res.status(422);
    return res.json({
      auth: false,
      code: 6,
      message: 'Invalid email'
    });
  }

  next();
};

const checkLoginFields = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422);
    return res.json({
      auth: false,
      code: 9,
      message: 'Email and password are required.'
    });
  }

  next();
};

module.exports = {
  checkUserFields,
  verifyUserFields,
  checkLoginFields,
  updateProfileUserFields,
  updateProfileVerifyUserFields
};
