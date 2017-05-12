const config = require('config-lite')(__dirname);
const Mongolass = require('mongolass');
const mongolass = new Mongolass();
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');
mongolass.connect(config.mongodb);

mongolass.plugin('addCreateAt',{
    afterFind:(results)=>{
        results.forEach((item)=>{
            item.create_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
        });
        return results;
    },
    afterFindOne:(result)=>{
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
        }
        return result;
    }
});


exports.User = mongolass.model('User',{
    name:{type:'string'},
    password:{type:'string'},
    avatar:{type:'string'},
    gender:{type:'string',enum:['m','f','x']},
    bio:{type:'string'}
});
exports.User.index({name:1},{unique:true}).exec();
