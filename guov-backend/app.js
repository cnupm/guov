const cookie = require('cookie');
const bcrypt = require('bcrypt');
const io = require('socket.io')();
const logger = require('morgan');
const async = require("async");
const waterfall= require('async/waterfall');

/**
 * DB models
 */
const mongoose = require('mongoose');
const User = require('./models/user');
const BoardMgr = require('./models/board');
const board_ctl = require('./controllers/board_controller');
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
  client.on('adminBoardCreateBoard', (title) => {
    board_ctl.CreateBoard(client, title);
  });

  //Удаление доски
  client.on('adminBoardRemoveBoard', (boardId) => {
    board_ctl.RemoveBoard(client, boardId);
  });

  //Добавление колонки для карточек
  client.on('addLane', (req) => {
    board_ctl.CreateLane(client, req);
  });

  client.on('updateLane', (req) => {
    board_ctl.UpdateLane(client, req);
  });

  client.on('removeLane', (req) => {
    board_ctl.RemoveLane(client, req);
  });

  client.on('updateCard', (req) => {
    board_ctl.UpdateCard(client, req);
  });

  //аутентификация
  client.on('login', (email, password) => {
    console.log('login attempt form ' + email);

    User.findOne({'Email': email, 'Enabled': true}, (err, usr) => {
      console.log('err: ' + err);
      console.log('usr: ' + usr);

      if(usr != null && bcrypt.compareSync(password, usr.Password)){
        client.emit('login-reply', {success: true});
        // loadBoard().then((data) => {
        //   console.log('board: ' + JSON.stringify(data));
        //   client.emit('login-reply', {success: true, board: {lanes: data}});
        // });
      } else {
        client.emit('login-reply', {success: false});
      }
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

  client.on('loadBoardById', (id) => {
    loadBoard(id).then((res) => {
      client.emit('loadBoardByIdReply', {board: res});
    }).catch((err) => {
      console.error('loadBoardById failed: ', err);
    });
  });
});

/**
 * Загрузка списка доступных досок
 */
function loadBoard(id){
  console.log(`load board: ${id}`);
  return new Promise((ok, fail) => {
    BoardMgr.Board.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id)
        },
      },
      {
        $lookup: {
          from: 'lanes',
          localField: '_id',
          foreignField: 'boardId',
          as: 'lanes',         
        }
      },
      {
        $unwind: {
          path: "$lanes",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'cards',
          localField: 'lanes._id',
          foreignField: 'laneId',
          as: 'cards'
      }},
      {
          $group: {
            _id: "$_id",
            title: {$first: "$title"},
            lanes: {
              $push: {
                id: "$lanes._id",
                title: "$lanes.title",
                cards: "$cards"
            }}
      }}
      
    ]).then((res) => {
      //чтоб валидатор не матерился на клиенте - явный каст айдишника к строке
      res[0].lanes.forEach((lane) => {lane.id = '' + lane.id;});
      console.log('collected:', JSON.stringify(res));
      ok(res);
    }).catch((err) => {fail(err);});
  });
}