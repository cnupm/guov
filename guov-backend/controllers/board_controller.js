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
            client.broadcast.emit('updatedLaneReply', {id: res._id, title: res.title});
        }
    });
};

RemoveLane = (client, id) => {
    console.log(`remove lane request: ${id}`);
    dal.Lane.deleteOne({_id: id}, (err) => {
        client.emit('removeLaneReply', {success: err == null});
    });
};

module.exports = {CreateBoard, RemoveBoard, CreateLane, UpdateLane, RemoveLane};