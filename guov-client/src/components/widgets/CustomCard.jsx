import React from 'react';
import {CardHeader, CardRightContent, CardTitle, Detail, Footer, MovableCardWrapper} from '../../styles/Base'
import Tag from '../Tag'

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
        const {title, description, label, tags} = this.props
        return (
          <span>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardRightContent>{label}</CardRightContent>
            </CardHeader>
            <Detail>{description}</Detail>
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