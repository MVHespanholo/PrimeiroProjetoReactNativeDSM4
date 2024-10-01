import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

export default class User extends Component {
  render() {
    const { character } = this.props.route.params;
    return (
      <View>
        <Image source={{ uri: character.image }} />
        <Text>{character.name}</Text>
        <Text>Status: {character.status}</Text>
        <Text>Última localização conhecida: {character.location.name}</Text>
        <Text>Episódio que ele aparece pela primeira vez: {character.episode[0]}</Text>
      </View>
    );
  }
}