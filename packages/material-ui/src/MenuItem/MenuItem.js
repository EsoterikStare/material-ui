import * as React from 'react';
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
});

const MenuItem = React.forwardRef(function MenuItem(props, ref) {
  const {
    classes,
    className,
    component = 'li',
    disableGutters = false,
    nestedItems = [],
    openNested,
    role = 'menuitem',
    selected,
    tabIndex: tabIndexProp,
    ...other
  } = props;

  const hasSubMenu = nestedItems.length > 0;

  let tabIndex;
  if (!props.disabled) {
    tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
  }
  return (
    <>
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
        ref={ref}
        {...other}
      />
      {hasSubMenu ? (
        <Menu
          anchorEl={ref.current}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          autoFocus={false}
          disableAutoFocus
          disableEnforceFocus
          // onClose={() => setAnchorEl(null)}
          open={openNested}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          {nestedItems}
        </Menu>
      ) : null}
    </>
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
  openNested: PropTypes.bool,
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
