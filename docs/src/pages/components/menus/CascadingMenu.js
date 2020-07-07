import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import useTheme from '@material-ui/styles/useTheme';

export default function CascadingMenu() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const swapDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div>
      <Button aria-controls="cascading-menu" aria-haspopup="true" onClick={handleButtonClick}>
        Open Menu
      </Button>
      <Menu
        id="cascading-menu"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: theme.direction === 'rtl' ? 'left' : 'right' }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          subMenu={
            <Menu>
              <MenuItem onClick={swapDarkMode}>
                Dark Mode
                <Box ml={1}>
                  <Switch size="small" checked={darkMode} />
                </Box>
              </MenuItem>
              <MenuItem
                subMenu={
                  <Menu>
                    <MenuItem onClick={handleClose}>75%</MenuItem>
                    <MenuItem onClick={handleClose}>100%</MenuItem>
                    <MenuItem onClick={handleClose}>125%</MenuItem>
                  </Menu>
                }
              >
                Zoom
              </MenuItem>
              <MenuItem onClick={handleClose}>Help</MenuItem>
            </Menu>
          }
        >
          Options
        </MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
}