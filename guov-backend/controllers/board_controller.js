const {mongoose} = require('../dal');
const dal = require('../models/board');


CreateBoard = (client, title) => {
    console.log(`create board request: ${title}`);
    dal.Board.create({title: title}, (err, board) => {
        client.emit('adminBoardCreateBoardReply', {success: err == null, data: board});
    });
};

RemoveBoard = (client, id) => {
    console.log(`remove board request: ${id}`);
    dal.Board.deleteOne({_id: id}, (err) => {
        client.emit('adminBoardRemoveBoardReply', {success: err == null});
    });
};

CreateLane = (client, req) => {
    dal.Lane.create({boardId: req.boardId, title: req.title}, (err, lane) => {
        client.emit('addLaneReply', {success: err == null, lane: lane});
    });
};

UpdateLane = (client, req) => {
    console.log(`updateLane req: ${JSON.stringify(req)}`);
    dal.Lane.update({_id: req.id}, {title: req.title}, (err, res) => {
        console.log('err:', err);
        console.log('res:', res);
        if(!err){
            client.emit('updatedLaneReply', {id: req.id, title: res.title});
        }
    });
};

RemoveLane = (client, id) => {
    console.log(`remove lane request: ${id}`);
    dal.Lane.deleteOne({_id: id}, (err) => {
        client.emit('removeLaneReply', {success: err == null});
    });
};

UpdateCard = (client, req) => {
    console.log(`update card: ${JSON.stringify(req)}`);
    dal.Card.update({_id: mongoose.Types.ObjectId(req.id)},
        {title: req.title, label: req.label, description: req.description},
        (err, res) => {
            console.log('err:', err);
            console.log('res:', res);
            client.emit('updateCardReply', {id: req.id, title: req.title, label: req.label,
                description: req.description, laneId: req.laneId, success: err == null});
    });
};

module.exports = {CreateBoard, RemoveBoard, CreateLane, UpdateLane, RemoveLane, UpdateCard};