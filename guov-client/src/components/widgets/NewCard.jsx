import React,{Component} from 'react';


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
              <input type="text" onChange={evt => this.updateField('title', evt)} placeholder="Titles" />
            </div>
            <div style={{marginBottom: 5}}>
              <input type="text" onChange={evt => this.updateField('description', evt)} placeholder="Description" />
            </div>
          </div>
          <button onClick={this.handleAdd}>Add</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    )
  }
}

export default NewCard