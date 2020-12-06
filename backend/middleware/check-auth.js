var jwt = require('express-jwt');
const fs = require('fs-extra');
var publicKey = fs.readFileSync('./backend/files/public.key');

module.exports = (req, res, next) => {
  try {

    jwt({ secret: publicKey, algorithms: ['RS256'] });
    next();
  }
  catch (error) {
    return next(error)
  }
};