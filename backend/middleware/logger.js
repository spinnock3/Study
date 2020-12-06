//Route access logging middleware
var logger = require('log4js').getLogger();
var session = require('express-session');

module.exports = (req, res, next) => {
    if(req.session){
        logger.debug("\nUser: "+req.session.user+ " \nRequest Body: "+JSON.stringify(req.body)+ " \nRequest Query Params: "+JSON.stringify(req.query)+" \nRequest Referer: "+req.headers.referer+ " \nRequest Path: " +req.path+" \nRequest Method: "+req.method);
    }
    else{
        logger.debug("\nUser: UNDEFINED - NO SESSION \nRequest Body: "+JSON.stringify(req.body)+ " \nRequest Query Params: "+JSON.stringify(req.query)+ " \nRequest Referer: "+req.headers.referer+ " \nRequest Path: " +req.path+" \nRequest Method: "+req.method);
    }
     next()
}