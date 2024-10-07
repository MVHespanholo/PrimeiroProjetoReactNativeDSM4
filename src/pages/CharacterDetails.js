import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components/native';

const CharacterDetails = ({ route }) => {
  const { character } = route.params || {};

  if (!character) {
    console.log('Parâmetro character não foi passado');
    return <MessageText>Personagem não encontrado</MessageText>;
  }

  return (
    <Container>
      {character.image && (
        <CharacterImage source={{ uri: character.image }} />
      )}
      <CharacterName>{character.name}</CharacterName>
      <CharacterInfo>Status: {character.status || ' não disponível'}</CharacterInfo>
      <CharacterInfo>Espécie: {character.species || ' não disponível'}</CharacterInfo>
      <CharacterInfo>Tipo: {character.type || 'não disponível'}</CharacterInfo>
      <CharacterInfo>Gênero: {character.gender || 'não disponível'}</CharacterInfo>
      <CharacterInfo>Origem: {character.origin.name || 'não disponível'}</CharacterInfo>
      <CharacterInfo>Última localização conhecida: {character.location?.name || ' não disponível'}</CharacterInfo>
      <CharacterInfo>Visto pela primeira vez em: {character.episode[0].split('/').pop()}</CharacterInfo>
    </Container>
  );
};

// Styled Components
const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
`;

const CharacterImage = styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 75px;
  align-self: center;
  margin-bottom: 20px;
`;

const CharacterName = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
`;

const CharacterInfo = styled.Text`
  font-size: 16px;
  color: #666;
  margin-bottom: 5px;
`;

const MessageText = styled.Text`
  font-size: 18px;
  color: #ff0000;
  text-align: center;
  margin-top: 20px;
`;

export default CharacterDetails;
