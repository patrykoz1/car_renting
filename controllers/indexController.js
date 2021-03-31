const index = function (req,res){
    res.render('main', {user: req.user } )
};

const about = function (req,res){
    res.render('about', {user: req.user } )
};

module.exports={
    index, about
}