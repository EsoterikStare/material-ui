import React, { useState } from 'react';
import { string } from 'prop-types';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';

export default function SimpleMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const specialItemClick = (event) => {
    console.log(event.target);
    // window.alert(event.target.innerHtml)
  };

  const handleItemClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Item clicked!');
    setAnchorEl(null);
  };

  const renderMenuItem = ({ children, ...rest }, index) => (
    <MenuItem key={index.toString()} {...rest}>
      {children}
    </MenuItem>
  );

  renderMenuItem.propTypes = {
    children: string,
  };

  const deeper3 = (
    <Menu>
      <MenuItem onClick={handleItemClick}>You did it!</MenuItem>
      <MenuItem onClick={handleItemClick}>You did it!</MenuItem>
      <MenuItem onClick={specialItemClick}>This one is special!</MenuItem>
    </Menu>
  );

  const deeper2 = (
    <Menu>
      <MenuItem onClick={handleItemClick}>Not this one</MenuItem>
      <MenuItem onClick={handleItemClick}>Not this one</MenuItem>
      <MenuItem onClick={handleItemClick}>Not this one</MenuItem>
      <MenuItem onClick={handleItemClick} subMenu={deeper3}>Go deeper</MenuItem>
      <MenuItem onClick={handleItemClick}>Not this one</MenuItem>
      <MenuItem onClick={handleItemClick}>Not this one</MenuItem>
    </Menu>
  );

  const deeper1 = (
    <Menu>
      <MenuItem onClick={handleItemClick} subMenu={deeper2}>Go deeper</MenuItem>
      <MenuItem onClick={handleItemClick}>Not this one</MenuItem>
      <MenuItem onClick={handleItemClick}>Not this one</MenuItem>
    </Menu>
  );

  const autoSaveItems = (
    <Menu>
      <MenuItem onClick={handleItemClick}>On Exit</MenuItem>
      <MenuItem onClick={handleItemClick}>On Change</MenuItem>
    </Menu>
  );

  const settingsSubMenu = (
    <Menu>
      <MenuItem
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          setDarkMode(!darkMode);
        }}
      >
        <Grid alignItems="center" container justify="space-between">
          <Grid item>Dark Mode</Grid>
          <Grid item>
            <Switch checked={darkMode} />
          </Grid>
        </Grid>
      </MenuItem>
      <MenuItem onClick={handleItemClick}>Verbose Logging</MenuItem>
      <MenuItem onClick={handleItemClick} subMenu={autoSaveItems}>Auto-save</MenuItem>
      <MenuItem onClick={handleItemClick} subMenu={deeper1}>Go Deeper</MenuItem>
    </Menu>
  );

  const myAccountItems = (
    <Menu>
      <MenuItem onClick={handleItemClick}>Reset password</MenuItem>
      <MenuItem onClick={handleItemClick}>Change username</MenuItem>
    </Menu>
  );

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleButtonClick}>
        Open Menu
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleItemClick}
      >
        <MenuItem onClick={handleItemClick} subMenu={settingsSubMenu}>Settings</MenuItem>
        <MenuItem onClick={handleItemClick} subMenu={myAccountItems}>My Account</MenuItem>
        <MenuItem onClick={handleItemClick}>Logout</MenuItem>
        <MenuItem onClick={handleItemClick}>Thing</MenuItem>
        <MenuItem onClick={handleItemClick}>Other thing</MenuItem>
      </Menu>
    </div>
  );
}
