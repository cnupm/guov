const dal = require('../dal');

var User = new dal.mongoose.Schema({
    Email: {type: String, required: true}, //логин
    Password: {type: String, required: true}, //хеш пароля
    Enabled: {type: Boolean, required: true} //признак "пользователь заблокирован"
});

var UserModel = dal.mongoose.model("User", User);

module.exports = UserModel;