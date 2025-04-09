import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import api, { CardData } from '../../../utils/api';
import GifSelectorModal from './GifSelectorModal'; // Import the new component

// --- Styles ---
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '700px',
  width: '90%', // Make responsive
  bgcolor: '#393233',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const cardStyle = {
  display: 'flex',
  maxWidth: '602px',
  width: '100%',
  aspectRatio: '2.5 / 1',
  marginBottom: 2,
  bgcolor: '#4a4243', // Add background to card area
};

const cardMediaStyle = {
  width: '40%', // Adjust width allocation
  height: '100%',
  aspectRatio: '1 / 1',
  objectFit: 'contain',
  objectPosition: 'center',
  cursor: 'pointer',
  backgroundColor: '#555',
  borderLeft: '1px solid #444',
};

const cardContentStyle = {
  flex: '1', // Take remaining space
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: '16px !important', // Override default padding
  justifyContent: 'space-between', // Push fields apart if needed
};

// --- Constants ---
const STRINGS = {
  CARD_TITLE_LABEL: 'Card Title',
  CARD_DESCRIPTION_LABEL: 'Card Description',
  CREATE_CARD_BUTTON: 'Create Card',
  CREATE_CARD_MODAL_TITLE: 'Create Card',
  GIF_ALT_TEXT: 'Chosen gif for card',
  TITLE_AND_DESCRIPTION_REQUIRED: 'Title and description are required.',
  USER_ID_MISSING: 'User ID is missing. Please log in.',
  CREATE_BUTTON_TEXT: 'Create',
  DEFAULT_GIF:
    'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNW00YmZpZzZocXN6NnZtaTJpNzhmeHQxd3NxY2w0eDFtN2V5c3RzZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7abKhOpu0NwenH3O/giphy.gif',
};

// --- Props Interface ---
interface CreateCardModalProps {
  handleRefreshCards: () => void;
}

// --- Component ---
export default function CreateCardModal({
  handleRefreshCards,
}: CreateCardModalProps) {
  const [open, setOpen] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [cardImg, setCardImg] = useState(STRINGS.DEFAULT_GIF);
  const [cardError, setCardError] = useState<string | null>(null);
  const [gifModalOpen, setGifModalOpen] = useState(false); // State to control GifSelectorModal
  const user = useSelector((state: RootState) => state.user);

  // --- Handlers ---
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // Reset form state on close
    setCardTitle('');
    setCardDescription('');
    setCardImg(STRINGS.DEFAULT_GIF); // Reset to default image
    setCardError(null);
    setGifModalOpen(false); // Ensure gif modal is closed too
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCardTitle(event.target.value);
    if (cardError === STRINGS.TITLE_AND_DESCRIPTION_REQUIRED) {
      setCardError(null);
    }
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCardDescription(event.target.value);
    if (cardError === STRINGS.TITLE_AND_DESCRIPTION_REQUIRED) {
      setCardError(null);
    }
  };

  const handleCreateCard = async () => {
    setCardError(null);
    if (!cardTitle.trim() || !cardDescription.trim()) {
      // Use trim() for validation
      setCardError(STRINGS.TITLE_AND_DESCRIPTION_REQUIRED);
      return;
    }

    if (!user.userId) {
      setCardError(STRINGS.USER_ID_MISSING);
      return;
    }

    const cardData: CardData = {
      _id: undefined,
      title: cardTitle,
      content: cardDescription,
      owner: user.userId,
      recipients: [],
      imageUrl: cardImg,
    };

    try {
      await api.createCard(cardData);
      handleRefreshCards();
      handleClose(); // Close modal on success
    } catch (error) {
      console.error('Error creating card:', error);
      setCardError(
        error instanceof Error ? error.message : 'Failed to create card.'
      );
    }
  };

  // --- Gif Modal Handlers ---
  const handleGifModalOpen = () => setGifModalOpen(true);
  const handleGifModalClose = () => setGifModalOpen(false);

  const handleGifSelected = (gifUrl: string) => {
    setCardImg(gifUrl);
    handleGifModalClose(); // Close the gif modal after selection
  };

  // --- Render ---
  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        {STRINGS.CREATE_CARD_BUTTON}
      </Button>

      {/* Create Card Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-card-modal-title"
        aria-describedby="create-card-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="create-card-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2, color: 'white' }} // Ensure text is visible
          >
            {STRINGS.CREATE_CARD_MODAL_TITLE}
          </Typography>
          {cardError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {cardError}
            </Typography>
          )}
          <Card sx={cardStyle}>
            <Box sx={cardContentStyle}>
              <CardContent sx={{ padding: '8px 16px' }}>
                {' '}
                {/* Adjust padding */}
                <TextField
                  label={STRINGS.CARD_TITLE_LABEL}
                  variant="filled" // Use filled for better contrast on dark bg
                  fullWidth
                  value={cardTitle}
                  onChange={handleTitleChange}
                  margin="dense"
                  required
                  size="small" // Make fields smaller
                  InputLabelProps={{ style: { color: '#ccc' } }}
                  inputProps={{ style: { color: 'white' } }}
                  sx={{ backgroundColor: '#665c5d', borderRadius: 1, mb: 1 }} // Style field
                />
                <TextField
                  label={STRINGS.CARD_DESCRIPTION_LABEL}
                  variant="filled" // Use filled
                  fullWidth
                  multiline
                  rows={4}
                  value={cardDescription}
                  onChange={handleDescriptionChange}
                  margin="dense"
                  required
                  size="small" // Make fields smaller
                  InputLabelProps={{ style: { color: '#ccc' } }}
                  inputProps={{ style: { color: 'white' } }}
                  sx={{ backgroundColor: '#665c5d', borderRadius: 1 }} // Style field
                />
              </CardContent>
            </Box>
            <CardMedia
              component="img"
              sx={cardMediaStyle}
              image={cardImg}
              alt={STRINGS.GIF_ALT_TEXT}
              onClick={handleGifModalOpen} // Open GIF modal on click
            />
          </Card>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateCard}
            sx={{ mt: 2 }} // Add margin top to button
          >
            {STRINGS.CREATE_BUTTON_TEXT}
          </Button>
        </Box>
      </Modal>

      {/* Select GIF Modal (Render the extracted component) */}
      <GifSelectorModal
        open={gifModalOpen}
        onClose={handleGifModalClose}
        onGifSelect={handleGifSelected}
      />
    </div>
  );
}
