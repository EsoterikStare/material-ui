import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function SimpleMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    // console.log('demo onClick')
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const autoSaveItems = [
    <MenuItem debug onClick={handleClose}>On Exit</MenuItem>,
    <MenuItem debug onClick={handleClose}>On Change</MenuItem>,
  ];

  const settingItems = [
    // <MenuItem debug onClick={handleClose}>Dark Mode</MenuItem>,
    // <MenuItem debug onClick={handleClose}>Verbos Logging</MenuItem>,
    <MenuItem debug nestedItems={autoSaveItems}>Auto-save</MenuItem>
  ];

  const myAccountItems = [
    <MenuItem debug onClick={handleClose}>Reset password</MenuItem>,
    <MenuItem debug onClick={handleClose}>Change username</MenuItem>,
  ];

  const mainMenuItems = [
    <MenuItem debug nestedItems={settingItems}>Settings</MenuItem>,
    // <MenuItem debug nestedItems={myAccountItems}>My account</MenuItem>,
    // <MenuItem debug onClick={handleClose}>Logout</MenuItem>
  ];

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Open Menu
      </Button>
      <Menu
        debug
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        // variant="selectedMenu"
      >
        {mainMenuItems}
      </Menu>
    </div>
  );
}
