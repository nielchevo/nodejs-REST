var express = require('express');
var router = express.Router();

// GET USER.
router.get('/userlist', function(req, res, next) {
  var db= req.db;
  var collection= db.get('userList');

  collection.find({},{}, function(err, docs){
    if(err)
    {
      res.send("There was a problem gain the infomation to the database.");
    }
    else
    {
      res.json(docs);
    }
  });
});

// ADD USER
router.post('/adduser', function(req, res, next) {

  var db = req.db;
  var collection = db.get('userList');

  collection.insert(req.body, function(err, result) {
    res.send(
      (err === null) ? {msg: ''} : {msg : err}
    );
  });

});
module.exports = router;

// DELETE USER
router.delete('/deleteuser/:id', function(req, res, next) {
  
  var db = req.db;
  var collection = db.get('userList');

  var userToDelete= req.params.id;
  
  collection.remove({'_id': userToDelete}, function(err) {
    res.send(err == null) (
      (err === null) ? {msg: ''} : {msg: 'error: '+ err}
    )
  });

});
