import React from 'react';
import Button from './Button';

class Inventory extends React.Component {
  render() {
    return (
      <div className="Inventory UI">
        {
          this.props.inventory && (
            <div>
              <div className='flow-text'>Inventory</div>
              <div>
                {
                  this.props.inventory.map((slot, index) => {
                    return (
                      <Button key={index} onClick={() => null}>
                        {`${slot.itemType} | x ${slot.items.length}`}
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

export default Inventory;