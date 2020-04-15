import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import withStyles from '../styles/withStyles';
import ListItem from '../ListItem';
import KeyboardArrowRight from '../internal/svg-icons/KeyboardArrowRight';
import createChainedFunction from '../utils/createChainedFunction';
import useForkRef from '../utils/useForkRef';

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
  focusAfterSubMenuClose: {
    '&:focus': {
      backgroundColor: theme.palette.action.selected
    }
  }
});

const MenuItem = React.forwardRef(function MenuItem(props, ref) {
  const {
    children: childrenProp,
    classes,
    className,
    component = 'li',
    disableGutters = false,
    handleArrowRightKeydown,
    ListItemClasses,
    openSubMenu = false,
    onKeyDown,
    role = 'menuitem',
    selected,
    subMenu,
    SubMenuIcon = KeyboardArrowRight,
    setParentJustArrowedLeft,
    setParentLastEnteredItemIndex,
    tabIndex: tabIndexProp,
    tempFocus,
    handleParentClose,
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
    handleParentClose: outsideHPC, // disallowed
    MenuListProps, // Needs to be spread into subMenu prop
    isSubMenu, // disallowed
    open, // disallowed
    setParentJustArrowedLeft: outsideSPJAL, // disallowed
    setParentLastEnteredItemIndex: outsideSPLEII, // disallowed
    onClose: subOnClose, // Needs to be combined with parentOnClose on the subMenu
    ...allowedSubMenuProps
  } = subMenu ? subMenu.props : {};

  const listItemAndSubMenu = [
    <ListItem
      key="MenuItem"
      button
      role={role}
      tabIndex={tabIndex}
      component={component}
      selected={selected}
      disableGutters={disableGutters}
      classes={{ dense: classes.dense, ...ListItemClasses }}
      className={clsx(
        classes.root,
        {
          [classes.selected]: selected,
          [classes.gutters]: !disableGutters,
          [classes.focusAfterSubMenuClose]: tempFocus
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
        </div>
      ) : (
        childrenProp
      )}
    </ListItem>,
    openSubMenu
      ? React.cloneElement(subMenu, {
          key: 'subMenu',
          anchorEl: listItemRef.current,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          isSubMenu: true,
          MenuListProps: { ...MenuListProps, isSubMenu: true },
          open: openSubMenu,
          onClose: createChainedFunction(handleParentClose, subOnClose),
          setParentJustArrowedLeft,
          setParentLastEnteredItemIndex,
          transformOrigin: { vertical: 'top', horizontal: 'left' },
          ...allowedSubMenuProps,
        })
      : null,
  ];

  return listItemAndSubMenu;
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
  handleParentClose: PropTypes.func,
  /**
   * `classes` prop applied to the [`ListItem`](/api/list-item/) element.
   */
  ListItemClasses: PropTypes.object,
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
  setParentJustArrowedLeft: PropTypes.func,
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
  /**
   * @ignore
   */
  tempFocus: PropTypes.bool,
};

export default withStyles(styles, { name: 'MuiMenuItem' })(MenuItem);
