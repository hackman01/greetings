import React from 'react';
import { 
  Box, 
  Typography
} from '@mui/material';

export const TemplateCard = ({ item, onSelect }) => (
  <Box 
    onClick={() => onSelect(item)}
    sx={{ 
      position: 'relative', 
      borderRadius: 4, 
      overflow: 'hidden', 
      cursor: 'pointer',
      transition: '0.3s',
      '&:hover': { transform: 'scale(1.02)', boxShadow: 6 }
    }}
  >
    <img src={item.url} alt="bg" style={{ width: '100%', display: 'block', aspectRatio: '4/3', objectFit: 'cover' }} />

    <Box sx={{ 
      position: 'absolute', top: 12, right: 12, 
      bgcolor: item.isPremium ? '#f59e0b' : '#1e293b',
      color: 'white', px: 1.5, py: 0.5, borderRadius: 1, fontSize: 10, fontWeight: 800
    }}>
      {item.isPremium ? 'PREMIUM' : 'FREE'}
    </Box>

    <Box sx={{ 
      position: 'absolute', inset: 0, display: 'flex', 
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      // bgcolor: 'rgba(0,0,0,0.2)' 
    }}>
      {/* <Box 
        component="img" 
        src={userPhoto} 
        sx={{ width: 50, height: 50, borderRadius: '50%', border: '2px solid white', mb: 1 }} 
      />
      <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold', textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
        Happy {item.category}, {userName}!
      </Typography> */}
    </Box>
  </Box>
);