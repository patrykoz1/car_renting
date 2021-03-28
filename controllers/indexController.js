const index = function (req,res){
    res.render('main', {user: req.user } )
}

module.exports={
    index,
}