import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Users from './admin/Users';
import Boards from './admin/Boards';

const styles = {
    checkbox: {
        marginBottom: 16,
        maxWidth: 230
    },
    spaced:{
        margin: '10px',
        marginTop: '2px'
    },
    flexPad: {
        flex: '1 100%',
    },
    ulBody: {
        display: 'flex',
        flexFlow: 'row wrap'
    },
    ulFullWidth:{
        width: '100%'
    },
    dialogRoot: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 0
    },
    dialogContent: {
        position: "relative",
        width: "80vw",
        transform: "",
    },
    dialogBody: {
        paddingBottom: 0
    }
};

const AdminForm = ({sock}) => ( 
    <Tabs>
        <Tab label="Пользователи" >
            <Users sock={sock}/>
        </Tab>
        <Tab label="Доски" >
            <Boards sock={sock}/>
        </Tab>
    </Tabs>
);

export {AdminForm, styles};