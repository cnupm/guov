const dal = require('../dal');

var User = new dal.mongoose.Schema({
    Email: {type: String, required: true}, //логин
    Password: {type: String, required: true}, //хеш пароля
    Enabled: {type: Boolean, required: true}, //признак "пользователь заблокирован"
    Role: {type: Number, required: true},
    Department: {type: ObjectId, required: true},
    Director: {type: ObjectId, required: false}
});

var UserModel = dal.mongoose.model("User", User);

module.exports = UserModel;