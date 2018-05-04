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
        maxWidth: 200
    },
    buttons: {
        margin: 10
    }
};

const LoginForm = ({onSubmit,
    onChange,
    appState,
    onRegister}) => (
        <center style={styles.block}>
        <Card className="container" style={styles.buttons}>
            <form action="/api/auth"  onSubmit={onSubmit}>
                <div className="field-line">
                    <TextField
                        floatingLabelText="E-mail"
                        name="email"
                        onChange={onChange}
                        defaultValue={appState.cookies.defaultEmail}
                        id='email'
                    />
                </div>

                <div className="field-line">
                    <TextField
                    floatingLabelText="Пароль"
                    type="password"
                    name="password"
                    onChange={onChange}
                    id='password'
                    />
                </div>
            
                <Checkbox label="Запомнить e-mail" style={styles.checkbox} onCheck={onChange}
                    defaultChecked={appState.cookies.saveLogin === 'true'}/>
                <RaisedButton type="submit" label="Войти" primary/>
                <RaisedButton label="Регистрация" style={styles.buttons} onClick={onRegister}/>
            </form>
        </Card>
        </center>
);

export default LoginForm;