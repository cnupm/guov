import React from 'react';
import { Card } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


const styles = {
    block: {
        maxWidth: 350,
    },
    checkbox: {
        marginBottom: 16,
        maxWidth: 140
    },
    buttons: {
        margin: 10
    }
};

const SignupForm = ({onRegister}) => (
        <center style={styles.block}>
            <Card className="container" style={styles.buttons}>
                <form>
                    <div className="field-line">
                        <TextField
                            floatingLabelText="E-mail"
                            name="email"
                            id='email'
                        />
                    </div>

                    <div className="field-line">
                        <TextField
                        floatingLabelText="Пароль"
                        type="password"
                        name="password"
                        id='password'/>
                    </div>

                    <div className="field-line">
                        <TextField
                        floatingLabelText="Подтверждение пароля"
                        type="password"
                        name="password_confirm"
                        id='password_confirm'/>
                    </div>
                
                    <RaisedButton label="Регистрация" primary style={styles.buttons} onClick={onRegister}/>
                </form>
            </Card>
        </center>
);

export default SignupForm;