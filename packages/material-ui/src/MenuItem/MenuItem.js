import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import withStyles from '../styles/withStyles';
import ListItem from '../ListItem';
import KeyboardArrowRight from '../internal/svg-icons/KeyboardArrowRight';
import createChainedFunction from '../utils/createChainedFunction';
import useForkRef from '../utils/useForkRef';
import Menu from '../Menu';
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
    NestedMenuProps = {},
    openNestedMenu = false,
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

  const ListItemAndNestedMenu = [
    <ListItem
      key="ListItem"
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
    </ListItem>,
    openNestedMenu ? (
      <Menu
        key='nestedMenu'
        anchorEl={listItemRef.current}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        nestedMenu
        MenuListProps={{ nestedMenu: true }}
        open={openNestedMenu}
        setParentLastEnteredItemIndex={setParentLastEnteredItemIndex}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        variant="menu"
        {...NestedMenuProps}
      >
        {nestedItems}
      </Menu>
    ) : null
  ]

  return ListItemAndNestedMenu;

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
   * Customize the nested Menu that will render the nestedItems.
   */
  NestedMenuProps: PropTypes.object,
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
   * @ignore
   */
  tabIndex: PropTypes.number,
};

export default withStyles(styles, { name: 'MuiMenuItem' })(MenuItem);
