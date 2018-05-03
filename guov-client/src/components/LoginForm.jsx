import React from 'react';
import { Card } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

const styles = {
    block: {
        maxWidth: 350,
    },
    checkbox: {
        marginBottom: 16,
        maxWidth: 140
    },
};

const LoginForm = ({onSubmit,
    onChange,
    errors,
    successMessage,
    appState}) => (
        <center style={styles.block}>
        <Card className="container">
            <form action="/api/auth"  onSubmit={onSubmit}>
                <div className="field-line">
                    <TextField
                        floatingLabelText="Email"
                        name="email"
                        onChange={onChange}
                        defaultValue={appState.cookies.defaultEmail}
                        id='email'
                    />
                </div>

                <div className="field-line">
                    <TextField
                    floatingLabelText="Password"
                    type="password"
                    name="password"
                    onChange={onChange}
                    id='password'
                    />
                </div>
            
                <Checkbox label="Save email" style={styles.checkbox} onCheck={onChange}
                    defaultChecked={appState.cookies.saveLogin === 'true'}/>
                <RaisedButton type="submit" label="Log in" primary/>
            </form>
        </Card>
        </center>
);

export default LoginForm;