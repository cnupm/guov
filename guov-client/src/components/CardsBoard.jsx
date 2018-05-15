import React from 'react';
import Board from 'react-trello';
import DialogEditCard from './DialogEditCard'
import DialogCreateLane from './DialogCreateLane';
import openSocket from 'socket.io-client';
import NewCard from './widgets/NewCard'
import CustomCard from './widgets/CustomCard'

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
      cardToEdit: undefined,
      doCreateLane: false
    }

    this.eventBus = undefined;
  }

  setEventBus = (handle) => {
    this.eventBus = handle;
  }

  updateLanes = (lanes) => {
    this.eventBus.publish({type: 'REFRESH_BOARD', data: lanes});
  }

  showCreateLane = () => {
    this.setState({doCreateLane: true});
  }

  onCardClick = (cardId, meta, laneId) => {
    let lane = this.props.cards.lanes.filter((e) => {return e.id === laneId});
    if(lane.length === 1){
      let card = lane[0].cards.filter((e) =>  {return e.id === cardId;});
      this.setState({cardToEdit: {card: card[0], laneId: lane[0].id}});
    }
  }

  onEditCardClose = (flag, reply = null) => {
    if(reply && reply.success){
      let data = this.props.cards;
      data.lanes = data.lanes.map((l) => {
        if(l.id === reply.laneId){
          l.cards = l.cards.map((c) => {
            if(c._id === reply.id){
              c.title = reply.title;
              c.label = reply.label;
              c.description = reply.description;
            }
            return c;
          });
        }
        return l;
      });

      this.eventBus.publish({type: 'REFRESH_BOARD', data: data});
    }

    this.setState({cardToEdit: undefined});
  }

  onCreateLaneClose = (flag, reply = null) => {
    if(reply !== null){
      let board = this.props.cards;
      reply.lane.cards = [];
      reply.lane.id = '' + reply.lane._id;
      board.lanes.push(reply.lane);
      this.eventBus.publish({type: 'REFRESH_BOARD', data: board});
    }

    this.setState({doCreateLane: false});
  }

  render(){

    if(this.state.cardToEdit){
      return <DialogEditCard data={this.state.cardToEdit}
        sock={sock} onRequestClose={this.onEditCardClose}/>
    } else if(this.state.doCreateLane) {
      return <DialogCreateLane sock={sock} boardId={this.props.cards._id} onRequestClose={this.onCreateLaneClose}/>      
    }

    return <Board data={this.props.cards} draggable={true}
      collapsibleLanes={false} style={{height: '94vh'}}
      editable={true} handleDragStart={onCardDragStart}
      handleDragEnd={onCardDragEnd} onCardAdd={onCardAdded}
      eventBusHandle={this.setEventBus} onCardDelete={onCardDelete}
      onCardClick={this.onCardClick}
      //onCardClick={(cardId, metadata) => alert(`Card with id:${cardId} clicked.`)}
      customCardLayout newCardTemplate={<NewCard />}>
        <CustomCard/>
      </Board>
  }
}


export {CardsBoard, sock};