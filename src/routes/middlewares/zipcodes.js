const z1p = require('z1p');

const verifyZipcode = async (req, res, next) => {
  try {
    const { cp: zipcode } = req.params;
    const location = await z1p(["ES"]).raw(v => v.zip_code == zipcode);

    if (location.length === 0) {
      res.status(422);
      return res.json({
        message: 'Invalid spanish zipcode'
      });
    }

    res.location = location[0];
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  verifyZipcode
}
