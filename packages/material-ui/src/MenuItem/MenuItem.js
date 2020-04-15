import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import withStyles from '../styles/withStyles';
import ListItem from '../ListItem';
import KeyboardArrowRight from '../internal/svg-icons/KeyboardArrowRight';
import createChainedFunction from '../utils/createChainedFunction';
import useForkRef from '../utils/useForkRef';
import * as ReactDOM from 'react-dom';

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
  indicatorWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  indicator: {
    marginLeft: theme.spacing(2),
  },
});

const MenuItem = React.forwardRef(function MenuItem(props, ref) {
  const {
    children: childrenProp,
    classes,
    className,
    component = 'li',
    disableGutters = false,
    subMenu,
    SubMenuIcon = KeyboardArrowRight,
    openSubMenu = false,
    onKeyDown,
    role = 'menuitem',
    selected,
    handleArrowRightKeydown,
    setParentLastEnteredItemIndex,
    tabIndex: tabIndexProp,
    ...other
  } = props;

  const listItemRef = React.useRef(null);
  const handleOwnRef = React.useCallback((instance) => {
    // #StrictMode ready
    listItemRef.current = ReactDOM.findDOMNode(instance);
  }, []);
  const handleRef = useForkRef(handleOwnRef, ref);

  let tabIndex;
  if (!props.disabled) {
    tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
  }

  const {
    anchorEl, // disallowed
    MenuListProps, // Needs to be spread into subMenu prop
    isSubMenu, // disallowed
    open, // disallowed
    setParentLastItemEnteredIndex, // disallowed
    ...allowedSubMenuProps
  } = subMenu ? subMenu.props : {};

  return (
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
      onKeyDown={createChainedFunction(handleArrowRightKeydown, onKeyDown)}
      ref={handleRef}
      aria-expanded={subMenu ? openSubMenu : undefined}
      aria-haspopup={subMenu ? true : undefined}
      {...other}
    >
      {subMenu ? (
        <div className={classes.indicatorWrapper}>
          {childrenProp}
          <SubMenuIcon className={classes.indicator} />
          {openSubMenu
            ? React.cloneElement(subMenu, {
                anchorEl: listItemRef.current,
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                isSubMenu: true,
                MenuListProps: { ...MenuListProps, nestedMenu: true },
                open: openSubMenu,
                setParentLastEnteredItemIndex,
                transformOrigin: { vertical: 'top', horizontal: 'left' },
                ...allowedSubMenuProps
              })
            : null}
        </div>
      ) : (
        childrenProp
      )}
    </ListItem>
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
  handleArrowRightKeydown: PropTypes.func,
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
  openSubMenu: PropTypes.bool,
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
  setParentLastEnteredItemIndex: PropTypes.func,
  /**
   * The sub-Menu that a Menu item will render
   */
  subMenu: PropTypes.node,
  /**
   * The icon used to indicate a Menu item has a sub-Menu.
   */
  SubMenuIcon: PropTypes.node,
  /**
   * @ignore
   */
  tabIndex: PropTypes.number,
};

export default withStyles(styles, { name: 'MuiMenuItem' })(MenuItem);
