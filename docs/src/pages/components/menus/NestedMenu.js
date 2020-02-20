import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function SimpleMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    console.log('demo onClick')
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const autoSaveItems = [
    <MenuItem onClick={handleClose}>On Exit</MenuItem>,
    <MenuItem onClick={handleClose}>On Change</MenuItem>,
  ];

  const settingItems = [
    <MenuItem onClick={handleClose}>Dark Mode</MenuItem>,
    <MenuItem onClick={handleClose}>Verbos Logging</MenuItem>,
    <MenuItem nestedItems={autoSaveItems}>Auto-save</MenuItem>
  ];

  const myAccountItems = [
    <MenuItem onClick={handleClose}>Reset password</MenuItem>,
    <MenuItem onClick={handleClose}>Change username</MenuItem>,
  ]

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Open Menu
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        // variant="selectedMenu"
      >
        <MenuItem nestedItems={settingItems}>Settings</MenuItem>
        <MenuItem nestedItems={myAccountItems}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
