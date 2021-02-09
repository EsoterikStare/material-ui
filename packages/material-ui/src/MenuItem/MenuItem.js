import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import withStyles from '../styles/withStyles';
import ListItem from '../ListItem';
import KeyboardArrowRight from '../internal/svg-icons/KeyboardArrowRight';
import createChainedFunction from '../utils/createChainedFunction';
import useForkRef from '../utils/useForkRef';
import useTheme from '../styles/useTheme';

const RTL_ANCHOR_ORIGIN = {
  vertical: 'top',
  horizontal: 'left',
};

const LTR_ANCHOR_ORIGIN = {
  vertical: 'top',
  horizontal: 'right',
};

const RTL_TRANSFORM_ORIGIN = {
  vertical: 'top',
  horizontal: 'right',
};

const LTR_TRANSFORM_ORIGIN = {
  vertical: 'top',
  horizontal: 'left',
};

const BASE_ROTATION = -37;

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
  /* Styles applied to the root element unless `disableGutters={true}`. */
  gutters: {},
  /* Styles applied to the root element if `selected={true}`. */
  selected: {},
  /* Styles applied to the root element if dense. */
  dense: {
    ...theme.typography.body2,
    minHeight: 'auto',
  },
  /* Styles applied to a Menu Item's children when a subMenu is present */
  subMenuItemWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  /* Styles applied to the subMenuIcon when it is present. */
  subMenuIcon: {
    marginLeft: theme.spacing(2),
  },
  /* Styles applied to parent item of open sub menu. */
  // inspired by this example https://codepen.io/oldcoyote/pen/YoBeyo
  openSubMenuParent: {
    '--dynamic-height': 0,
    '--dynamic-width': 0,
    '--dynamic-rotation': `rotate(${BASE_ROTATION}deg)`,
    '--dynamic-origin': 'top left',
    '--dynamic-left-align': '50%',
    backgroundColor: theme.palette.action.hover,
    '&:hover': {
      overflow: 'visible'
    },
    '&:hover&::after': {
      display: 'block',
      position: 'absolute',
      content: "''",
      width: 'var(--dynamic-width)',
      height:'var(--dynamic-height)',
      top: '50%',
      left: 'var(--dynamic-left-align)',
      transform: 'var(--dynamic-rotation)', // gives it a bias to shift towards lower menu items
      transformOrigin: 'var(--dynamic-origin)',
      zIndex: 1700, // need the after element to float above the other menu items
    }
  },
  /* Styles applied to subMenuIcon when direction is 'rtl'. */
  rtlSubMenuIcon: {
    transform: 'rotate(-180deg)',
  },
});

const MenuItem = React.forwardRef(function MenuItem(props, ref) {
  const theme = useTheme();

  const [anchorPoints, setAnchorPoints] = React.useState({x: null, y: null, height: null, width: null, top: null, bottom: null });
  const [menuPoints, setMenuPoints] = React.useState({x: null, y: null, height: null, width: null, top: null, bottom: null});

  const {
    children,
    classes,
    className,
    component = 'li',
    disableGutters = false,
    onArrowRightKeydown,
    ListItemClasses,
    openSubMenu = false,
    onKeyDown,
    role = 'menuitem',
    selected,
    subMenu,
    subMenuIcon: SubMenuIcon = KeyboardArrowRight,
    setParentOpenSubMenuIndex,
    tabIndex: tabIndexProp,
    onParentClose,
    ...other
  } = props;

  const listItemRef = React.useRef(null);
  const handleRef = useForkRef(listItemRef, ref);

  let tabIndex;
  if (!props.disabled) {
    tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
  }
  React.useEffect(() => {
    if (anchorPoints.height === null || !menuPoints.height === null) {
      return;
    }

    /* using the width and screen coordinates, we need to calculate the new height 
      and width of the generated after pseudoelement to try to contain as much of 
      the opened menu as possible. */
    listItemRef.current.style.setProperty("--dynamic-width", `${menuPoints.width}px`);
    listItemRef.current.style.setProperty("--dynamic-height", `${menuPoints.height}px`);
  
    // if negative, menu is higher than anchor
    const topDiff = anchorPoints.top - menuPoints.top;
    /* depending on how much more bottom oriented vs top oriented the sub menu is,
     we can update the rotation to better match an expected path */
    const bottomDiff = anchorPoints.bottom - menuPoints.bottom;
    /* worst case where its a very tall menu thats almost entirely below the 
       current list item (or vice versa), a rotation of -20 is the max we'd want to change it
       anything -200 or more should be -20 degrees... we can try a ratio between 0 to -200 and -37 to -20
       note 200 is just a guess, not sure if there's a better way to calculate */
    const totalDiff = topDiff + bottomDiff;
    const diffRatio = Math.abs(totalDiff/200);
    const calculatedRotation = Math.trunc(17 * diffRatio); // 17 because thats the diff between -37 and -20
    const rotationAmount = Math.min(calculatedRotation, 17);
    let updatedRotation = BASE_ROTATION + rotationAmount;

    /* depending on the direction and menu height differences,
       we need to update the transform origins, left alignment,
       and rotation amount to better fit the rendered sub menus */
    if (theme.direction === 'ltr') {
      if (totalDiff >= 100) {
        listItemRef.current.style.setProperty("--dynamic-origin", 'top right');
        listItemRef.current.style.setProperty("--dynamic-left-align", '-50%');
        updatedRotation = totalDiff > 100 ? updatedRotation - 125 : updatedRotation;
      }
      listItemRef.current.style.setProperty("--dynamic-rotation", `rotate(${updatedRotation}deg)`);
    } else {
      if (totalDiff >= 100) {
        listItemRef.current.style.setProperty("--dynamic-origin", 'top left');
        listItemRef.current.style.setProperty("--dynamic-left-align", '-50%');
        updatedRotation = totalDiff > 100 ? updatedRotation - 125 : updatedRotation;
      } else {
        listItemRef.current.style.setProperty("--dynamic-origin", 'top right');
        listItemRef.current.style.setProperty("--dynamic-left-align", '50%');
      }
      listItemRef.current.style.setProperty("--dynamic-rotation", `rotate(${updatedRotation * -1}deg)`);
    }
  }, [anchorPoints, menuPoints, theme.direction]);
    
  const getAnchorPoints = () => {
    // the listItem that triggered the event
    const boundingRect = listItemRef.current.getBoundingClientRect();
    const { x, y, width, height, top, bottom } = boundingRect;

    setAnchorPoints({x, y, width, height, top, bottom});
  }

  const getMenuPoints = (openedMenu) => {
    // the sub menu that opened
    if(!openedMenu) return;
    const boundingRect = openedMenu.getBoundingClientRect();
    const { x, y, width, height, top, bottom } = boundingRect;

    setMenuPoints({x, y, width, height, top, bottom});
  }

  const getMeasurements = e => {
    getMenuPoints(e);
    getAnchorPoints();
  }
  
  const {
    anchorEl, // disallowed
    onParentClose: onParentCloseProp, // disallowed
    MenuListProps, // Needs to be spread into subMenu prop
    isSubMenu, // disallowed
    open, // disallowed
    setParentOpenSubMenuIndex: setParentOpenSubMenuIndexProp, // disallowed
    onClose: subOnClose, // Needs to be combined with parentOnClose on the subMenu
    ...allowedSubMenuProps
  } = subMenu ? subMenu.props : {};

  const listItem = (
      <ListItem
        key={subMenu && 'subMenuItem'}
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
            [classes.openSubMenuParent]: openSubMenu,
          },
          className,
        )}
        onKeyDown={createChainedFunction(onArrowRightKeydown, onKeyDown)}
        ref={handleRef}
        aria-expanded={subMenu ? openSubMenu : undefined}
        aria-haspopup={subMenu ? true : undefined}
        {...other}
      >
        {subMenu ? (
          <React.Fragment>
            <div className={classes.subMenuItemWrapper}>
              {children}
              <SubMenuIcon
                className={clsx(classes.subMenuIcon, {
                  [classes.rtlSubMenuIcon]: theme.direction === 'rtl',
                })}
              />
            </div>
          </React.Fragment>
        ) : (
          children
        )}
      </ListItem>
  );

  if (!subMenu) return listItem;

  const listItemAnchorEl = listItemRef.current;

  return [
    listItem,
    openSubMenu && listItemAnchorEl
      ? React.cloneElement(subMenu, {
          key: 'subMenu',
          anchorEl: listItemAnchorEl,
          anchorOrigin: theme.direction === 'rtl' ? RTL_ANCHOR_ORIGIN : LTR_ANCHOR_ORIGIN,
          MenuListProps: { ...MenuListProps, isSubMenu: true },
          open: openSubMenu,
          onClose: createChainedFunction(onParentClose, subOnClose),
          TransitionProps: { onEntered: e => getMeasurements(e)},
          setParentOpenSubMenuIndex,
          transformOrigin: theme.direction === 'rtl' ? RTL_TRANSFORM_ORIGIN : LTR_TRANSFORM_ORIGIN,
          ...allowedSubMenuProps,
        })
      : undefined,
  ];
});

MenuItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * @ignore
   */
  button: PropTypes.bool,
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * If `true`, compact vertical padding designed for keyboard and mouse input is used.
   * The prop defaults to the value inherited from the parent List component.
   * @default false
   */
  dense: PropTypes.bool,
  /**
   * @ignore
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, the left and right padding is removed.
   * @default false
   */
  disableGutters: PropTypes.bool,
  /**
   * `classes` prop applied to the [`ListItem`](/api/list-item/) element.
   */
  ListItemClasses: PropTypes.object,
  /**
   * @ignore
   */
  onArrowRightKeydown: PropTypes.func,
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
  onParentClose: PropTypes.func,
  /**
   * When `true`, opens the subMenu, if provided.
   * @default false
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
  setParentOpenSubMenuIndex: PropTypes.func,
  /**
   * Menu to display as a sub-menu.
   */
  subMenu: PropTypes.node,
  /**
   * Normally `Icon`, `SvgIcon`, or a `@material-ui/icons`
   * SVG icon element rendered on a MenuItem that
   * contains a subMenu
   * @default KeyboardArrowRight
   */
  subMenuIcon: PropTypes.node,
  /**
   * @ignore
   */
  tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default withStyles(styles, { name: 'MuiMenuItem' })(MenuItem);
