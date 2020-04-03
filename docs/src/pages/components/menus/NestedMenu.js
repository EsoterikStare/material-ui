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
    <MenuItem debug onClick={handleItemClick}>You did it!</MenuItem>,
    <MenuItem debug onClick={handleItemClick}>You did it!</MenuItem>,
    <MenuItem debug onClick={handleItemClick}>You did it!</MenuItem>
  ]
  
  const deeper2 = [
    <MenuItem debug onClick={handleItemClick}>Not this one</MenuItem>,
    <MenuItem debug onClick={handleItemClick}>Not this one</MenuItem>,
    <MenuItem debug onClick={handleItemClick}>Not this one</MenuItem>,
    <MenuItem debug nestedItems={deeper3}>Go deeper</MenuItem>,
    <MenuItem debug onClick={handleItemClick}>Not this one</MenuItem>,
    <MenuItem debug onClick={handleItemClick}>Not this one</MenuItem>
  ]
  
  const deeper1= [
    <MenuItem debug nestedItems={deeper2}>Go deeper</MenuItem>,
    <MenuItem debug onClick={handleItemClick}>Not this one</MenuItem>,
    <MenuItem debug onClick={handleItemClick}>Not this one</MenuItem>
  ]
  
  const autoSaveItems = [
    <MenuItem debug onClick={handleItemClick}>On Exit</MenuItem>,
    <MenuItem debug onClick={handleItemClick}>On Change</MenuItem>,
  ];

  const settingItems = [
    <MenuItem debug onClick={handleItemClick}>Dark Mode</MenuItem>,
    <MenuItem debug onClick={handleItemClick}>Verbos Logging</MenuItem>,
    <MenuItem debug nestedItems={autoSaveItems}>Auto-save</MenuItem>,
    <MenuItem debug nestedItems={deeper1}>Go deeper</MenuItem>
  ];

  const myAccountItems = [
    <MenuItem debug onClick={handleItemClick}>Reset password</MenuItem>,
    <MenuItem debug onClick={handleItemClick}>Change username</MenuItem>,
  ];

  const mainMenuItems = [
    <MenuItem debug nestedItems={settingItems}>Settings</MenuItem>,
    <MenuItem debug nestedItems={myAccountItems}>My account</MenuItem>,
    <MenuItem debug onClick={handleItemClick}>Logout</MenuItem>
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
