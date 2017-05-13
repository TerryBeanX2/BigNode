const Post = require('../lib/mongo').Post;
const marked = require('marked');

Post.plugin('contentToHtml',{
    afterFind:(posts)=>{
        return post.map((post)=>{
            post.content = marked(post.content);
            return post;
        })
    },
    afterFindOne:(post)=>{
        if(post){
            post.content = marked(post.content);
        }
        return post;
    }
});


module.exports = {
    create:(post)=>{
        return Post.create(post).exec();
    },
    getPostById:(postId)=>{
        return Post
            .findOne({_id:postId})
            .populate({path:'author',model:'User'})
            .addCreateAt()
            .contentToHtml()
            .exec();
    }
};