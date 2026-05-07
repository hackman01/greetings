import React from 'react';
import { Box, Typography, Avatar, Button, Alert } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';


export default function UploadPhoto({ photoPreview, handlePhotoChange, handlePhotoUpload, uploading, uploadError, fileInputRef }) {
    return (
            <Box
              sx={{
                mb: 4, p: 3, borderRadius: 3, textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea22 0%, #764ba222 100%)',
                border: '1px dashed',
                borderColor: 'primary.light',
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Add Your Photo
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload a photo to see a live preview on your greeting cards!
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Avatar
                  sx={{ width: 72, height: 72, cursor: 'pointer', bgcolor: 'primary.main' }}
                  src={photoPreview || undefined}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {!photoPreview && <AddAPhotoIcon sx={{ fontSize: 32 }} />}
                </Avatar>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handlePhotoChange}
                />
                {photoPreview && (
                  <Button
                    variant="contained"
                    onClick={handlePhotoUpload}
                    disabled={uploading}
                    sx={{ borderRadius: 2, fontWeight: 'bold' }}
                  >
                    {uploading ? 'Uploading...' : 'Set as my photo'}
                  </Button>
                )}
              </Box>
              {uploadError && (
                <Alert severity="error" sx={{ mt: 2 }}>{uploadError}</Alert>
              )}
            </Box>
)}