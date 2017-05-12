module.exports = {
    checkLogin:function checkLogin(req,res,next) {
        console.log(req.session)
        if(!req.session.user){

            req.flash('error','未登录');
            return res.redirect('/signin');
        }
        next();
    },
    checkNotLogin:function checkNotLogin(req,res,next) {
        console.log(req.session)
        if(req.session.user){

            req.flash('error','已登录');
            return res.redirect('back');
        }
        next();
    }
};