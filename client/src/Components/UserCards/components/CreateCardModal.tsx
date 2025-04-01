import {
  Card,
  CardContent,
  CardMedia,
  TextField,
  Button,
  Box,
  Modal,
  Typography,
  ImageList,
  ImageListItem,
  Input,
  CircularProgress,
} from '@mui/material';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import api, { CardData } from '../../../utils/api';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
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
  objectFit: 'contain', // Ensure the image is contained in the square
  objectPosition: 'center', // Center the image
  cursor: 'pointer',
};

const giphyApiKey = import.meta.env.VITE_GIPHY_API_KEY;
const GIPHY_LIMIT = 25;

if (!giphyApiKey) {
  console.error('GIPHY API key is not defined in .env file');
}

interface GiphyGif {
  id: string;
  url: string;
  images: {
    fixed_height_downsampled: {
      url: string;
    };
  };
}

interface CreateCardModalProps {
  handleRefreshCards: () => void;
}

export default function CreateCardModal({
  handleRefreshCards,
}: CreateCardModalProps) {
  const [open, setOpen] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [cardImg, setCardImg] = useState(
    'https://c.tenor.com/-gAHSA9JQn0AAAAM/small.gif'
  );
  const [cardError, setCardError] = useState<Error | null>(null);
  const user = useSelector((state: RootState) => state.user);
  const [gifs, setGifs] = useState<GiphyGif[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [gifModalOpen, setGifModalOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const imageListRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setCardTitle('');
    setCardDescription('');
    setCardError(null);
    setGifs([]);
    setSearchQuery('');
    setOffset(0);
    setHasMore(true);
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
      handleClose();
    } catch (error) {
      setCardError(error as Error);
    }
  };

  const handleGifSelect = (gifUrl: string) => {
    setCardImg(gifUrl);
    setGifModalOpen(false);
  };

  const fetchGifs = async (query: string, currentOffset: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=%40mintostudio+${query}&limit=${GIPHY_LIMIT}&offset=${currentOffset}&rating=g`
      );
      const newGifs = response.data.data;
      setGifs((prevGifs) => [...prevGifs, ...newGifs]);
      setHasMore(newGifs.length === GIPHY_LIMIT);
    } catch (error) {
      console.error('Error fetching GIFs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery && gifModalOpen) {
      setGifs([]);
      setOffset(0);
      setHasMore(true);
    }
  }, [searchQuery, gifModalOpen]);

  useEffect(() => {
    if (searchQuery || gifModalOpen) {
      fetchGifs(searchQuery, offset);
    }
  }, [searchQuery, offset, gifModalOpen]);

  const handleGifModalOpen = () => {
    setGifModalOpen(true);
  };

  const handleGifModalClose = () => {
    setGifModalOpen(false);
  };

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore || !imageListRef.current) return;

    const { scrollTop, clientHeight, scrollHeight } = imageListRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setOffset((prevOffset) => prevOffset + GIPHY_LIMIT);
    }
  }, [isLoading, hasMore]);

  useEffect(() => {
    const imageList = imageListRef.current;
    if (imageList) {
      imageList.addEventListener('scroll', handleScroll);
      return () => imageList.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

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
              alt="Chosen gif for card"
              onClick={handleGifModalOpen}
            />
          </Card>
          <Button onClick={handleCreateCard}>Create</Button>
        </Box>
      </Modal>
      <Modal open={gifModalOpen} onClose={handleGifModalClose}>
        <Box sx={style}>
          <Input
            type="text"
            placeholder="Search for GIFs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div
            ref={imageListRef}
            style={{
              width: 500,
              height: 450,
              overflowY: 'auto',
              position: 'relative',
            }}
          >
            <ImageList cols={3} rowHeight={164}>
              {gifs.map((gif) => (
                <ImageListItem key={gif.id}>
                  <img
                    src={gif.images.fixed_height_downsampled.url}
                    alt={gif.id}
                    onClick={() =>
                      handleGifSelect(gif.images.fixed_height_downsampled.url)
                    }
                    style={{ cursor: 'pointer' }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
            {isLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                <CircularProgress />
              </Box>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
}
