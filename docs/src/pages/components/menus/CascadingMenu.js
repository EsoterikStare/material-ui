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
  
  const candies = [
    'Lifesavers',
    'Hersheys Kiss',
    'Skittles',
    'Twizzlers',
    'Ferrero Rocher',
    'Reeses Pieces',
    'Dum Dums Pop',
    'Starburst',
    'Swedish Fish',
    'Airheads',
    'Kitkat',
    'Almond Joy',
    'Twix',
    '3 Musketeers',
    'Milky Way',
    'Tootsie Roll',
    'Tootsie Pop',
    'Werthers',
    'Andes Mint',
    'Sour Patch Kids',
    'Milk Duds',
    'Sweet Tarts',
    'Nerds',
    'Laffy Taffy',
    'Gobstopper',
    'Mounds',
    'Snickers',
    'York Peppermint Pattie',
    'Heath Bar',
    'Jolly Rancher',
    'Blow Pop',
    '100 Grand',
    'Crunch',
    'Butterfinger',
    'Baby Ruth',
    'Dove Bar',
    'Lemonhead',
    'Warheads',
    '5th Avenue',
    'Bar None',
    'Clark Bar',
    'Krackel',
    'Bueno',
    'Lindt Chocolate Bar',
    'Lindt Lindor Truffles',
    'Mars Bar',
    'Mr. Goodbar',
    'Milka',
    'Pay Day',
    'Take 5',
    'Toblerone',
    'U-No Bar',
    'Wonka Bar',
    'Whatchamacallit',
    'Runts',
    'Bubble Tape',
    'Candy Buttons',
    'Candy Cigarettes',
    'Candy Corn',
    'Dots',
    'Fun Dip',
    'Junior Mints',
    'Peeps',
    'Pop Rocks',
    'Pixie Stix',
    'Pez',
    'Raisinets',
    'Razzles',
    'Smarties',
    'Whoppers',
    'Topic',
    'Hot Tamales',
    'Life Savers Gummies',
    'Cookie Dough Bites',
    'Spree',
    'Mentos',
    'Tic Tac',
    'Sugar Babies',
    'Haribo Starmix'
  ].map(candy => <MenuItem onClick={handleClose}>{candy}</MenuItem>)

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
                    {candies}
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
