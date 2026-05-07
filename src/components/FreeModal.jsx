import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Fade,
  Backdrop,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShareIcon from '@mui/icons-material/Share';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: '90%', md: 500 },
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 3,
};

export const FreeModal = ({ isOpen, onClose, templateUrl, userName, userPhoto }) => {
  const canvasRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);

  const generatePreview = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !templateUrl) return;

    setIsGenerating(true);
    const ctx = canvas.getContext('2d');

    const loadImage = (src) => new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });

    try {
      const bg = await loadImage(templateUrl);

      canvas.width = bg.naturalWidth;
      canvas.height = bg.naturalHeight;

      const userImg = await loadImage(userPhoto || 'https://api.dicebear.com/9.x/avataaars/png?seed=' + userName);

      const circleRadius = canvas.width * 0.05;
      const photoSize = circleRadius * 2;
      const padding = canvas.width * 0.02;
      const photoCenterX = canvas.width - padding - circleRadius;
      const photoCenterY = padding + circleRadius;

      const borderThickness = circleRadius * 0.08;

      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.beginPath();
      ctx.arc(photoCenterX, photoCenterY, circleRadius + borderThickness, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(photoCenterX, photoCenterY, circleRadius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(userImg, photoCenterX - circleRadius, photoCenterY - circleRadius, photoSize, photoSize);
      ctx.restore();

      const fontSize = Math.max(20, canvas.width * 0.045);
      ctx.fillStyle = "white";
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textAlign = "left";
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 8;
      ctx.textBaseline = "middle";
      ctx.fillText(userName, padding * 2, photoCenterY);

      setPreviewUrl(canvas.toDataURL('image/png'));
    } catch (error) {
      console.error("Failed to generate preview:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [templateUrl, userName, userPhoto]);

  useEffect(() => {
    if (!isOpen) return;
    setPreviewUrl(null);
    setIsGenerating(true);

    const timer = setTimeout(() => {
      generatePreview();
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen, generatePreview]);

  const handleShare = async () => {
    if (!previewUrl) return;

    try {
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      const file = new File([blob], "greeting.png", { type: "image/png" });

      console.log("Attempting to share:", navigator.share, navigator.canShare);
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: "My Personalized Greeting",
          text: "Check out this card I made!"
        });
        return;
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Share failed:", error);
      }
      return;
    }

    const link = document.createElement('a');
    link.download = 'greeting.png';
    link.href = previewUrl;
    link.click();
  };

  return (
    <>
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
              sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h6" fontWeight="bold" gutterBottom align="center">
              Your Greeting Card
            </Typography>

            <Box sx={{ position: 'relative', width: '100%', borderRadius: 2, overflow: 'hidden', bgcolor: '#f5f5f5' }}>
              {isGenerating ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                  <CircularProgress />
                </Box>
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Greeting Preview"
                  style={{ width: '100%', display: 'block', cursor: 'pointer' }}
                  onClick={() => window.open(previewUrl, '_blank')}
                />
              ) : null}
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<ShareIcon />}
              onClick={handleShare}
              disabled={isGenerating || !previewUrl}
              sx={{
                mt: 2,
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' },
                borderRadius: 2,
                fontWeight: 'bold',
                py: 1.5
              }}
            >
              Share
            </Button>
          </Box>
        </Fade>
      </Modal>

      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    </>
  );
};
