const express = require('express');
const mongoose = require('mongoose');

const Add = require('../database/models/Add');
const verifyToken = require('./middlewares/auth');
const { verifyZipcode } = require('./middlewares/zipcodes');

const router = express.Router();
const distanceBetween = require('../utils/haversine');

router.post('/', verifyToken, (req, res, next) => {
  if (!req.session.user) {
    res.status(400);
    return res.json({
      message: 'Not logged.'
    });
  }

  const title = req.body.title;
  const description = req.body.description;
  const range = req.body.range;
  const services = req.body.services;

  const price = req.body.price;

  const owner = req.session.user._id;

  const add = new Add({
    owner,
    title,
    description,
    range,
    services,
    price,
    location: req.session.user.location
  });

  return add
    .save()
    .then(rs => {
      res.status(201).json(add);
    })
    .catch(err => res.status(500).json(err));
});

router.get('/:userId', verifyToken, async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(422);
      return res.json({
        message: 'Invalid Ad ID'
      });
    }

    const ad = await Add.findOne({ owner: userId });
    if (!ad) {
      res.status(404);
      return res.json({
        message: 'Ad not found.'
      });
    }

    res.status(200);
    return res.json({ ad });
  } catch (err) {
    next(err);
  }
});

router.get('/cp/:cp', verifyZipcode, verifyToken, async (req, res, next) => {
  try {
    const distanceToSearch = req.query.distance && (req.query.distance < 500 ? req.query.distance : 50) * 1000;
    const coordinates = [res.location.latitude, res.location.longitude]

    const ads = await Add.find({
      location: {
        $near: {
          $maxDistance: distanceToSearch,
          $geometry: {
            type: "Point",
            coordinates
          }
        }
      }
    });

    const [zipcodeLat, zipcodeLon] = coordinates;

    const filteredAnuncis = ads.filter(ad => {
      const [adLat, adLon] = ad.location.coordinates;
      // console.log('.................')
      // console.log('ad', ad, 'ad.range', ad.range, 'distanceBetween', Math.floor(distanceBetween(zipcodeLat, zipcodeLon, adLat, adLon)))

      // return ad.range >= Math.floor(distanceBetween(zipcodeLat, zipcodeLon, adLat, adLon));
      return ad.range >= Math.floor(distanceBetween([zipcodeLat, zipcodeLon], [adLat, adLon]));
    });

    // console.clear();
    // console.log('user loc', req.session.user.location)

    // Els Monjos 08730 "coordinates": [41.3324,1.6496]
    // Vilafranca del Penedès 08720 "coordinates": [41.35,1.7]
    // La Munia 08732
    // La Granada del Penedès 08006
    // St. Sadurní d'Anoia 08770
    // Martorell 08760     "coordinates": [41.474,1.9306]
    // L'Arboç 43720     "coordinates": [41.2667,1.6]
    // Tarragona 43001     "coordinates": [41.1167,1.25]
    // BCN 08193

    // TOKENS
    // elsmonjos@test.com   Rang: 20,   Token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGRhOTAwNjU4YjgxNjYwMGFlNTliNjAiLCJsb2NhdGlvbiI6eyJ0eXBlIjoiUG9pbnQiLCJjb29yZGluYXRlcyI6WzQxLjMzMjQsMS42NDk2XSwicGxhY2UiOiJTYW50YSBNYXJnYXJpZGEgSSBFbHMgTW9uam9zIiwiY291bnRyeV9jb2RlIjoiRVMiLCJzdGF0ZV9jb2RlIjoiQ1QiLCJzdGF0ZSI6IkNhdGFsdW5hIiwicHJvdmluY2UiOiJCYXJjZWxvbmEifSwidXNlcm5hbWUiOiJlbHNtb25qb3N1c2VyIiwibmFtZSI6IkVscyBNb25qb3MgdXNlciIsInN1cm5hbWUiOiJ0ZXN0IiwiZW1haWwiOiJlbHNtb25qb3NAdGVzdC5jb20iLCJjcCI6IjA4NzMwIiwiY3JlYXRlZEF0IjoiMjAxOS0xMS0yNFQxNDoxMzoyNi45MDRaIiwidXBkYXRlZEF0IjoiMjAxOS0xMS0yNFQxNDoxMzoyNi45MDRaIiwiX192IjowLCJpYXQiOjE1NzQ2MDQ4MDYsImV4cCI6MTU3NDY5MTIwNn0.h1aWWVGfKJkx-JNPhJE_PNPlFFr5M83J470Hl8_KYfA
    // vilafranca@test.com  Rang: 5,    Token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGRhOTAyYjU4YjgxNjYwMGFlNTliNjEiLCJsb2NhdGlvbiI6eyJ0eXBlIjoiUG9pbnQiLCJjb29yZGluYXRlcyI6WzQxLjM1LDEuN10sInBsYWNlIjoiVmlsYWZyYW5jYSBEZWwgUGVuZWRlcyIsImNvdW50cnlfY29kZSI6IkVTIiwic3RhdGVfY29kZSI6IkNUIiwic3RhdGUiOiJDYXRhbHVuYSIsInByb3ZpbmNlIjoiQmFyY2Vsb25hIn0sInVzZXJuYW1lIjoidmlsYWZyYW5jYXVzZXIiLCJuYW1lIjoiVmlsYWZyYW5jYSB1c2VyIiwic3VybmFtZSI6InRlc3QiLCJlbWFpbCI6InZpbGFmcmFuY2FAdGVzdC5jb20iLCJjcCI6IjA4NzIwIiwiY3JlYXRlZEF0IjoiMjAxOS0xMS0yNFQxNDoxNDowMy4yMjJaIiwidXBkYXRlZEF0IjoiMjAxOS0xMS0yNFQxNDoxNDowMy4yMjJaIiwiX192IjowLCJpYXQiOjE1NzQ2MDQ4NDMsImV4cCI6MTU3NDY5MTI0M30.ohYadC5sEUc3dDbERkfM0snQ9bp4Thhtm_y13zUFf48
    // arbos@test.com       Rang: 4,    Token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGRhOTA2NTU4YjgxNjYwMGFlNTliNjIiLCJsb2NhdGlvbiI6eyJ0eXBlIjoiUG9pbnQiLCJjb29yZGluYXRlcyI6WzQxLjI2NjcsMS42XSwicGxhY2UiOiJBcmJvw6csIEwnIiwiY291bnRyeV9jb2RlIjoiRVMiLCJzdGF0ZV9jb2RlIjoiQ1QiLCJzdGF0ZSI6IkNhdGFsdW5hIiwicHJvdmluY2UiOiJUYXJyYWdvbmEifSwidXNlcm5hbWUiOiJhcmJvc3VzZXIiLCJuYW1lIjoiQXJib8OnIHVzZXIiLCJzdXJuYW1lIjoidGVzdCIsImVtYWlsIjoiYXJib3NAdGVzdC5jb20iLCJjcCI6IjQzNzIwIiwiY3JlYXRlZEF0IjoiMjAxOS0xMS0yNFQxNDoxNTowMS4yODZaIiwidXBkYXRlZEF0IjoiMjAxOS0xMS0yNFQxNDoxNTowMS4yODZaIiwiX192IjowLCJpYXQiOjE1NzQ2MDQ5MDEsImV4cCI6MTU3NDY5MTMwMX0.XSpQwZ5beM7Lz_3LOa31vTzCwpLNcAFugO56DvjFnbE
    // martorell@test.com   Rang: 15,   Token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGRhOTA4NTU4YjgxNjYwMGFlNTliNjMiLCJsb2NhdGlvbiI6eyJ0eXBlIjoiUG9pbnQiLCJjb29yZGluYXRlcyI6WzQxLjQ3NCwxLjkzMDZdLCJwbGFjZSI6Ik1hcnRvcmVsbCIsImNvdW50cnlfY29kZSI6IkVTIiwic3RhdGVfY29kZSI6IkNUIiwic3RhdGUiOiJDYXRhbHVuYSIsInByb3ZpbmNlIjoiQmFyY2Vsb25hIn0sInVzZXJuYW1lIjoibWFydG9yZWxsdXNlciIsIm5hbWUiOiJNYXJ0b3JlbGwgdXNlciIsInN1cm5hbWUiOiJ0ZXN0IiwiZW1haWwiOiJtYXJ0b3JlbGxAdGVzdC5jb20iLCJjcCI6IjA4NzYwIiwiY3JlYXRlZEF0IjoiMjAxOS0xMS0yNFQxNDoxNTozMy4wOTZaIiwidXBkYXRlZEF0IjoiMjAxOS0xMS0yNFQxNDoxNTozMy4wOTZaIiwiX192IjowLCJpYXQiOjE1NzQ2MDQ5MzMsImV4cCI6MTU3NDY5MTMzM30.EpWF0D4st60YERjRTShslOUt6mPW9qJhDCyvXpP6gGU
    // tarragona@test.com   Rang: 20,   Token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGRhOTBhMTU4YjgxNjYwMGFlNTliNjQiLCJsb2NhdGlvbiI6eyJ0eXBlIjoiUG9pbnQiLCJjb29yZGluYXRlcyI6WzQxLjExNjcsMS4yNV0sInBsYWNlIjoiVGFycmFnb25hIiwiY291bnRyeV9jb2RlIjoiRVMiLCJzdGF0ZV9jb2RlIjoiQ1QiLCJzdGF0ZSI6IkNhdGFsdW5hIiwicHJvdmluY2UiOiJUYXJyYWdvbmEifSwidXNlcm5hbWUiOiJ0YXJyYWdvbmF1c2VyIiwibmFtZSI6IlRhcnJhZ29uYSB1c2VyIiwic3VybmFtZSI6InRlc3QiLCJlbWFpbCI6InRhcnJhZ29uYUB0ZXN0LmNvbSIsImNwIjoiNDMwMDEiLCJjcmVhdGVkQXQiOiIyMDE5LTExLTI0VDE0OjE2OjAxLjMxN1oiLCJ1cGRhdGVkQXQiOiIyMDE5LTExLTI0VDE0OjE2OjAxLjMxN1oiLCJfX3YiOjAsImlhdCI6MTU3NDYwNDk2MSwiZXhwIjoxNTc0NjkxMzYxfQ.g8Ug9LCpq9ZQpBehxGfXRbksMtmFhlb641DKL5MS_wM
    // tarragona@test.com   Rang: 100   ''

    res.status(200);
    return res.json({
      ads: filteredAnuncis
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', verifyToken, async (req, res, next) => {
  const { id } = req.params;
  const { user } = req.session;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(422);
      return res.json({
        message: 'Invalid Ad ID.'
      });
    }

    const ad = await Add.findById(id).populate('owner').lean();

    if (!ad) {
      res.status(404);
      return res.json({
        message: 'Ad not found.'
      });
    }

    if (!ad.owner._id.equals(user._id)) {
      res.status(401);
      return res.json({
        message: 'You cannot delete that ad.'
      });
    }

    await Add.findByIdAndDelete(id);

    res.status(200);
    return res.json({
      message: 'Ad removed.'
    });

  } catch (err) {
    next(err)
  }
});

module.exports = router;
