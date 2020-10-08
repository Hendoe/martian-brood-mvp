import React, { Component } from 'react';
import config from '../../config';
import Alien from '../Alien/Alien';
import './AlienSpawner.css';

class AlienSpawner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alienCost: 0,
      aliensToSpawn: 0,
      spawnPlan: {
        alien_name: 'Warrior Drone',
        totalToSpawn: 0,
        biomass_cost: 0,
        synapse_required: 0
      },
    };
  };

  addToSpawn() {
    let spawning = this.state.aliensToSpawn
    spawning += 1;
    this.setState({aliensToSpawn: spawning});
    this.updateAlienCost(spawning);
  };

  subtractToSpawn() {
    let spawning = this.state.aliensToSpawn;
    if (spawning === 0) {
      alert('You cannot spawn less than 0 aliens')
    } else {
        spawning -= 1;
    };
    this.setState({aliensToSpawn: spawning});
    this.updateAlienCost(spawning);
  };
  
  updateAlienCost(spawning) {
    let newCost = (5 * spawning);
    this.setState({alienCost: newCost})
  };

  setSpawnPlan() {
    const biomass_cost = this.state.alienCost;
    const toSpawn = this.state.toSpawn;
    let newPlan = this.state.spawnPlan;
    newPlan.totalToSpawn = toSpawn;
    newPlan.biomass_cost = biomass_cost;
    this.setState({spawnPlan: newPlan});
    this.postPlans(newPlan);
  };
  

  postPlans(plans) {
      return fetch(`${config.API_ENDPOINT}/spawnPlan`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          alien_name: plans.alien_name,
          total_to_spawn: plans.totalToSpawn,
          biomass_cost: plans.biomass_cost
        }),
      })
        .then(res =>
          (!res.ok)
            ? res.json().then(e => Promise.reject(e))
            : res.json()
        )
  };


  // componentWillUnmount() {
  //   this.setState({alienCost: 0});
  //   this.setState({aliensToSpawn: 0});
  // };

  render() {
    const { aliens } = this.props
    const { aliensToSpawn, alienCost } = this.state 
    console.log(this.props)

    return (
      <div className='builder-box'>
        <h2>Alien Spawner</h2>
        <hr />
          {aliens.filter(spawnableAlien => spawnableAlien.spawnable === true)
            .filter(spawningAlien => spawningAlien.spawning === true)
              .map(alien => (
                <Alien 
                  id={alien.id}
                  name={alien.alien_name}
                  hp={alien.hp}
                  atk={alien.atk}
                  cost={alien.biomass_cost}
                  synapse={alien.synapse_required}
                  desc={alien.description}
                  features={alien.special_features}
                />
              ))
          }
          <span className='row center'>
            <p className='red'>COST: {alienCost}</p>
            <p className='red'>SPAWNING: {aliensToSpawn}</p>
          </span>
          <div className='buttons'>
            <button className='arrow-button' onClick={() => this.props.handleMoveLeft()} disabled>LEFT</button>
            <button className='builder-button' onClick={() => this.setSpawnPlan()}>SPAWN</button>
            <button className='builder-button' onClick={() => this.addToSpawn()}>+</button>
            <button className='builder-button' onClick={() => this.subtractToSpawn()}>-</button>
            <button className='builder-button' onClick={() => this.props.handleClickCancel()}>CANCEL</button>
            <button className='arrow-button' onClick={() => this.props.handleMoveRight()} disabled>RIGHT</button>
          </div>
        </div>
    );
  };
};

export default AlienSpawner;