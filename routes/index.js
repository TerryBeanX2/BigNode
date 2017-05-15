
module.exports = function (app) {
    app.get('/',(req, res)=> {
        res.redirect('/posts');
    });
    app.use('/signup',require('./signup.js'));
    app.use('/signin',require('./signin.js'));
    app.use('/signout',require('./signout.js'));
    app.use('/posts',require('./posts.js'));
    app.use((req,res)=>{
        if(!res.headersSent){
            res.status(404).render('404');
        }
    })
};

