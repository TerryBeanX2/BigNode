const Post = require('../lib/mongo').Post;
const marked = require('marked');

const CommentModel = require('./comments');

// 给 post 添加留言数 commentsCount
Post.plugin('addCommentsCount', {
    afterFind: function (posts) {
        return Promise.all(posts.map(function (post) {
            return CommentModel.getCommentsCount(post._id).then(function (commentsCount) {
                post.commentsCount = commentsCount;
                return post;
            });
        }));
    },
    afterFindOne: function (post) {
        if (post) {
            return CommentModel.getCommentsCount(post._id).then(function (count) {
                post.commentsCount = count;
                return post;
            });
        }
        return post;
    }
});

Post.plugin('contentToHtml', {
    afterFind: (posts)=> {
        return post.map((post)=> {
            post.content = marked(post.content);
            return post;
        })
    },
    afterFindOne: (post)=> {
        if (post) {
            post.content = marked(post.content);
        }
        return post;
    }
});


module.exports = {
    create: (post)=> {
        return Post.create(post).exec();
    },
    getPostById: (postId)=> {
        return Post
            .findOne({_id: postId})
            .populate({path: 'author', model: 'User'})
            .addCreateAt()
            .addCommentsCount()
            .contentToHtml()
            .exec();
    },
    getPosts: (author)=> {
        let query = {};
        if (author) {
            query.author = author;
        }
        return Post
            .find(query)
            .populate({path: 'author', model: 'User'})
            .sort({_id: -1})
            .addCreateAt()
            .addCommentsCount()
            .exec();
    },
    incPv:(postId)=>{
        return Post
            .update({_id:postId},{$inc:{pv:1}})
            .exec();
    },
    getRawPostById:(postId)=>{
        return Post
            .findOne({_id:postId})
            .populate({path:'author',model:'User'})
            .exec();
    },
    updatePostById:(postId,author,data)=>{
        return Post.update({author:author,_id:postId},{$set:data}).exec()
    },
    delPostById:(postId,author)=>{
        return Post.remove({ author: author, _id: postId })
            .exec()
            .then(function (res) {
                // 文章删除后，再删除该文章下的所有留言
                if (res.result.ok && res.result.n > 0) {
                    return CommentModel.delCommentsByPostId(postId);
                }
            });
    }
};