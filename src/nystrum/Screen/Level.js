import React from 'react';
import { SCREENS } from './constants';
import * as Engine from '../Engine/engine';
import * as Game from '../game';
import Instructions from '../UI/Instructions';
import Information from '../UI/Information';
import PlayerInformation from '../UI/Entity/PlayerInformation';
import Equipment from '../UI/Equipment';
import Inventory from '../UI/Inventory';
// import KeymapUI from '../UI/Keymap';
import KeymapUI from '../UI/ActionBar';
import Messages from '../UI/Messages';

class Level extends React.Component {
  constructor(props) {
    super(props);
    let ENGINE = new Engine.Engine({});
    let game = new Game.Game({ 
      engine: ENGINE, 
      getSelectedCharacter: () => this.props.selectedCharacter.initialize(ENGINE),
      mode: this.props.selectedMode.class,
    })
    this.state = {
      game: game,
      activeTab: 0,
      spriteMode: game.spriteMode,
    };
    this.presserRef = React.createRef();
  }

  async componentDidMount() {
    this.state.game.initialize(this.presserRef, document)
    this.state.game['backToTitle'] = () => this.props.setActiveScreen(SCREENS.TITLE);
    this.state.game['toLose'] = () => this.props.setActiveScreen(SCREENS.LOSE);
    this.state.game['toWin'] = () => this.props.setActiveScreen(SCREENS.WIN);
    this.state.game['refocus'] = () => this.refocus();
    this.state.game.updateReact = (newGameState) => { this.setState({game: newGameState}) }
    this.state.game.engine.start()
  }

  refocus () {
    if (this.presserRef) this.presserRef.current.focus();
  }

  toggleSpriteMode () {
    this.state.game.spriteMode = !this.state.game.spriteMode;
    this.state.game.draw();
    this.refocus();
    this.setState({ spriteMode: this.state.game.spriteMode})
  }

  render() {
    return (
      <div className="Level">
        <div className='row'>
          <div className='col s12'>
            <div className='game_display_container'>
              {Game.DisplayElement(this.presserRef, Game.handleKeyPress, this.state.game.engine)}
            </div>
            <PlayerInformation game={this.state.game} />
            <Information game={this.state.game} />
            <Instructions game={this.state.game} spriteMode={this.state.game.spriteMode} setActiveScreen={this.props.setActiveScreen} toggleSpriteMode={this.toggleSpriteMode.bind(this)} />
            {/* <Messages messages={this.state.game.messages.slice(-5).reverse()} /> */}
          </div>
          {/* <div className='col s2'> */}
          {/* </div> */}
          {/* <button className='btn' onClick={() => this.props.setActiveScreen(SCREENS.TITLE)}>Quit</button> */}
        </div>
      </div>
    );
  }
}

export default Level;
