import React from 'react';
import {string} from 'prop-types'
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function SimpleMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleItemClick = () => {
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
    { onClick: handleItemClick, children: 'You did it!' },
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
    { onClick: handleItemClick, children: 'Dark Mode' },
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
