import React, { useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import withStyles from '../styles/withStyles';
import ListItem from '../ListItem';
import Menu from '../Menu';

export const styles = (theme) => ({
  /* Styles applied to the root element. */
  root: {
    ...theme.typography.body1,
    minHeight: 48,
    paddingTop: 6,
    paddingBottom: 6,
    boxSizing: 'border-box',
    width: 'auto',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    [theme.breakpoints.up('sm')]: {
      minHeight: 'auto',
    },
  },
  // TODO v5: remove
  /* Styles applied to the root element if `disableGutters={false}`. */
  gutters: {},
  /* Styles applied to the root element if `selected={true}`. */
  selected: {},
  /* Styles applied to the root element if dense. */
  dense: {
    ...theme.typography.body2,
    minHeight: 'auto',
  },
  nestedMenu: {
    pointerEvents: 'none' // disable click away mask for nested Menus
  },
});

const MenuItem = React.forwardRef(function MenuItem(props, ref) {
  const {
    classes,
    className,
    component = 'li',
    disableGutters = false,
    nestedItems,
    openNestedMenu = false,
    role = 'menuitem',
    selected,
    onMouseEnter: onMouseEnterProp,
    onNestedMenuClose,
    tabIndex: tabIndexProp,
    ...other
  } = props;

  const listItemRef = useRef(null);
  useImperativeHandle(ref, () => listItemRef.current);

  let tabIndex;
  if (!props.disabled) {
    tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
  }

  const onMouseEnter = e => {
    // console.log('Menu Item mouse-enter');
    if (onMouseEnterProp) {
      onMouseEnterProp(e);
    }
  }

  // TODO: This doesn't work correctly yet. Consumption in the Menu component is hard-coded to true to keep stuff working for now.
  const atLeastOneNestedMenu = nestedItems ? nestedItems.some(item => typeof item.props.nestedItems !== 'undefined') : false;

  // debugConsole(`${other.children} MenuItem`, { listItemRef, openNestedMenu, nestedItems, other });

  return (
    <React.Fragment>
      <ListItem
        button
        role={role}
        tabIndex={tabIndex}
        component={component}
        selected={selected}
        disableGutters={disableGutters}
        classes={{ dense: classes.dense }}
        className={clsx(
          classes.root,
          {
            [classes.selected]: selected,
            [classes.gutters]: !disableGutters,
          },
          className,
        )}
        onMouseEnter={onMouseEnter}
        ref={listItemRef}
        {...other}
      />
      {openNestedMenu ? (
        <Menu
          atLeastOneNestedMenu={atLeastOneNestedMenu}
          className={classes.nestedMenu}
          anchorEl={listItemRef.current}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          autoFocus={false}
          disableAutoFocus
          disableEnforceFocus
          onClose={e => onNestedMenuClose(e)}
          open={openNestedMenu}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          nestedMenu
        >
          {nestedItems}
        </Menu>
      ) : null}
    </React.Fragment>
  );
});

MenuItem.propTypes = {
  /**
   * Menu item contents.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object.isRequired,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The component used for the root node.
   * Either a string to use a DOM element or a component.
   */
  component: PropTypes.elementType,
  /**
   * If `true`, compact vertical padding designed for keyboard and mouse input will be used.
   */
  dense: PropTypes.bool,
  /**
   * @ignore
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, the left and right padding is removed.
   */
  disableGutters: PropTypes.bool,
  /**
   * An array of MenuItems to render in a sub-Menu
   */
  nestedItems: PropTypes.arrayOf(PropTypes.node),
  /**
   * @ignore
   */
  onMouseEnter: PropTypes.func,
  /**
   * @ignore
   */
  onNestedMenuClose: PropTypes.func,
  /**
   * @ignore
   */
  openNestedMenu: PropTypes.bool,
  /**
   * @ignore
   */
  role: PropTypes.string,
  /**
   * @ignore
   */
  selected: PropTypes.bool,
  /**
   * @ignore
   */
  tabIndex: PropTypes.number,
};

export default withStyles(styles, { name: 'MuiMenuItem' })(MenuItem);
