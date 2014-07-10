/* GET users listing. */
exports.charactorInfo = function(req, res){
  res.render('charactorInfo', 
  {     moveSpeed: 1,
        digDamage: 1,
        digInterval: 1
  });
};

exports.setCharactorInfo = function(req, res){
    
    res.render('charactorInfo', 
    {   moveSpeed: req.param('moveSpeed'),
        digDamage: req.param('digDamage'),
        digInterval: req.param('digInterval')
    });
};