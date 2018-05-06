import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';

const styles = {
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
    gridList: {
      width: '80%',
      //height: 450,
      overflowY: 'auto',
    },
    subtitle: {
        cursor: 'arrow'
    }
};

class BoardsList extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            boards: []
        };
    }

    /**
     * Обработка нажатия на наименование доски в общем списке
     */
    onTileTouch = (id) => {
        this.props.sock.on('loadBoardByIdReply', (reply) => {
            this.props.onBoardSelected(reply.board);
        });

        this.props.sock.emit('loadBoardById', this.state.boards[id]._id);
    };

    /**
     * Загрузка списка всех доступных досок перед монтированием компонента
     */
    componentWillMount(){
        this.props.sock.on('loadBoardsReply', (reply) => {
            this.setState({boards: reply.boards});
        });

        this.props.sock.emit('loadBoards');
    }

    render(){
        return <div style={styles.root} id='boardsList'>
        <GridList onClick={ (e) => {this.onTileTouch}}
        cellHeight={80}
        style={styles.gridList}
        cols={4}>
        {this.state.boards.map((tile, idx) => (
          <GridTile
            key={idx}
            title={tile.title}
            subtitleStyle={styles.subtitle}
            onClick={this.onTileTouch.bind(this, idx)}
          >
          </GridTile>
        ))}
      </GridList></div>;
    }
};

export default BoardsList;