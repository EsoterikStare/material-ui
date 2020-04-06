import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function SimpleMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleButtonClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleItemClick = () => {
    setAnchorEl(null);
  };

  const deeper3 = [
    <MenuItem onClick={handleItemClick}>You did it!</MenuItem>,
    <MenuItem onClick={handleItemClick}>You did it!</MenuItem>,
    <MenuItem onClick={handleItemClick}>You did it!</MenuItem>
  ]
  
  const deeper2 = [
    <MenuItem onClick={handleItemClick}>Not this one</MenuItem>,
    <MenuItem onClick={handleItemClick}>Not this one</MenuItem>,
    <MenuItem onClick={handleItemClick}>Not this one</MenuItem>,
    <MenuItem nestedItems={deeper3}>Go deeper</MenuItem>,
    <MenuItem onClick={handleItemClick}>Not this one</MenuItem>,
    <MenuItem onClick={handleItemClick}>Not this one</MenuItem>
  ]
  
  const deeper1= [
    <MenuItem nestedItems={deeper2}>Go deeper</MenuItem>,
    <MenuItem onClick={handleItemClick}>Not this one</MenuItem>,
    <MenuItem onClick={handleItemClick}>Not this one</MenuItem>
  ]
  
  const autoSaveItems = [
    <MenuItem onClick={handleItemClick}>On Exit</MenuItem>,
    <MenuItem onClick={handleItemClick}>On Change</MenuItem>,
  ];

  const settingItems = [
    <MenuItem onClick={handleItemClick}>Dark Mode</MenuItem>,
    <MenuItem onClick={handleItemClick}>Verbos Logging</MenuItem>,
    <MenuItem nestedItems={autoSaveItems}>Auto-save</MenuItem>,
    <MenuItem nestedItems={deeper1}>Go deeper</MenuItem>
  ];

  const myAccountItems = [
    <MenuItem onClick={handleItemClick}>Reset password</MenuItem>,
    <MenuItem onClick={handleItemClick}>Change username</MenuItem>,
  ];

  const mainMenuItems = [
    <MenuItem nestedItems={settingItems}>Settings</MenuItem>,
    <MenuItem nestedItems={myAccountItems}>My account</MenuItem>,
    <MenuItem onClick={handleItemClick}>Logout</MenuItem>
  ];

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleButtonClick}>
        Open Menu
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleItemClick}
        // variant="selectedMenu"
      >
        {mainMenuItems}
      </Menu>
    </div>
  );
}
