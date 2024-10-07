import React, {Component} from 'react';
import {Keyboard, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';

import api from '../services/api';

export default class Main extends Component {
  state = {
    searchQuery: '',
    characters: [],
    loading: false,
  };

  async componentDidMount() {
    const characters = await AsyncStorage.getItem('characters');
    if (characters) {
      this.setState({characters: JSON.parse(characters)});
    }
  }

  async componentDidUpdate(_, prevState) {
    const {characters} = this.state;

    if (prevState.characters !== characters) {
      await AsyncStorage.setItem('characters', JSON.stringify(characters));
    }
  }

  handleAddCharacter = async () => {
    try {
      const {characters, searchQuery} = this.state;
      this.setState({loading: true});

      let response;

      if (!isNaN(searchQuery)) {
        response = await api.get(`/character/${searchQuery}`);
      } else {
        response = await api.get(`/character/?name=${searchQuery}`);
      }

      const results = response.data.results || [response.data]; 

      const newCharacters = results.filter(character => !characters.find(c => c.id === character.id));

      if (newCharacters.length === 0) {
        alert('Personagem já adicionado ou não encontrado!');
        this.setState({loading: false});
        return;
      }

      const formattedCharacters = newCharacters.map(character => ({
        id: character.id,
        name: character.name,
        status: character.status,
        location: character.location?.name || ' desconhecida',
        episode: character.episode[0] || [],
        image: character.image,
        species: character.species,
        gender: character.gender,
        origin: character.origin?.name || 'desconhecida',
        type: character.type || 'desconhecido'
      }));
      

      this.setState({
        characters: [...characters, ...formattedCharacters],
        searchQuery: '',
        loading: false,
      });

      Keyboard.dismiss();
    } catch (error) {
      alert('Personagem não encontrado!');
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    const {characters, searchQuery, loading} = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar ID ou Nome do personagem"
            value={searchQuery}
            onChangeText={text => this.setState({searchQuery: text})}
            returnKeyType="send"
            onSubmitEditing={this.handleAddCharacter}
          />
          <SubmitButton loading={loading} onPress={this.handleAddCharacter}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="add" size={22} color="#fff" />
            )}
          </SubmitButton>
        </Form>
        <List
          showsVerticalScrollIndicator={false}
          data={characters}
          keyExtractor={character => character.id.toString()}
          renderItem={({item}) => (
            <User>
              <Avatar source={{uri: item.image}} />
              <Name>{item.name}</Name>
              <Bio>Status: {item.status}</Bio>
              <Bio>Última localização conhecida: {item.location}</Bio>
              <Bio>Visto pela primeira vez: ep {item.episode[0].split('/').pop()}</Bio>

              <ProfileButton onPress={() => {
                this.props.navigation.navigate('CharacterDetails', {character: item});
              }}>
                <ProfileButtonText>Ver Mais Detalhes</ProfileButtonText>
              </ProfileButton>
              <ProfileButton
                onPress={() => {
                  this.setState({
                    characters: this.state.characters.filter(
                      character => character.id !== item.id,
                    ),
                  })
                }} style={{backgroundColor: '#FFC0CB'}}>
                <ProfileButtonText>Excluir</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  }
}
