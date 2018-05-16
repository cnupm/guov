import React from 'react';
import {CardHeader, CardRightContent, CardTitle, Detail, Footer, MovableCardWrapper} from '../../styles/Base'
import Tag from '../Tag'

/**
 * Компонент для отображения карточек
 */
class CustomCard extends React.Component {
    removeCard = e => {
      const {id, laneId, removeCard, onDelete} = this.props
      removeCard(laneId, id)
      onDelete(id, laneId)
      e.stopPropagation()
    }
  
    renderBody = () => {
      if (this.props.customCardLayout2) {
        const {customCard, ...otherProps} = this.props
        return React.cloneElement(customCard, {...otherProps})
      } else {
        const {responsible, createdAt, deadlineAt, comments, tags} = this.props
        return (
          <span>
            <CardHeader>
              <CardTitle>{responsible}</CardTitle>
            </CardHeader>
            <CardTitle>Сроки</CardTitle>
            <Detail>Создано: {new String(createdAt)}</Detail>
            <Detail>Завершить: {new String(deadlineAt)}</Detail>
            <CardTitle>Отметки</CardTitle>
            <Detail>{comments}</Detail>
            {tags && <Footer>{tags.map(tag => <Tag key={tag.title} {...tag} tagStyle={this.props.tagStyle} />)}</Footer>}
          </span>
        )
      }
    }
  
    render() {
      const {id, cardStyle, editable, hideCardDeleteIcon, customCardLayout, ...otherProps} = this.props
      const style = customCardLayout ? {...cardStyle, padding: 0} : cardStyle
      return (
        <MovableCardWrapper
          key={id}
          data-id={id}
          style={{
            ...style
          }}
          {...otherProps}>
          {this.renderBody()}
        </MovableCardWrapper>
      )
    }
  };
  
  export default CustomCard;