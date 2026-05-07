import React from 'react';
import { 
  Box, 
  Tabs, 
  Tab
} from '@mui/material';

export const CategoryBar = ({ categories, activeTab, setActiveTab }) => (
  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
    <Tabs 
      value={activeTab} 
      onChange={(e, newValue) => setActiveTab(newValue)}
      variant="scrollable"
      scrollButtons="auto"
      textColor="primary"
      indicatorColor="primary"
    >
      {categories.map((cat) => (
        <Tab key={cat} label={cat} value={cat} sx={{ fontWeight: 'bold' }} />
      ))}
    </Tabs>
  </Box>
);