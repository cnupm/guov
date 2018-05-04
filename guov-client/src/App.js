import React, { Component } from 'react';
import {CardsBoard, sock} from './components/CardsBoard'
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import {AdminForm} from './components/AdminForm';
import Subheader from 'material-ui/Subheader';
import CircularProgress from 'material-ui/CircularProgress';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import Snackbar from 'material-ui/Snackbar';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import './App.css';

const muiTheme = getMuiTheme({
  appBar: {
    color: '#195273',
    titleFontWeight: 300,
    height: 30
  }
});

class App extends Component {

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      //для формы логина
      email: this.props.cookies.get('defaultEmail'),
      password: '', //XXX: for development
      saveLogin: this.props.cookies.get('saveLogin'),
      //всплывающая подсказка внизу экрана
      open: false,
      message: '',
      //всё остальное - стартовая страница, флаг авторизации, связи с сервером, куки и карточки
      currentPage: 'login',
      authorized: false,
      connected: false,
      cookies: this.props.cookies.getAll(),
      board: {lanes: []}
    };

    this.onLoginSubmit = this.onLoginSubmit.bind(this);
    this.onLoginChange = this.onLoginChange.bind(this);
  }

  //вызывается из компонента с формой логина
  onLoginSubmit(event){
    console.log('evt:', event.currentTarget);

    if(sock.connected){
        this.setState({ open: false});
        sock.emit('login', this.state.email, this.state.password);
        sock.on('login-reply', (params) => {
          console.log(params);
          if(!params.success){
            this.setState({open: true,message: 'Invalid login and/or password.'});
          } else {
            this.props.cookies.set('defaultEmail', this.state.saveLogin ? this.state.email : '', {path: '/'});
            this.props.cookies.set('saveLogin', this.state.saveLogin, {path: '/'});
            this.setState({authorized: true, board: params.board, currentPage: 'board'});
          }
        });
    }
    event.preventDefault();
  }

  onLoginChange(event, flag){
    const { target: { name, value } } = event;
    
    if(typeof(flag) === 'boolean'){ //'save login' checkbox
      this.setState({saveLogin: flag});
    } else {
      this.setState(() => ({[name]: value }));
    }
  }

  /**
   * Gtht[jl yf ajhve htubcnhfwbb]
   */
  onRegisterRequest = (evt) => {
    let val = document.getElementById('email').value;
    this.setState({currentPage: 'signup'});
  }

  /**
   * Передача/обработка запроса на регистрацию
   */
  onRegisterAction = (evt) => {
    let email = document.getElementById('email').value;
    let pass0 = document.getElementById('password').value;
    let pass1 = document.getElementById('password_confirm').value;
    
    if(email.length < 1){
      this.showMessage('Не указан e-mail.');
    } else if(pass0.length < 1 || pass0 !== pass1){
      this.showMessage('Пароли не могут быть пустыми и должны совпадать.');
    } else {
      sock.on('signup-reply', (reply) => {  
        if(reply.success){
          this.setCookie('defaultEmail', '');
          this.setCookie('saveLogin', false);
          this.setState({email: '', saveLogin: false, currentPage: 'login'});
        } else {
          this.showMessage(reply.message);
        }
      });

      sock.emit('signup', email, pass0);
    }
  }

  showMessage = (msg) => {
    this.setState({open: true, message: msg});
  } 

  setCookie = (key, value) => {
    this.props.cookies.set(key, value, {path: '/'});
  }

  componentDidMount(){
    console.log('cookies:',this.state.cookies);

    // отлов соединения/потери связи с сервером
    sock.on('connect', () => {
      this.setState({connected: true, open: false, message: ''});
    });

    sock.on('disconnect', () => {
      this.setState({connected: false, open: true, message: 'Disconnected from server.'});
    });
  }

  snackRequestClose = () => {
    this.setState({open: false, message: ''});
  }

  onMenuAdmin = () => {
    this.setState({currentPage: 'admin'});
  }
 
  //компонеты - индикатор связи с сервером, форма логина и основная страница
  ConnectionLoader(){
    return <center>
              <Subheader>Соединение с сервером...</Subheader>
              <CircularProgress size={80} thickness={5} />
            </center>;
  }

  /**
   * Форма авторизации
   */
  LoginBlock(){
    return <center>
        <LoginForm onSubmit={this.onLoginSubmit} appState={this.state}
          onChange={this.onLoginChange} onRegister={this.onRegisterRequest}/>
      </center>;
  }

  /**
   * Форма для регистрации нового пользователя
   */
  SignupBlock(){
    return <center><SignupForm onRegister={this.onRegisterAction}/></center>;
  }

  /**
   * Отображение выбранной доски
   */
  BoardPage(){
    return <div>
      <AppBar
        title={<small>{this.state.email}</small>}
        iconElementLeft={
          <IconMenu
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
          >
            <MenuItem primaryText="Admin" onClick={this.onMenuAdmin}/>
            <MenuItem primaryText="Settings" />
            <MenuItem primaryText="Sign out" />
          </IconMenu>
        }
      />
      <CardsBoard cards={this.state.board} />
    </div>;
  }

  AdminPage(){
    return <AdminForm sock={sock}/>;
  }

  RenderCurrentPage(){
    console.warn('current page: ',this.state.currentPage);
    switch(this.state.currentPage){
      case 'login': return this.LoginBlock();
      case 'signup': return this.SignupBlock();
      case 'board': return this.BoardPage();
      case 'admin': return this.AdminPage();
      default: return this.BoardPage();
    }
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
      <div>
        {
          //!this.state.authorized ?
          //  (this.state.connected? this.LoginBlock() : this.ConnectionLoader()) : this.RenderCurrentPage()
          this.RenderCurrentPage()
        }
        <Snackbar open={this.state.open} message={this.state.message}
        autoHideDuration={4000} onRequestClose={this.snackRequestClose}/>
      </div>
      </MuiThemeProvider>
    );
  }
}

export default withCookies(App);
