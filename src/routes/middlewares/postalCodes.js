const z1p = require('z1p');

const verifyPostalCodeInParams = async (req, res, next) => {
  try {
    const { postalCode } = req.params;
    const location = await z1p(['ES']).raw(v => v.zip_code == postalCode);

    if (location.length === 0) {
      res.status(422);
      return res.json({
        message: 'Invalid spanish postal code',
        auth: false,
        code: 8
      });
    }

    res.location = location[0];
    next();
  } catch (err) {
    next(err);
  }
};

const verifyPostalCodeInBody = async (req, res, next) => {
  try {
    const { postalCode } = req.body;
    const location = await z1p(['ES']).raw(v => v.zip_code == postalCode);

    if (location.length === 0) {
      res.status(422);
      return res.json({
        message: 'Invalid spanish postal code',
        auth: false,
        code: 8
      });
    }

    res.location = location[0];
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  verifyPostalCodeInParams,
  verifyPostalCodeInBody
};
