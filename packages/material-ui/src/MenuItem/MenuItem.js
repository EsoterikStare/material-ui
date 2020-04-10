import React, { useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import withStyles from '../styles/withStyles';
import ListItem from '../ListItem';
import KeyboardArrowRight from '../internal/svg-icons/KeyboardArrowRight';
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
    pointerEvents: 'none', // disable click away mask for nested Menus
  },
  indicatorWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between'
  },
  indicator: {
    marginLeft: theme.spacing(2)
  }
});

const MenuItem = React.forwardRef(function MenuItem(props, ref) {
  const {
    children: childrenProp,
    classes,
    className,
    component = 'li',
    disableGutters = false,
    nestedItems,
    NestedMenuIndicator = KeyboardArrowRight,
    openNestedMenu = false,
    onKeyDown: onKeyDownProp,
    role = 'menuitem',
    selected,
    handleMenuItemKeyDown,
    parentMenuActions = {},
    // parentMenuLevel,
    tabIndex: tabIndexProp,
    ...other
  } = props;

  const { handleMenuClose: handleParentMenuClose } = parentMenuActions;

  const listItemRef = useRef(null);
  useImperativeHandle(ref, () => listItemRef.current);

  let tabIndex;
  if (!props.disabled) {
    tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
  }

  const onKeyDown = (event) => {
    if (handleMenuItemKeyDown) handleMenuItemKeyDown(event);
    if (onKeyDownProp) onKeyDownProp(event);
  };

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
        onKeyDown={onKeyDown}
        ref={listItemRef}
        aria-expanded={nestedItems ? openNestedMenu : undefined}
        aria-haspopup={nestedItems ? true : undefined}
        {...other}
      >
        {nestedItems ? (
          <div className={classes.indicatorWrapper}>
            {childrenProp}
            <NestedMenuIndicator className={classes.indicator} />
          </div>
        ) : (
          childrenProp
        )}
      </ListItem>
      {openNestedMenu ? (
        <Menu
          className={classes.nestedMenu}
          anchorEl={listItemRef.current}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          nestedMenu
          MenuListProps={{ nestedMenu: true }}
          // menuLevel={parentMenuLevel + 1}
          onClose={handleParentMenuClose}
          open={openNestedMenu}
          parentMenuActions={parentMenuActions}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          variant="menu"
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
   * @ignore
   */
  handleMenuItemKeyDown: PropTypes.func,
  /**
   * An array of MenuItems to render in a nested Menu
   */
  handleNestedMenuClose: PropTypes.func,
  /**
   * @ignore
   */
  nestedItems: PropTypes.arrayOf(PropTypes.node),
  /**
   * Customize the icon used to indicate a MenuItem has a nested Menu.
   */
  NestedMenuIndicator: PropTypes.node,
  /**
   * @ignore
   */
  onKeyDown: PropTypes.func,
  /**
   * @ignore
   */
  onMouseEnter: PropTypes.func,
  /**
   * @ignore
   */
  openNestedMenu: PropTypes.bool,
  /**
   * @ignore
   */
  parentMenuActions: PropTypes.shape({
    handleMenuClose: PropTypes.func,
    setLastEnteredItemIndex: PropTypes.func,
  }),
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
