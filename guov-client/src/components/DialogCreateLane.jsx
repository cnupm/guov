import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { Grid, Row, Col } from 'react-flexbox-grid';
import {styles} from './AdminForm';

class DialogCreateLane extends React.Component{

    onSaveClick = () => {
        this.props.sock.on('addLaneReply', (reply) => {
            console.log('card update reply: ', reply);
            this.props.onRequestClose(true, reply);
        });

        this.props.sock.emit('addLane', {boardId: this.props.boardId, title: this.refTilte.getValue()});
    }

    onCancelClick = () => {
        this.props.onRequestClose(true);
    }

    render(){
        const actions = [
            <FlatButton
              label="Добавить"
              primary={true}
              onClick={this.onSaveClick}/>,
            <FlatButton
              label="Отмена"
              onClick={this.onCancelClick}/>
        ];

        return <Dialog
            title={"Создание колонки"}
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
                            <TextField floatingLabelText="Название"
                                ref={(r) => {this.refTilte = r;}}
                                style={styles.spaced}/>
                        </Col>
                    </Row>
                </Grid>
            </Dialog>
    }
}

export default DialogCreateLane;