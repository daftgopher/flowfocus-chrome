import React, {Component} from 'react';
import anime from 'animejs';

export default class Transition extends Component {

  componentWillEnter(callback){
    console.log('Component Enter Started');
    anime({
      targets: this.el,
      translateX: [500, 0],
      opacity: 1,
      duration: 2000,
      complete: () => {
        console.log('Component Enter Complete');
        callback();
      }
    });
  }

  componentWillLeave(callback){
    console.log('Component Leave Started');
    anime({
      targets: this.el,
      translateX: [0, -500],
      opacity: 0,
      duration: 2000,
      complete: () => {
        console.log('Component Leave Complete');
        callback();
      }
    });
  }

  render(){
    return (
      <div ref={ (el) => {this.el = el;} }>
        {this.props.children}
      </div>
    );
  }
}
