import React from 'react';
import {styles} from '../AdminForm';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import { Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import Subheader from 'material-ui/Subheader';
import { Grid, Row, Col } from 'react-flexbox-grid';

class DialogBoardModify extends React.Component {
    constructor(props) {
        super(props);
        this.setSockHandlers();
        this.state = {
            open: true,
            selectedLane: {},
            lanes: (props.board.lanes ? props.board.lanes : [])
        };
    }

    setSockHandlers = () => {
        this.props.sock.on('addLaneReply', (reply) => {
            console.log('add reply:', reply);
            if(reply.success){
                let lanes = this.state.lanes;
                lanes.push(reply.lane);
                this.setState({lanes: lanes});
            }
        });

        this.props.sock.on('updateLaneReply', (reply) => {
            console.log('update lane reply:', reply);
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
        this.props.sock.emit('addLane', {title: laneProp.value, boardId: this.props.board._id});
        laneProp.value = '';
    }

    onRemoveLaneClick = () => {
        if(!this.tableBody.state.selectedRows || this.tableBody.state.selectedRows.length < 1){
            return;
        }

        let row = this.tableBody.state.selectedRows[0];
        console.log('remove lane at row:', row);
        let lanes = this.state.lanes;
        let laneId = lanes[row]._id;
        lanes.splice(row, 1);
        this.setState({lanes: lanes});
        this.props.sock.emit('removeLane', laneId);
    }

    onUpdateLaneClick = () => {
        let laneProp = document.getElementById('laneName');
        if(!this.tableBody.state.selectedRows
            || this.tableBody.state.selectedRows.length < 1
            || laneProp.value.length < 1){
            return;
        }

        let row = this.tableBody.state.selectedRows[0];
        console.log('update lane at row:', row);
        let lanes = this.state.lanes;
        lanes[row].title = laneProp.value;
        this.setState({lanes: lanes});
        this.props.sock.emit('updateLane', {id: lanes[row]._id, title: laneProp.value, boardId: this.props.board._id});
        laneProp.value = '';
    }

    onLaneSelected = (row) => {
        console.log('selected lane: ', this.state.lanes[row]);
        this.tableBody.setState({ selectedRows: row });
    };


    render(){
        const actions = [
            <FlatButton
              label="Сохранить"
              primary={true}
              onClick={this.onSaveClick}/>,
            <FlatButton
              label="Удалить"
              secondary={true}
              onClick={this.onRemoveClick}/>,
            <FlatButton
              label="Отмена"
              onClick={this.onCancelClick}/>
        ];

        return <Dialog
            title={"Редактирование доски: " + this.props.board.title}
            modal={false}
            open={true}
            actions={actions}
            autoScrollBodyContent={true}
            onRequestClose={this.props.onRequestClose}
            contentStyle={ styles.dialogContent }
            bodyStyle={ styles.dialogBody }
            style={ styles.dialogRoot }
            repositionOnUpdate={ false }>
        <Grid fluid style={{paddingTop: '0px'}}>
            <Row>
                <Col>
                    <Subheader>Основные параметры:</Subheader>
                    <TextField floatingLabelText="Название" defaultValue={this.props.board.title} style={styles.spaced}/>
                    <Subheader>Статус архивирования:</Subheader>
                    <Checkbox label="Доска в архиве" style={styles.checkbox} defaultChecked={this.props.board.archived}/>
                </Col>
            </Row>
            <Row>
                <Col>
                <Card style={{marginBottom: '4px'}}>
                    <CardHeader
                        subtitle="Колонки"
                        actAsExpander={true}
                        showExpandableButton={true}/>
                    <CardText expandable={true}>
                    <Table
                        height={200}
                        selectable={true}
                        multiSelectable={false}
                        onRowSelection={this.onLaneSelected}>
                        <TableBody
                            ref={(tableBody) => {this.tableBody = tableBody; }}
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

                    <TextField floatingLabelText="Название колонки" style={styles.spaced} id="laneName"/>

                    <RaisedButton type="button" label="добавить" primary
                        style={styles.spaced} onClick={this.onAddLaneClick}/>

                    <RaisedButton type="button" label="обновить"
                        style={styles.spaced} onClick={this.onUpdateLaneClick}/>

                    <RaisedButton type="button" label="удалить"
                        style={styles.spaced} onClick={this.onRemoveLaneClick}/>
                    </CardText>
                    </Card>
                </Col>
            </Row>
        </Grid>
      </Dialog>
    }
};

export default DialogBoardModify;