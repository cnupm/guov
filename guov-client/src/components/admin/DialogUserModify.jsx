import React from 'react';
import {styles} from '../AdminForm';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import { Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import Subheader from 'material-ui/Subheader';
import { Grid, Row, Col } from 'react-flexbox-grid';

const rights = [
    {title: 'Общие', separator: true},
    {title: 'Администратор', id: 'UR_ROOT'},
    {title: 'Карточки', separator: true},
    {title: 'Создание', id: 'UR_ADD_CARD'},
    {title: 'Перемещение', id: 'UR_MOVE_CARD'},
    {title: 'Удаление', id: 'UR_DELETE_CARD'},
    {title: 'Картотеки', separator: true},
    {title: 'Создание', id: 'UR_CREATE_LANE'},
];

class DialogueUserModify extends React.Component {

    constructor(props) {
        super(props);
        this.setSockHandlers();

        this.state = {
            open: true
        };
    }

    setSockHandlers = () => {
    }

    onCancelClick = () => {
        this.props.onRequestClose(true);
    }

    onSaveClick = () => {
        this.props.onRequestClose(false);
    }

    onUserRightSelected = (rows) => {
        console.log('row selected: ' + rows);
        this.tableBody.setState({ selectedRows: rows });
    }

    render(){
        const actions = [
            <FlatButton
              label="Сохранить"
              primary={true}
              onClick={this.onSaveClick}/>,
            <FlatButton
              label="Отмена"
              primary={false}
              onClick={this.onCancelClick}/>
        ];
        return <Dialog
            title={"Редактирование пользователя: " + this.props.user.email}
            modal={false}
            open={true}
            onRequestClose={this.props.onRequestClose}
            actions={actions}
            autoScrollBodyContent={true}
            contentStyle={ styles.dialogContent }
            bodyStyle={ styles.dialogBody }
            style={ styles.dialogRoot }
            repositionOnUpdate={ false }>
        <Grid fluid>
            <Row>
                <Col>
                    <Subheader>Основные параметры учетной записи:</Subheader>
                    <TextField floatingLabelText="Email пользователя" defaultValue={this.props.user.email} style={styles.spaced}/>
                    <TextField floatingLabelText="Установить пароль" id="userPassword" />
                    <Subheader>Статус блокировки:</Subheader>
                    <Checkbox label="Пользователь активен" style={styles.checkbox} defaultChecked={this.props.user.enabled}/>
                </Col>
                <Col>
                    <Subheader>Привилегии пользователя:</Subheader>
                    <Table
                        height={200}
                        selectable={true}
                        multiSelectable={true}
                        onRowSelection={this.onUserRightSelected}>
                        <TableBody
                            ref={(tableBody) => { this.tableBody = tableBody; }}
                            displayRowCheckbox={false}
                            deselectOnClickaway={false}
                            showRowHover={false}
                            stripedRows={false}
                            style={styles.ulBody}>
                            {rights.map( (row, index) => (
                                <TableRow key={index} style={styles.flexPad} hovered={row.separator}>
                                    <TableRowColumn>{row.separator ? row.title : <Checkbox/>}</TableRowColumn>
                                    <TableRowColumn style={styles.ulFullWidth}>{!row.separator ? row.title : ''}</TableRowColumn>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Col>
            </Row>
        </Grid>
      </Dialog>
    }
};

export default DialogueUserModify;