const dal = require('../dal');
const db = dal.mongoose;

/**
 * Сущности для отображение доски - доска, колонка, карточка
 */

var Lane_ = new db.Schema({
    title: {type: String, required: true},
    boardId: {type: db.Schema.Types.ObjectId, required: true}
});

Lane_.plugin(dal.autoIncrement.plugin, 'Lane');
var Lane = db.model("Lane", Lane_);

var Card_ = new db.Schema({
    title: {type: String, required: true},
    label: {type: String, required: false},
    description: {type: String, required: false},
    laneId: {type: Number, required: true},
    id: {type: String, required: true}
});
var Card = db.model("Card", Card_);

var Board_ = new db.Schema({
    title: {type: String, required: true}
});
var Board = db.model("Board", Board_);

module.exports = {Lane, Card, Board};