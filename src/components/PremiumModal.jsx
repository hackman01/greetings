import React from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  Button,
  IconButton,
  Fade,
  Backdrop
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CrownIcon from '@mui/icons-material/EmojiEvents';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 },
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
  textAlign: 'center'
};

export const PremiumModal = ({ isOpen, onClose }) => (
  <Modal
    open={isOpen}
    onClose={onClose}
    closeAfterTransition
    slots={{ backdrop: Backdrop }}
    slotProps={{ backdrop: { timeout: 500 } }}
  >
    <Fade in={isOpen}>
      <Box sx={modalStyle}>
        <IconButton 
          onClick={onClose} 
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        
        <CrownIcon sx={{ fontSize: 60, color: '#f59e0b', mb: 2 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Unlock Premium Designs
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Get unlimited access to HD backgrounds, exclusive stickers, and remove all watermarks.
        </Typography>
        
        <Button 
          fullWidth 
          variant="contained" 
          size="large"
          sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#d97706' }, borderRadius: 2, fontWeight: 'bold' }}
        >
          Subscribe Now
        </Button>
      </Box>
    </Fade>
  </Modal>
);