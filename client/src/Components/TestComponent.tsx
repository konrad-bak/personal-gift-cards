import React from 'react';
import { useDispatch } from 'react-redux';
import { clearUser, setUser } from '../redux/actions';
import { AppDispatch } from '../redux/store';
import api, { CardData, Credentials, UserData } from '../utils/api';

const TestComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleRegister = async () => {
    const userData: UserData = {
      username: 'Test',
      email: 'test@example.com',
      password: 'testtest123',
    };
    try {
      await api.registerUser(userData);
    } catch (error) {}
  };

  const handleLogin = async () => {
    const credentials: Credentials = {
      email: 'test@example.com',
      password: 'testtest123',
    };
    try {
      const loginResponse = await api.loginUser(credentials);
      if (loginResponse) {
        dispatch(
          setUser({
            userId: loginResponse.userId,
            token: loginResponse.token,
            username: loginResponse.username,
          })
        );
      }
    } catch (error) {}
  };

  const handleLogout = () => {
    api.logoutUser();
    dispatch(clearUser());
  };

  const handleDeleteUser = async () => {
    const userId = localStorage.getItem('userId') || '';
    try {
      await api.deleteUser(userId);
    } catch (error) {}
  };

  const handleCreateCard = async () => {
    const userId = localStorage.getItem('userId') || '';
    const cardData: CardData = {
      _id: undefined,
      title: 'Test Card',
      content: 'This is a test card.',
      owner: userId,
      recipients: [],
      imageUrl:
        'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZThzNGNtcnE1bTBxNDUwb3M4ems1dXJ5czNuMHk4ZzAzNmVjb3kycSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/a5viI92PAF89q/giphy.gif',
    };
    try {
      await api.createCard(cardData);
    } catch (error) {}
  };

  const handleGetUserCards = async () => {
    const userId = localStorage.getItem('userId') || '';
    try {
      await api.getUserCards(userId);
    } catch (error) {}
  };

  const handleSendCard = async () => {
    const userId = localStorage.getItem('userId') || '';
    try {
      const cards = await api.getUserCards(userId);
      if (cards && cards.length > 0) {
        await api.sendCard(cards[0]._id || '', userId);
      }
    } catch (error) {}
  };

  return (
    <div>
      <button onClick={handleRegister}>Register Test user</button>
      <button onClick={handleLogin}>Login Test user</button>
      <button onClick={handleLogout}>Logout! Test user</button>
      <button onClick={handleDeleteUser}>Delete Test user</button>
      <button onClick={handleCreateCard}>Create Card</button>
      <button onClick={handleGetUserCards}>Get User Cards</button>
      <button onClick={handleSendCard}>Send Card</button>
    </div>
  );
};

export default TestComponent;
