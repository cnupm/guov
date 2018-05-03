import React from 'react';
import Board from 'react-trello';
import { Card } from 'material-ui/Card';
import openSocket from 'socket.io-client';

let eventBus = undefined;
let sock = openSocket("http://cnupm.ml:8000");

/**
 * Подвязка к сокету обработчикос глобальных сообщений - карточка добавлена/перемещена/...
 */
function setEventHandlers(){
  sock.on('cardMoved', (params) => {
    //падало, если в колонке этой карты нету (рассинхрон).
    //Надо бы добавить проверку на наличие самой карточки, да и вообще
    //всю эту ерунду в redux сунуть
    let laneId = params.from;
    // data.lanes.forEach((lane) => {
    //   lane.cards.forEach((card) => {
    //     if(card.id === params.cid){
    //       if(lane.id !== params.from){
    //         console.log('sync: ' + params.from + '/' + lane.id);
    //         laneId = lane.id;
    //       }
    //     }
    //   });
    // });

    eventBus.publish({type: 'MOVE_CARD', fromLaneId: laneId, toLaneId: params.to,
      cardId: params.cid, index: params.index});
    
    // data.lanes.forEach((lane) => {
    //   if(lane.id === params.from){
    //     lane.cards = lane.cards.filter(card => card.id !== params.cid);
    //   }
    // });
  });

  sock.on('cardAdded', (params) => {
    eventBus.publish({type: 'ADD_CARD', laneId: params.laneId, card: params.card});
  });
}

function onCardDragStart(cardId, laneId){
  console.log('card drag: ' + cardId);
}

function onCardDragEnd(cardId, sourceLaneId, targetLaneId, position){
  sock.emit('cardMoved', sourceLaneId, targetLaneId, cardId, position);
}

function onCardAdded(card, laneId){
  sock.emit('cardAdded', card, laneId);
}

function onCardDelete(cardId, laneId){
  sock.emit('cardDeleted', cardId, laneId);
}

/**
 * Подвязка шины для проброса сообщений в контейнер, где хранятся карточки и доски.
 * Заодно открытие сокета для синхронизации действия с карточками между пользователями.
 * @param {*} handle 
 */
const setEventBus = (handle) => {
  setEventHandlers();
  eventBus = handle
}

const CardsBoard = ({cards}) => ( 
  <Card>
    <Board data={cards} draggable={true} collapsibleLanes={false}
      editable={true} handleDragStart={onCardDragStart}
      handleDragEnd={onCardDragEnd} onCardAdd={onCardAdded}
      eventBusHandle={setEventBus} onCardDelete={onCardDelete}/>
  </Card>
);


export {CardsBoard, eventBus, sock};
  