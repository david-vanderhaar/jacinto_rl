import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { SCREENS } from './Screen/constants';
import Screens from './Screen/index';
import Characters from './Characters/index';
import Modes from './Modes/index';
import SOUNDS from './sounds';

class Nystrum extends React.Component {
  constructor() {
    super();
    let characterKey = Characters();
    let characters = Object.keys(characterKey).map((key, i) => {
      return {
        initialize: characterKey[key],
        selected: false,
        name: key,
      }
    });

    let modes = Object.keys(Modes).map((key, i) => {
      return {
        class: Modes[key],
        selected: false,
        name: key,
      }
    });

    this.state = {
      activeScreen: SCREENS.TITLE,
      characters,
      modes,
      selectedCharacter: null,
      selectedMode: null,
    };
  }

  setActiveScreen (activeScreen) {
    if (activeScreen === SCREENS.TITLE) {
      Object.keys(SOUNDS).forEach(key => {
        SOUNDS[key].stop();
      });
    }
    this.setState({activeScreen})
  }

  setSelectedCharacter (character) {
    this.setState({selectedCharacter: {...character}})
  }

  setSelectedMode (mode) {
    this.setState({selectedMode: mode})
  }

  getActiveScreen () {
    const characterScreen = <Screens.CharacterSelect 
      key={SCREENS.CHARACTER_SELECT} 
      setActiveScreen={this.setActiveScreen.bind(this)}
      setSelectedCharacter={this.setSelectedCharacter.bind(this)}
      selectedCharacter={this.state.selectedCharacter}
      characters={this.state.characters}
    />
    const modeScreen = <Screens.ModeSelect 
      key={SCREENS.MODE_SELECT} 
      setActiveScreen={this.setActiveScreen.bind(this)}
      setSelectedMode={this.setSelectedMode.bind(this)}
      selectedMode={this.state.selectedMode}
      modes={this.state.modes}
    />
    const titleScreen = <Screens.Title 
      key={SCREENS.TITLE} 
      setActiveScreen={this.setActiveScreen.bind(this)}
      setSelectedCharacter={this.setSelectedCharacter.bind(this)}
      selectedCharacter={this.state.selectedCharacter}
      characters={this.state.characters}
    />
    const loseScreen = <Screens.Lose 
      key={SCREENS.LOSE} 
      setActiveScreen={this.setActiveScreen.bind(this)}
      setSelectedCharacter={this.setSelectedCharacter.bind(this)}
      selectedCharacter={this.state.selectedCharacter}
      characters={this.state.characters}
    />
    const winScreen = <Screens.Win 
      key={SCREENS.WIN} 
      setActiveScreen={this.setActiveScreen.bind(this)}
      setSelectedCharacter={this.setSelectedCharacter.bind(this)}
      selectedCharacter={this.state.selectedCharacter}
      characters={this.state.characters}
    />
    const levelScreen = <Screens.Level 
      key={SCREENS.LEVEL} 
      setActiveScreen={this.setActiveScreen.bind(this)}
      selectedCharacter={this.state.selectedCharacter}
      selectedMode={this.state.selectedMode}
    />

    switch (this.state.activeScreen) {
      case SCREENS.CHARACTER_SELECT:
        return characterScreen
      case SCREENS.MODE_SELECT:
        return modeScreen
      case SCREENS.TITLE:
        return titleScreen
      case SCREENS.LOSE:
        return loseScreen
      case SCREENS.WIN:
        return winScreen
      case SCREENS.LEVEL:
        return levelScreen
      default:
        return titleScreen
    }
  }

  render() {
    const activeScreen = this.getActiveScreen();
    return (
      <div className="Nystrum">
        <ReactCSSTransitionGroup
          transitionName="fade"
          transitionAppear={true}
          transitionEnter={true}
          transitionLeave={true}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          { activeScreen }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default Nystrum;
