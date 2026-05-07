import React, { useState, useRef } from 'react';
import { Container, Grid, Typography, Box, Avatar, IconButton, Menu, MenuItem, Tooltip, Button, Alert, Snackbar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { CategoryBar } from './components/CategoryTabs';
import { TemplateCard } from './components/TemplateCard';
import { PremiumModal } from './components/PremiumModal';
import { FreeModal } from './components/FreeModal';
import { useAuth } from './context/AuthContext';
import CrownIcon from '@mui/icons-material/EmojiEvents';
import { Upload } from '@mui/icons-material';
import UploadPhoto from './components/UploadPhoto';
import { templates, categories } from './data/templates';

const App = () => {
  const { user, logout, loading, uploadPhoto } = useAuth();
  const [activeTab, setActiveTab] = useState('BIRTHDAY');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showFreeModal, setShowFreeModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [avatarError, setAvatarError] = useState(false);
  const [avatarErrorOpen, setAvatarErrorOpen] = useState(false);
  const [avatarErrorMessage, setAvatarErrorMessage] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setUploadError('');
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;
    setUploading(true);
    setUploadError('');
    try {
      await uploadPhoto(photoFile);
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch {
      setUploadError('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };


 console.log('User:', user); // Debugging line to check user state
  const handleSelect = (item) => {
    if (item.isPremium) {
      setShowPremiumModal(true);
    } else {
      setSelectedTemplate(item);
      setShowFreeModal(true);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    handleCloseMenu();
    logout();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ bgcolor: 'primary.main', p: 0.5, borderRadius: 1 }}>
            <CrownIcon sx={{ color: 'white' }} />
          </Box>
          <Typography variant="h6" fontWeight="900" color="primary.dark">
            GREETIFY
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Hi, {user.name}
          </Typography>
          <Tooltip title="Account settings">
            <IconButton onClick={handleOpenMenu} size="small">
              <Avatar
                sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                src={user.photoUrl}
                imgProps={{ onError: (e) => { console.error('Avatar image failed to load:', e.target.src); setAvatarError(true); setAvatarErrorMessage('Failed to load profile image. Check console for details.'); setAvatarErrorOpen(true); } }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            slotProps={{ paper: { sx: { minWidth: 160 } } }}
          >
            <MenuItem onClick={handleLogout} sx={{ gap: 1 }}>
              <LogoutIcon fontSize="small" />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {!user.photoUrl && (
        <UploadPhoto
          photoPreview={photoPreview}
          handlePhotoChange={handlePhotoChange}
          handlePhotoUpload={handlePhotoUpload}
          uploading={uploading}
          uploadError={uploadError}
          fileInputRef={fileInputRef}
        />
      )}

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 'bold' }}>
        CATEGORIZED TEMPLATES
      </Typography>

      <CategoryBar
        categories={categories}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
        IMAGE LISTING
      </Typography>

      <Grid container spacing={3}>
        {templates
          .filter(t => t.category === activeTab)
          .map(template => (
            <Grid key={template.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <TemplateCard
                item={template}
                onSelect={handleSelect}
              />
            </Grid>
          ))}
      </Grid>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />

      <FreeModal
        isOpen={showFreeModal}
        onClose={() => {
          setShowFreeModal(false);
          setSelectedTemplate(null);
        }}
        templateUrl={selectedTemplate?.url}
        userName={user.name}
        userPhoto={user.photoUrl}
      />

      <Snackbar
        open={avatarErrorOpen}
        autoHideDuration={5000}
        onClose={() => { setAvatarErrorOpen(false); setAvatarError(false); }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => { setAvatarErrorOpen(false); setAvatarError(false); }} severity="error" variant="filled">
          {avatarErrorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
