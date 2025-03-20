import { Box, Button, Container, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import api from '../../utils/api';

const UserCards = () => {
  const [cards, setCards] = useState<any[] | null>([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [cardsError, setCardsError] = useState<Error | null>(null);

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchCards = async () => {
      if (user.userId) {
        setCardsLoading(true);
        try {
          const response = await api.getUserCards(user.userId);
          setCards(response);
        } catch (error) {
          setCardsError(error as Error);
        } finally {
          setCardsLoading(false);
        }
      }
    };

    fetchCards();
  }, [user]);

  return (
    <>
      {!cardsLoading ? (
        <Container>
          <Box>Welcome {user.username}!</Box>
          <Box>Cards</Box>
          <Box>
            {!cardsError ? (
              cards?.map((card) => {
                return card.title;
              })
            ) : (
              <div>{cardsError.message}</div>
            )}
          </Box>
          <Button>Create Card</Button>
        </Container>
      ) : (
        <Skeleton />
      )}
    </>
  );
};

export default UserCards;
