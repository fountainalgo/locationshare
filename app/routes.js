var config = require('../config/db');
var User = require('./models/Users');
var Locations = require('./models/Locations');
var request = require('request');
var moment = require('moment');
var jwt = require('jwt-simple');
module.exports = function(app) {
	/*
	 |--------------------------------------------------------------------------
	 | GET /api/me
	 |--------------------------------------------------------------------------
	 */
	app.get('/api/me', ensureAuthenticated, function(req, res) {
	  User.findById(req.user, function(err, user) {
	  	console.log(user);
	    res.send(user);
	  });
	});
	/*
	 |--------------------------------------------------------------------------
	 | PUT /api/currentlocation
	 |--------------------------------------------------------------------------
	 */
	app.put('/api/currentlocation', ensureAuthenticated, function(req, res) {
			var location = new Locations();
			location.userId = 	req.body._id;
			location.address = 	req.body.address;
			location.lat = 	req.body.lat;
			location.lon = 	req.body.lon;
			location.save(function(err) {
				if(!err){
					res.status(200).end();
				}else{
					res.status(500).json({"error":err});
				}
			});
	});


	/*
	 |--------------------------------------------------------------------------
	 | PUT /api/me
	 |--------------------------------------------------------------------------
	 */
	app.put('/api/me', ensureAuthenticated, function(req, res) {
	  User.findById(req.user, function(err, user) {
	    if (!user) {
	      return res.status(400).send({ message: 'User not found' });
	    }
	    user.displayName = req.body.displayName || user.displayName;
	    user.email = req.body.email || user.email;
	    user.save(function(err) {
	      res.status(200).end();
	    });
	  });
	});
	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});
	app.post('/auth/facebook', function(req, res) {
	  var accessTokenUrl = 'https://graph.facebook.com/v2.3/oauth/access_token';
	  var graphApiUrl = 'https://graph.facebook.com/v2.3/me';
	  var params = {
	    code: req.body.code,
	    client_id: req.body.clientId,
	    client_secret: config.FACEBOOK_SECRET,
	    redirect_uri: req.body.redirectUri
	  };

	  // Step 1. Exchange authorization code for access token.
	  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
	    if (response.statusCode !== 200) {
	      return res.status(500).send({ message: accessToken.error.message });
	    }

	    // Step 2. Retrieve profile information about the current user.
	    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
	      if (response.statusCode !== 200) {
	        return res.status(500).send({ message: profile.error.message });
	      }
	      if (req.headers.authorization) {
	        User.findOne({ facebook: profile.id }, function(err, existingUser) {
	          if (existingUser) {
	            return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
	          }
	          var token = req.headers.authorization.split(' ')[1];
	          var payload = jwt.decode(token, config.TOKEN_SECRET);
	          User.findById(payload.sub, function(err, user) {
	            if (!user) {
	              return res.status(400).send({ message: 'User not found' });
	            }
	            user.facebook = profile.id;
	            user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
	            user.displayName = user.displayName || profile.name;
	            user.save(function() {
	              var token = createJWT(user);
	              res.send({ token: token });
	            });
	          });
	        });
	      } else {
	        // Step 3b. Create a new user account or return an existing one.
	        User.findOne({ facebook: profile.id }, function(err, existingUser) {
	          if (existingUser) {
	            var token = createJWT(existingUser);
	            return res.send({ token: token });
	          }
	          var user = new User();
	          user.facebook = profile.id;
	          user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
	          user.displayName = profile.name;
	          user.save(function() {
	            var token = createJWT(user);
	            res.send({ token: token });
	          });
	        });
	      }
	    });
	  });
	});

	/*
	 |--------------------------------------------------------------------------
	 | Generate JSON Web Token
	 |--------------------------------------------------------------------------
	 */
	function createJWT(user) {
	  var payload = {
	    sub: user._id,
	    iat: moment().unix(),
	    exp: moment().add(14, 'days').unix()
	  };
	  return jwt.encode(payload, config.TOKEN_SECRET);
	}

	/*
	 |--------------------------------------------------------------------------
	 | Login Required Middleware
	 |--------------------------------------------------------------------------
	 */	
	function ensureAuthenticated(req, res, next) {
	  if (!req.headers.authorization) {
	    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
	  }
	  var token = req.headers.authorization.split(' ')[1];
	  var payload = jwt.decode(token, config.TOKEN_SECRET);
	  if (payload.exp <= moment().unix()) {
	    return res.status(401).send({ message: 'Token has expired' });
	  }
	  req.user = payload.sub;
	  next();
	}
};