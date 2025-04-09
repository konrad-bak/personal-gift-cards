import {
  Box,
  Container,
  Skeleton,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Modal,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import api, { CardData } from '../../utils/api';
import CreateCardModal from './components/CreateCardModal';

const cardStyle = {
  display: 'flex',
  maxWidth: '602px',
  width: '100%',
  aspectRatio: '2.5 / 1', // 2.5 width to 1 height
  margin: '10px',
};

const cardMediaStyle = {
  width: 'auto',
  height: '100%',
  aspectRatio: '1 / 1', // 1:1 aspect ratio for square
  objectFit: 'contain', // Ensure the image covers the square
  objectPosition: 'center', // Center the image
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#393233',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const UserCards = () => {
  const [cards, setCards] = useState<CardData[] | null>([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [cardsError, setCardsError] = useState<Error | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<CardData | null>(null);
  const user = useSelector((state: RootState) => state.user);


  const handleRefreshCards = async () => {
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

  useEffect(() => {
    handleRefreshCards();
  }, [user]);

  const handleDeleteCard = async (cardId: string) => {
    if(!user.userId) return;
    try {
      await api.deleteCard(cardId, user.userId);
      handleRefreshCards();
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const handleSendCard = async (cardId: string) => {
    if(!user.userId) return;
    try {
      await api.sendCard(cardId, user.userId);
      handleRefreshCards();
    } catch (error) {
      console.error('Error sending card:', error);
    }
  };

  const handleEditCardModalOpen = (card: CardData) => {
    setCardToEdit(card);
    setOpenEditModal(true);
  };

  const handleEditCardModalClose = () => {
    setOpenEditModal(false);
    setCardToEdit(null);
  };

  return (
    <>
      {!cardsLoading ? (
        <Container>
          <Box>Welcome {user.username}!</Box>
          <Box>Cards</Box>
          <Box>
            {!cardsError ? (
              cards?.map((card) => (
                <Card sx={cardStyle} key={card._id}>
                  <CardMedia
                    component="img"
                    sx={cardMediaStyle}
                    image={card.imageUrl}
                    alt="Card image"
                  />
                  <CardContent>
                    <Box>{card.title}</Box>
                    <Typography>{card.content}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button onClick={() => handleSendCard(card._id || '')}>
                      Send
                    </Button>
                    <Button onClick={() => handleDeleteCard(card._id || '')}>
                      Delete
                    </Button>
                    <Button onClick={() => handleEditCardModalOpen(card)}>
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <div>{cardsError.message}</div>
            )}
          </Box>
          <CreateCardModal handleRefreshCards={handleRefreshCards} />
          {cardToEdit && (
            <EditCardModal
              open={openEditModal}
              handleClose={handleEditCardModalClose}
              card={cardToEdit}
              handleRefreshCards={handleRefreshCards}
            />
          )}
        </Container>
      ) : (
        <Skeleton />
      )}
    </>
  );
};

interface EditCardModalProps {
  open: boolean;
  handleClose: () => void;
  card: CardData;
  handleRefreshCards: () => void;
}

const EditCardModal = ({
  open,
  handleClose,
  card,
  handleRefreshCards,
}: EditCardModalProps) => {
  const [cardTitle, setCardTitle] = useState(card.title);
  const [cardDescription, setCardDescription] = useState(card.content);
  const [cardError, setCardError] = useState<Error | null>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCardTitle(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCardDescription(event.target.value);
  };

  const handleEditCard = async () => {
    if (!cardTitle || !cardDescription) {
      setCardError(new Error('Title and description are required.'));
      return;
    }
    setCardError(null);

    const cardData: CardData = {
      _id: card._id,
      title: cardTitle,
      content: cardDescription,
      owner: card.owner,
      recipients: card.recipients,
      imageUrl: card.imageUrl,
    };

    try {
      await api.editCard(cardData);
      handleRefreshCards();
      handleClose();
    } catch (error) {
      setCardError(error as Error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Edit Card
        </Typography>
        {cardError && <Typography color="error">{cardError.message}</Typography>}
        <TextField
          label="Card Title"
          variant="outlined"
          fullWidth
          value={cardTitle}
          onChange={handleTitleChange}
          margin="normal"
        />
        <TextField
          label="Card Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={cardDescription}
          onChange={handleDescriptionChange}
          margin="normal"
        />
        <Button onClick={handleEditCard}>Edit</Button>
      </Box>
    </Modal>
  );
};

export default UserCards;
