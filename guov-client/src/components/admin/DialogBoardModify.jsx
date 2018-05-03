import React from 'react';
import {styles} from '../AdminForm';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import { Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import Subheader from 'material-ui/Subheader';
import { Grid, Row, Col } from 'react-flexbox-grid';

class DialogBoardModify extends React.Component {
    constructor(props) {
        super(props);
        this.setSockHandlers();

        this.state = {
            open: true,
            selectedLane: undefined,
            lanes: (props.board.lanes ? props.board.lanes : [])
        };
    }

    setSockHandlers = () => {
        this.props.sock.on('adminAddLaneReply', (reply) => {
            console.log('add reply:', reply);
            if(reply.success){
                let lanes = this.state.lanes;
                lanes.push(reply.lane);
                this.setState({lanes: lanes});
            }
        });
    }

    onRemoveBoard = () => {
        console.log('row:', this.props.board._id + '/' + this.props.board.title);
        this.props.sock.emit('adminBoardRemoveBoard', this.props.board._id);
    }

    onRemoveClick = () => {
        console.log('removing board: ', this.props.board._id);
        this.onRemoveBoard();
        this.props.onRequestClose(true);
    }

    onCancelClick = () => {
        this.props.onRequestClose(true);
    }

    onAddLaneClick = () => {
        let laneProp = document.getElementById('laneName');
        console.log('adding lane: ', laneProp.value + "/" + this.props.board._id);
        this.props.sock.emit('adminAddLane', {title: laneProp.value, boardId: this.props.board._id});
        laneProp.value = '';
    }

    onLaneSelected = (row) => {
        // console.log('selected lane:', this.state.lanes[row]);
        //this.setState({selectedLane: this.state.lanes[row]._id});
    };

    render(){
        return <Dialog
            title={"Редактирование доски: " + this.props.board.title}
            modal={false}
            open={true}
            style={{maxHeight: 'none'}}
            autoScrollBodyContent={true}
            onRequestClose={this.props.onRequestClose}>
        <Grid fluid>
            <Row>
                <Col>
                    <Subheader>Основные параметры:</Subheader>
                    <TextField floatingLabelText="Название" defaultValue={this.props.board.title} style={styles.spaced}/>
                    <Subheader>Статус архивирования:</Subheader>
                    <Checkbox label="Доска в архиве" style={styles.checkbox} defaultChecked={this.props.board.archived}/>
                </Col>
                <Col>
                    <Subheader>Колонки:</Subheader>
                    <Table
                        height={200}
                        selectable={true}
                        multiSelectable={false}
                        onRowSelection={this.onLaneSelected}>
                        <TableBody
                            displayRowCheckbox={false}
                            deselectOnClickaway={false}
                            showRowHover={false}
                            stripedRows={false}
                            >
                            {this.state.lanes.map( (row, index) => (
                                <TableRow key={index} style={styles.flexPad}>
                                    <TableRowColumn>{row.title}</TableRowColumn>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <TextField floatingLabelText="Название колонки" style={styles.spaced}/>
                    <RaisedButton type="button" label="добавить" primary
                        style={styles.spaced} onClick={this.onAddLaneClick}/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <br/>
                    <RaisedButton type="button" label="Сохранить" primary style={styles.spaced}/>
                    <RaisedButton type="button" label="Удалить" style={styles.spaced} onClick={this.onRemoveClick}/>
                    <RaisedButton type="button" label="Отмена" onClick={this.onCancelClick}/>
                </Col>
            </Row>
        </Grid>
      </Dialog>
    }
};

export default DialogBoardModify;