import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Collapse, 
  IconButton,
  Divider
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  paperProps?: React.ComponentProps<typeof Paper>;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultExpanded = true,
  paperProps = {}
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        mb: 3,
        ...paperProps?.sx
      }}
      {...paperProps}
    >
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={toggleExpanded}
      >
        <Typography variant="h5" component="h2">{title}</Typography>
        <IconButton size="small">
          {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </Box>
      
      <Collapse in={expanded} timeout="auto">
        <Divider />
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      </Collapse>
    </Paper>
  );
}; 