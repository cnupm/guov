import React from 'react';
import Board from 'react-trello';
import DialogEditCard from './DialogEditCard'
import openSocket from 'socket.io-client';

let eventBus = undefined;
let sock = openSocket("http://109.173.112.19:8000");

/**
 * Подвязка к сокету обработчикос глобальных сообщений - карточка добавлена/перемещена/...
 */
/*function setEventHandlers(){
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
}*/

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

class CardsBoard extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      eventBus: undefined,
      cardToEdit: undefined
    }
  }

  setEventBus = (handle) => {
    this.setState({eventBus: handle});
  }

  updateLanes = (lanes) => {
    console.log('pub!', lanes);
    this.state.eventBus.publish({type: 'REFRESH_BOARD', data: lanes});
  }

  onCardClick = (cardId, meta, laneId) => {
    let lane = this.props.cards.lanes.filter((e) => {return e.id === laneId});
    if(lane.length === 1){
      let card = lane[0].cards.filter((e) =>  {return e.id === cardId;});
      console.log(`card clicked: ${cardId}, ${JSON.stringify(card)}, ${laneId}`);
      this.setState({cardToEdit: {card: card[0], laneId: lane[0].id}});
    }
  }

  onEditCardClose = (flag, reply = null) => {
    if(reply && reply.success){
      let data = this.props.cards;
      data.lanes = data.lanes.map((l) => {
        let newLane = l;
        if(newLane.id === reply.laneId){
          newLane.cards = newLane.cards.map((c) => {
            let newCard = c;
            if(c._id === reply.id){
              c.title = reply.title;
              c.label = reply.label;
              c.description = reply.description;
            }
            return c;
          });
        }
        return newLane;
      });

      this.state.eventBus.publish({type: 'REFRESH_BOARD', data: data});
      this.setState({cardToEdit: undefined});
    }
  }

  render(){

    if(this.state.cardToEdit)
      return <DialogEditCard data={this.state.cardToEdit}
        sock={sock} onRequestClose={this.onEditCardClose}/>

    return <Board data={this.props.cards} draggable={true}
      collapsibleLanes={false} style={{height: '94vh'}} ref={(obj) => {this.boardRef = obj;}}
      editable={true} handleDragStart={onCardDragStart}
      handleDragEnd={onCardDragEnd} onCardAdd={onCardAdded}
      eventBusHandle={this.setEventBus} onCardDelete={onCardDelete}
      onCardClick={this.onCardClick}/>;
  }
}


export {CardsBoard, eventBus, sock};
  