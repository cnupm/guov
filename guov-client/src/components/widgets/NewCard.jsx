import React,{Component} from 'react';
import * as Datetime from 'react-datetime';
var moment = require('moment');
require('moment/locale/ru');

/**
* Шаблон для создания новой карточки
*/
class NewCard extends Component {
  updateField = (field, evt) => {
    this.setState({[field]: evt.target.value})
  }

  handleAdd = () => {
    this.props.onAdd(this.state)
  }

  render() {
    const {onCancel} = this.props
    return (
      <div style={{background: 'white', borderRadius: 3, border: '1px solid #eee', borderBottom: '1px solid #ccc'}}>
        <div style={{padding: 5, margin: 5}}>
          <div>
            <div style={{marginBottom: 5}}>
              <input type="text" onChange={evt => this.updateField('responsible', evt)} placeholder="Ответственный" />
            </div>
            <div style={{marginBottom: 5, marginTop: 5}}>
              <Datetime inputProps={{ placeholder: 'Дата создания', disabled: false }} />
            </div>
            <div style={{marginBottom: 5}}>
              <Datetime inputProps={{ placeholder: 'Дата завершения', disabled: false }} />
            </div>
            <div style={{marginBottom: 5}}>
              <input type="text" onChange={evt => this.updateField('comments', evt)} placeholder="Комментарии" />
            </div>
          </div>
          <button onClick={this.handleAdd}>Сохранить</button>
          <button onClick={onCancel}>Отмена</button>
        </div>
      </div>
    )
  }
}

export default NewCard