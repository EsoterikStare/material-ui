import React, { useState } from 'react';
import {string} from 'prop-types'
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';

export default function SimpleMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [darkMode, setDarkMode] = useState(false)

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const specialItemClick = (event) => {
    console.log(event.target)
    // window.alert(event.target.innerHtml)
  }

  const handleItemClick = (event) => {
    event.preventDefault();
    event.stopPropagation();  
    console.log('Item clicked!')
    setAnchorEl(null);
  };

  const renderMenuItem = ({ children, ...rest }, index) => (
    <MenuItem key={index.toString()} {...rest}>
      {children}
    </MenuItem>
  );

  renderMenuItem.propTypes = {
    children: string
  }

  const deeper3 = [
    { onClick: handleItemClick, children: 'You did it!' },
    { onClick: handleItemClick, children: 'You did it!' },
    { onClick: specialItemClick, children: 'This one is special!' },
  ];

  const deeper2 = [
    { onClick: handleItemClick, children: 'Not this one' },
    { onClick: handleItemClick, children: 'Not this one' },
    { onClick: handleItemClick, children: 'Not this one' },
    {
      nestedItems: deeper3.map(renderMenuItem),
      children: 'Go deeper',
    },
    { onClick: handleItemClick, children: 'Not this one' },
    { onClick: handleItemClick, children: 'Not this one' },
  ];

  const deeper1 = [
    {
      nestedItems: deeper2.map(renderMenuItem),
      children: 'Go deeper',
    },
    { onClick: handleItemClick, children: 'Not this one' },
    { onClick: handleItemClick, children: 'Not this one' },
  ];

  const autoSaveItems = [
    { onClick: handleItemClick, children: 'On Exit' },
    { onClick: handleItemClick, children: 'On Change' },
  ];

  const settingItems = [
    { onClick: event => {
      event.stopPropagation();
      event.preventDefault();
      setDarkMode(!darkMode);
    }, children: (
      <Grid alignItems="center" container justify="space-between">
        <Grid item>{'Dark Mode'}</Grid>
        <Grid item><Switch checked={darkMode}/></Grid>
      </Grid>
    )},
    { onClick: handleItemClick, children: 'Verbos Logging' },
    {
      nestedItems: autoSaveItems.map(renderMenuItem),
      children: 'Auto-save',
    },
    {
      nestedItems: deeper1.map(renderMenuItem),
      children: 'Go deeper',
    },
  ];

  const myAccountItems = [
    { onClick: handleItemClick, children: 'Reset password' },
    { onClick: handleItemClick, children: 'Change username' },
  ];

  const mainMenuItems = [
    {
      nestedItems: settingItems.map(renderMenuItem),
      children: 'Settings',
    },
    {
      nestedItems: myAccountItems.map(renderMenuItem),
      children: 'My account',
    },
    { onClick: handleItemClick, children: 'Logout' },
    { onClick: handleItemClick, children: 'Thing' },
    { onClick: handleItemClick, children: 'Other thing' },
  ];

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleButtonClick}>
        Open Menu
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        // keepMounted
        open={Boolean(anchorEl)}
        onClose={handleItemClick}
        // variant="selectedMenu"
      >
        {mainMenuItems.map(renderMenuItem)}
      </Menu>
    </div>
  );
}
