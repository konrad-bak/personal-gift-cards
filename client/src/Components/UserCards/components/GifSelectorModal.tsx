// src/Components/UserCards/components/GifSelectorModal.tsx
import {
  Box,
  CircularProgress,
  ImageList,
  ImageListItem,
  Input,
  Modal,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

// --- Constants ---
const giphyApiKey = import.meta.env.VITE_GIPHY_API_KEY; // Ensure .env is in project root
const GIPHY_LIMIT = 25;
const STRINGS = {
  FETCHING_GIFS_ERROR: 'Error fetching GIFs. Please try again.',
  SELECT_GIF_MODAL_TITLE: 'Select a GIF',
  GIF_SEARCH_PLACEHOLDER: 'Search for GIFs',
  END_OF_RESULTS: 'End of results.',
  NO_GIFS_FOUND: 'No GIFs found for your search.',
  LOADING_GIFS: 'Loading GIFs...',
  API_KEY_MISSING: 'Giphy API Key missing. Cannot fetch GIFs.',
};

// --- Styles ---
const gifModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '550px',
  width: '90%', // Make it responsive
  height: '600px',
  bgcolor: '#393233',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

// --- Types ---
interface GiphyGif {
  id: string;
  url: string;
  images: {
    fixed_height_downsampled: {
      url: string;
      width: string;
      height: string;
    };
    original: {
      url: string;
    };
  };
  title?: string;
}

interface GifSelectorModalProps {
  open: boolean;
  onClose: () => void;
  onGifSelect: (gifUrl: string) => void;
}

// --- Component ---
export default function GifSelectorModal({
  open,
  onClose,
  onGifSelect,
}: GifSelectorModalProps) {
  const [gifs, setGifs] = useState<GiphyGif[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [gifError, setGifError] = useState<string | null>(null);
  const imageListRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null); // Ref for focusing input

  // --- Giphy Fetching Logic ---
  const fetchGifs = useCallback(
    async (query: string, currentOffset: number, isNewSearch: boolean) => {
      if (!giphyApiKey) {
        setGifError(STRINGS.API_KEY_MISSING);
        setIsLoading(false); // Ensure loading stops
        setHasMore(false); // Prevent further loading attempts
        return;
      }
      setIsLoading(true);
      setGifError(null);

      try {
        const endpoint = `https://api.giphy.com/v1/gifs/search`;

        const params: Record<string, string | number> = {
          api_key: giphyApiKey,
          limit: GIPHY_LIMIT,
          offset: currentOffset,
          rating: 'g',
          q: `@mintostudio ${query}`,
        };

        const response = await axios.get<{ data: GiphyGif[] }>(endpoint, {
          params,
        }); // Add type safety
        const newGifs = response.data.data || []; // Ensure data is an array

        setGifs((prevGifs) =>
          isNewSearch ? newGifs : [...prevGifs, ...newGifs]
        );
        setHasMore(newGifs.length === GIPHY_LIMIT);
      } catch (error) {
        console.error('Error fetching GIFs:', error);
        setGifError(STRINGS.FETCHING_GIFS_ERROR);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [] // No external dependencies needed for the function definition itself
  );

  // Effect for initial load / search query change
  useEffect(() => {
    if (!open) {
      // Reset when modal closes if desired, or keep state cached
      // setSearchQuery(''); // Optional: clear search on close
      return;
    }

    // Reset state for new search/initial load
    setGifs([]);
    setOffset(0);
    setHasMore(true);
    fetchGifs(searchQuery, 0, true); // Fetch initial batch (offset 0), indicate it's a new search

    // Scroll to top
    if (imageListRef.current) {
      imageListRef.current.scrollTop = 0;
    }
    // Focus input when modal opens
    // Use timeout to ensure input is rendered and focusable
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100); // Small delay might be needed

    return () => clearTimeout(timer); // Cleanup timer
  }, [searchQuery, open, fetchGifs]); // Rerun when search or open state changes

  // Effect for infinite scrolling (loading more)
  useEffect(() => {
    if (!open || offset === 0 || isLoading || !hasMore) return; // Don't run on initial load or if already loading/no more data

    fetchGifs(searchQuery, offset, false); // Fetch next page, indicate it's NOT a new search
  }, [offset, open, searchQuery, fetchGifs, isLoading, hasMore]); // Dependencies that trigger loading more

  // --- Handlers ---
  const handleInternalGifSelect = (gif: GiphyGif) => {
    const selectedUrl =
      gif.images.original?.url || gif.images.fixed_height_downsampled.url;
    onGifSelect(selectedUrl);
    // onClose(); // Parent component will handle closing via onGifSelect if needed
  };

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore || !imageListRef.current) return;

    const { scrollTop, clientHeight, scrollHeight } = imageListRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      // Increased buffer
      // Prevent multiple triggers while loading
      if (!isLoading) {
        setOffset((prevOffset) => prevOffset + GIPHY_LIMIT);
      }
    }
  }, [isLoading, hasMore]);

  // Attach scroll listener
  useEffect(() => {
    const imageList = imageListRef.current;
    if (imageList && open) {
      // Only attach when modal is open
      imageList.addEventListener('scroll', handleScroll);
      return () => imageList.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, open]); // Re-attach if handleScroll changes or modal opens/closes

  // Debounce search input
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 500); // 500ms debounce
  };

  // --- Render ---
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="select-gif-modal-title"
    >
      <Box sx={gifModalStyle}>
        <Typography
          id="select-gif-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 1, color: 'white' }} // Ensure text is visible
        >
          {STRINGS.SELECT_GIF_MODAL_TITLE}
        </Typography>
        <Input
          inputRef={searchInputRef} // Assign ref
          type="text"
          placeholder={STRINGS.GIF_SEARCH_PLACEHOLDER}
          defaultValue={searchQuery} // Use defaultValue for debounced input
          onChange={handleSearchChange}
          fullWidth
          sx={{ mb: 2, color: 'white', borderBottom: '1px solid grey' }} // Style input
        />
        {gifError && (
          <Typography color="error" sx={{ mb: 1 }}>
            {gifError}
          </Typography>
        )}
        <Box
          ref={imageListRef}
          sx={{
            width: '100%',
            flexGrow: 1, // Allow box to take remaining height
            overflowY: 'auto',
            position: 'relative',
            border: '1px solid #555',
            bgcolor: '#4a4243',
            mb: 1, // Margin at the bottom before loader/messages
          }}
        >
          <ImageList variant="masonry" cols={3} gap={8}>
            {gifs.map((gif) => (
              <ImageListItem
                key={gif.id}
                sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                onClick={() => handleInternalGifSelect(gif)}
              >
                <img
                  src={`${gif.images.fixed_height_downsampled.url}?w=164&h=164&fit=crop&auto=format`}
                  srcSet={`${gif.images.fixed_height_downsampled.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  alt={gif.title || gif.id}
                  loading="lazy"
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
              </ImageListItem>
            ))}
          </ImageList>
          {/* Status Messages Area */}
          <Box sx={{ width: '100%', textAlign: 'center', p: 2 }}>
            {isLoading && <CircularProgress size={30} />}
            {!isLoading && !hasMore && gifs.length > 0 && (
              <Typography sx={{ color: 'grey.500' }}>
                {STRINGS.END_OF_RESULTS}
              </Typography>
            )}
            {!isLoading && gifs.length === 0 && !gifError && (
              <Typography sx={{ color: 'grey.500' }}>
                {searchQuery ? STRINGS.NO_GIFS_FOUND : STRINGS.LOADING_GIFS}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
