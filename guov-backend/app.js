const cookie = require('cookie');
const bcrypt = require('bcrypt');
const io = require('socket.io')();
const logger = require('morgan');
const async = require("async");
const waterfall= require('async/waterfall');

/**
 * DB models
 */
const User = require('./models/user');
const BoardMgr = require('./models/board');
io.listen(8000);

/**
 * Событие "клиент подключился". Подписка на сообщения.
 */
io.on('connection', (client) => {
  //loadBoard();
  console.log('client connected, number of clients: ' + io.engine.clientsCount);
  
  //перемещение карточек
  client.on('cardMoved', (laneFrom, laneTo, cardId, pos) => {
    console.log('card moved: ' + laneFrom + '/' + laneTo + '/' + cardId + '/' + pos);

    BoardMgr.Card.update({id: cardId}, {laneId: laneTo}, (err, res) => {
      if(!err){
        client.broadcast.emit('cardMoved', {from: laneFrom, to: laneTo, cid: cardId, index: pos});
      }
    });
  });

  //добавление новой карты
  client.on('cardAdded', (card, lane) => {
    console.log('card added: ' + JSON.stringify(card));
    BoardMgr.Card.create({id: card.id, title: card.title,
      description: card.description, label: card.label, laneId: lane}, (err, mdl) => {
        if(err == null && mdl != null){
          client.broadcast.emit('cardAdded', {card: card, laneId: lane});
        } else {
          console.error('failed to create card:', err);
        }

    });
  });

  //удаление карточки
  client.on('cardDeleted', (cardId, laneId) => {
    console.log('card deleted: ' + laneId + '/' + cardId);

    BoardMgr.Card.remove({id: cardId, laneId: laneId}, (err) => {
      if(!err){
        client.broadcast.emit('cardDeleted', {from: laneId, cid: cardId});
      }
    });
  });

  //Создание доски
  client.on('adminBoardCreateBoard', (boardName) => {
    console.log('create board: ', boardName);

    BoardMgr.Board.create({title: boardName}, (err, board) => {
      client.emit('adminBoardCreateBoardReply', {success: err == null, data: board});
    });
  });

  //Удаление доски
  client.on('adminBoardRemoveBoard', (boardId) => {
    console.log('REMOVE board: ', boardId);

    BoardMgr.Board.deleteOne({_id: boardId}, (err) => {
      client.emit('adminBoardRemoveBoardReply', {success: err == null});
    });
  });

  //Добавление колонки для карточек
  client.on('adminAddLane', (req) => {
    console.log('Add lane: ', req);

    BoardMgr.Lane.create({boardId: req.boardId, title: req.title}, (err, lane) => {
      client.emit('adminAddLaneReply', {success: err == null, lane: lane});
    });
  });


  //аутентификация
  client.on('login', (email, password) => {
    console.log('login attempt form ' + email);

    User.findOne({'Email': email, 'Enabled': true}, (err, usr) => {
      console.log('err: ' + err);
      console.log('usr: ' + usr);

      if(usr != null && bcrypt.compareSync(password, usr.Password)){
        loadBoard().then((data) => {
          console.log('board: ' + JSON.stringify(data));
          client.emit('login-reply', {success: true, board: {lanes: data}});
        });
      } else {
        client.emit('login-reply', {success: false});
      }

      // if(usr === null){
      //   var hash = bcrypt.hashSync(password, 10);
      //   User.create({Email: email, Password: hash, Enabled: true}, (err, mdl) => {
      //     console.log('- err: ' + err);
      //     console.log('- mdl: ' + mdl);
      //   });
      // }
    });
  });

  client.on('signup', (email, password) => {
    console.log(`signup request form ${email}`);

    User.findOne({'Email': email}, (err, usr) => {
      console.log('err: ' + err);
      console.log('usr: ' + usr);

      if(usr != null){
        client.emit('signup-reply', {success: false, message: 'Пользователь с таким адресом уже зарегистрирован.'});
      } else {
        var hash = bcrypt.hashSync(password, 10);
        User.create({Email: email, Password: hash, Enabled: true}, (err, mdl) => {
          console.log('- err: ' + err);
          console.log('- mdl: ' + mdl);
          client.emit('signup-reply', {success: err == null});
        });
      }
    });
  });

  //TODO: инициализировать только после авторизации и для привилегированных пользователей
  client.on('adminUsersFind', (email) => {
    console.log('adminUsersFind -> ', email);

    User.find({Email: new RegExp(email, "i")}).then((res) => {
      console.log('res: ', res);
      let reply = [];
      res.forEach((usr) => {
        reply.push({id: usr._id, email: usr.Email, enabled: usr.Enabled});
      });

      client.emit('adminUsersFindReply', reply);
    }).catch((err) => {
      console.log('err: ', err)
    });
  });

  client.on('loadBoards', () => {
    BoardMgr.Board.aggregate([{
      $lookup: {
        from: 'lanes',
        localField: '_id',
        foreignField: 'boardId',
        as: 'lanes'
      }
    }]).then((res) => {
      let reply = [];
      res.forEach((board) => {
        reply.push(board);
      });

      console.log('load reply: ' + reply);
      client.emit('loadBoardsReply', {boards: reply});
    })
  });
});

function loadBoard(){
  return new Promise((ok, fail) => {
    BoardMgr.Lane.aggregate([{
      $lookup: {
        from: 'cards',
        localField: '_id',
        foreignField: 'laneId',
        as: 'cards'
      }
    }]).then((res) => {
      res.forEach((lane) => {lane.id = '' + lane._id;});
      console.log('collected:', JSON.stringify(res));
      ok(res);
    }).catch((err) => {fail(err);});
  });
}