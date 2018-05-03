import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import DialogUserModify from './DialogUserModify';


const styles = {
    block: {
        maxWidth: 350,
    },
    list: {
        width: 400,
        margin: 20,
        marginLeft: 5
    }
};

class Users extends React.Component {

    constructor(props) {
        super(props);
        this.setSockHandlers();
        this.state = {
            users: []
        }
    }

    setSockHandlers = () => {
        this.props.sock.on('adminUsersFindReply', (reply) => {
            console.log('adminUsersFindReply -> ', reply);
            this.setState({users: reply});
        });
    }

    onFindUser = () => {
        let email = document.getElementById('email').value;
        console.log('find user: ', email);
        this.props.sock.emit('adminUsersFind', email);
    }

    renderUsersList = () => {
        return <Paper zDepth={3} style={styles.list}>
            <List>{this.state.users.map((u) => {return this.renderUsersListItem(u);})}</List>
        </Paper>;
    }

    renderUsersListItem = (u) => {
        return <ListItem primaryText={u.email} key={u.id} onClick={() => this.userSelected(u)}/>
    }

    userSelected = (user) => {
        console.log('user selected: ', user);
        this.setState({selectedUser: user});
    }

    userModifyDialogClosed = (source) => {
        this.setState({selectedUser: undefined});
    }

    render() {
        return <div>
            <TextField floatingLabelText="Email пользователя" name="email" id='email'/>

            <RaisedButton type="button" label="Найти" primary onClick={this.onFindUser} />
            {(this.state.users.length > 0) ? this.renderUsersList() : ''}
            {(this.state.selectedUser !== undefined) ?
                <DialogUserModify onRequestClose={this.userModifyDialogClosed} sock={this.props.sock}
                    user={this.state.selectedUser}/> : ''
            }
        </div>;
    }
};

export default Users;