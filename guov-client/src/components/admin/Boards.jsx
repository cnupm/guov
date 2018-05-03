import React from 'react';
import {styles} from '../AdminForm';
import DialogBoardModify from './DialogBoardModify';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';
import { Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

class Boards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boards: []
        };

        this.setSockHandlers();
    }

    setSockHandlers = () => {
        this.props.sock.on('loadBoardsReply', (reply) => {
            this.setState({boards: reply.boards});
        });
        
        this.props.sock.on('adminBoardCreateBoardReply', (reply) => {
            console.log('adminBoardCreateBoardReply -> ', reply);

            if(reply.success){
                let arr = this.state.boards;
                arr.push(reply.data);
                this.setState({boards: arr});
            }
        });

        this.props.sock.on('adminBoardRemoveBoardReply', (reply) => {
            console.log('adminBoardRemoveBoardReply ->', reply);

            if(reply.success)
                this.props.sock.emit('loadBoards');
        });
    }

    componentWillMount(){
        this.props.sock.emit('loadBoards');
    }

    onCreateBoard = () => {
        let board = document.getElementById('boardName').value;
        this.props.sock.emit('adminBoardCreateBoard', board);
        document.getElementById('boardName').value = '';
    }

    onBoardSelected = (row) => {
        let board = this.state.boards[row];
        this.setState({selectedBoard: board});
        //this.tableBody.setState({ selectedRows: row });
    }

    boardModifyDialogClosed = (source) => {
        this.setState({selectedBoard: undefined});
    }

    render(){
        return <div>
            <Subheader>Существующие доски:</Subheader>
            <Table
                height={200}
                width={400}
                selectable={true}
                multiSelectable={false}
                onRowSelection={this.onBoardSelected}>
                <TableBody
                    ref={(tableBody) => { this.tableBody = tableBody; }}
                    displayRowCheckbox={false}
                    deselectOnClickaway={false}
                    showRowHover={true}
                    stripedRows={false}
                    //style={styles.ulBody}
                    >
                    {this.state.boards.map( (row, index) => (
                        <TableRow key={index} style={styles.flexPad} hovered={row.separator}>
                            <TableRowColumn>{row.title}</TableRowColumn>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            <Subheader>Управление досками:</Subheader>
            <TextField floatingLabelText="Название доски" id='boardName'/>
            <RaisedButton type="button" label="Создать" primary onClick={this.onCreateBoard} />

            {(this.state.selectedBoard !== undefined) ?
                <DialogBoardModify onRequestClose={this.boardModifyDialogClosed} sock={this.props.sock}
                    board={this.state.selectedBoard}/> : ''
            }
        </div>;
    }
};

export default Boards;