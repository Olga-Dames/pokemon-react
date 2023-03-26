import { Component } from 'react';
import PokemonDataView from './PokemonDataView';
import PokemonErrorView from './PokemonErrorView';
import PokemonPendingView from './PokemonPendingView';
import pokemonAPI from '../services/pokemon-api';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export default class PokemonInfo extends Component {
  state = {
    pokemon: null,
    error: null,
    status: Status.IDLE,
  };

  componentDidUpdate(prevProps, _) {
    const prevName = prevProps.pokemonName;
    const nextName = this.props.pokemonName;

    if (prevName !== nextName) {
      // this.setState({ loading: true, pokemon: null });
      this.setState({ status: Status.PENDING });

      setTimeout(() => {
        pokemonAPI
          .fetchPokemon(nextName)
          //     .then(pokemon => this.setState({ pokemon }))
          //     .catch(error => this.setState({ error }))
          .then(pokemon => this.setState({ pokemon, status: Status.RESOLVED }))
          .catch(error => this.setState({ error, status: Status.REJECTED }));
      }, 3000);
    }
  }

  render() {
    const { pokemon, error, status } = this.state;
    const { pokemonName } = this.props;
    // <div>
    //   {error && <h1>{error.message}</h1>}
    //   <h1>Pokemon info</h1>
    //   {loading && <div>loading...</div>}
    //   {!pokemonName && <div>Enter pokemon name</div>}
    //   {pokemon && (
    //     <div>
    //       <p>{pokemon.name}</p>
    //       <img
    //         src={pokemon.sprites.front_default}
    //         alt={pokemon.name}
    //         width="200"
    //       />
    //     </div>
    //   )}
    // </div>

    if (status === 'idle') {
      return <div>Введите имя покемона.</div>;
    }

    if (status === 'pending') {
      return <PokemonPendingView pokemonName={pokemonName} />;
    }

    if (status === 'rejected') {
      return <PokemonErrorView message={error.message} />;
    }

    if (status === 'resolved') {
      return <PokemonDataView pokemon={pokemon} />;
    }
  }
}
