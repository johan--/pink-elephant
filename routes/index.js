
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};


exports.feedback = function(req, res) {
  res.render('./feedback', { title: "Feedback" });
};


exports.send = function(req, res) {
  req.assert('name', 'Name is required').notEmpty();
  req.assert('email', 'Email is required').isEmail();
  req.assert('message', 'Message is required').notEmpty();
  req.assert('subject', 'Subject is required').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    res.render('feedback', {
      title: "Feedback",
      msg: "The following errors occured:",
      errors: errors
    });
  } else {

  var nodemailer = require('nodemailer');

  var transport = nodemailer.createTransport("direct", {debug: true});

  var messageOptions = {

    // Sender
    from: req.body.email,

    // Reciepient
    to: 'your@email.com',

    // Subject
    subject: req.body.subject,

    // text/plain
    text: req.body.message + 'Telephone: ' + req.body.telephone

  };

  transport.sendMail(messageOptions, function(err, res){
    if(err){
        console.log(err);
        return;
    }

    // response.statusHandler only applies to 'direct' transport
    res.statusHandler.once("failed", function(data){
        console.log(
          "Permanently failed delivering message to %s with the following res: %s",
          data.domain, data.res);
    });

    res.statusHandler.once("requeue", function(data){
        console.log("Temporarily failed delivering message to %s", data.domain);
    });

    res.statusHandler.once("sent", function(data){
        console.log("Message was accepted by %s", data.domain);
    });

  });
  res.render('feedback', {
    title: "Feedback",
    msg: 'Message sent successfully!',
    errors: {}
  });
};
};
