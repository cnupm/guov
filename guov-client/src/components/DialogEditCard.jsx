import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { Grid, Row, Col } from 'react-flexbox-grid';
import {styles} from './AdminForm';

class DialogEditCard extends React.Component{

    onSaveClick = () => {
        this.props.sock.on('updateCardReply', (reply) => {
            this.props.onRequestClose(true, reply);
        });

        let card = this.props.data.card;
        let laneId = this.props.data.laneId;
        this.props.sock.emit('updateCard', {id: card._id, laneId: laneId, title: this.refTilte.getValue(),
            description: this.refDescription.getValue(), label: this.refLabel.getValue()});
    }

    onCancelClick = () => {
        this.props.onRequestClose(true);
    }

    render(){
        const actions = [
            <FlatButton
              label="Сохранить"
              primary={true}
              onClick={this.onSaveClick}/>,
            <FlatButton
              label="Отмена"
              onClick={this.onCancelClick}/>
        ];

    return <Dialog
        title={"Редактирование карточки"}
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
                            defaultValue={this.props.data.card.title}
                            style={styles.spaced}/>

                        <TextField floatingLabelText="Метка"
                            ref={(r) => {this.refLabel = r;}}
                            defaultValue={this.props.data.card.label}
                            style={styles.spaced}/>

                        <TextField floatingLabelText="Описание"
                            ref={(r) => {this.refDescription = r;}}
                            defaultValue={this.props.data.card.description}
                            style={styles.spaced}/>

                    </Col>
                </Row>
            </Grid>
        </Dialog>
    }
}

export default DialogEditCard;