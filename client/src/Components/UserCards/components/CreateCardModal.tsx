import {
  Card,
  CardContent,
  CardMedia,
  TextField,
  Button,
  Box,
  Modal,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import api, { CardData } from '../../../utils/api';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: '100%',
  maxWidth: '700px',
  bgcolor: '#393233',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const cardStyle = {
  display: 'flex',
  maxWidth: '602px',
  width: '100%',
  aspectRatio: '2.5 / 1', // 2.5 width to 1 height
};

const cardMediaStyle = {
  width: 'auto',
  height: '100%',
  aspectRatio: '1 / 1', // 1:1 aspect ratio for square
  objectFit: 'cover', // Ensure the image covers the square
  objectPosition: 'center', // Center the image
};

export default function CreateCardModal() {
  const [open, setOpen] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [cardImg] = useState(
    'https://c.tenor.com/-gAHSA9JQn0AAAAM/small.gif'
  );
  const [cardError, setCardError] = useState<Error | null>(null);
  const user = useSelector((state: RootState) => state.user);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setCardTitle('');
    setCardDescription('');
    setCardError(null);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCardTitle(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCardDescription(event.target.value);
  };

  const handleCreateCard = async () => {
    if (!cardTitle || !cardDescription) {
      setCardError(new Error('Title and description are required.'));
      return;
    }
    setCardError(null);

    if (!user.userId) {
      setCardError(new Error('User ID is missing. Please log in.'));
      return;
    }

    const cardData: CardData = {
      title: cardTitle,
      content: cardDescription,
      owner: user.userId,
      recipients: [],
      imageUrl: cardImg,
    };

    try {
      await api.createCard(cardData);
      handleClose();
    } catch (error) {
      setCardError(error as Error);
    }
  };

  return (
    <div>
      <Button onClick={handleOpen}>Create Card</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Card
          </Typography>
          {cardError && (
            <Typography color="error">{cardError.message}</Typography>
          )}
          <Card sx={cardStyle}>
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
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
              </CardContent>
            </Box>
            <CardMedia
              component="img"
              sx={cardMediaStyle}
              image={cardImg}
              alt="Live from space album cover"
            />
          </Card>
          <Button onClick={handleCreateCard}>Create</Button>
        </Box>
      </Modal>
    </div>
  );
}
