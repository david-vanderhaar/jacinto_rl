import React from 'react';
import Button from './Button';

class Equipment extends React.Component {
  render() {
    return (
      <div className="Equipment UI">
        {
          this.props.equipment && (
            <div>
              <div className='flow-text'>Equipment</div>
              <div>
                {
                  this.props.equipment.map((slot, index) => {
                    return (
                      <Button key={index} onClick={() => null}>
                        {slot.name} {slot.item ? slot.item.renderer.character : ''}
                      </Button>
                    )
                  })
                }
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

export default Equipment;