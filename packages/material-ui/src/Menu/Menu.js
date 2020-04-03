import React, { useState } from 'react';
import { isFragment } from 'react-is';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import withStyles from '../styles/withStyles';
import Popover from '../Popover';
import MenuList from '../MenuList';
import * as ReactDOM from 'react-dom';
import setRef from '../utils/setRef';
import useTheme from '../styles/useTheme';

const RTL_ORIGIN = {
  vertical: 'top',
  horizontal: 'right',
};

const LTR_ORIGIN = {
  vertical: 'top',
  horizontal: 'left',
};

export const styles = {
  /* Styles applied to the `Paper` component. */
  paper: {
    // specZ: The maximum height of a simple menu should be one or more rows less than the view
    // height. This ensures a tapable area outside of the simple menu with which to dismiss
    // the menu.
    maxHeight: 'calc(100% - 96px)',
    // Add iOS momentum scrolling.
    WebkitOverflowScrolling: 'touch',
  },
  /* Styles applied to the `List` component via `MenuList`. */
  list: {
    // We disable the focus ring for mouse, touch and keyboard users.
    outline: 0,
  },
  nestedMenuItem: {
    pointerEvents: 'auto' // re-enable click events on nested Menu items
  },
};

const Menu = React.forwardRef(function Menu(props, ref) {
  const {
    autoFocus = true,
    children,
    classes,
    disableAutoFocusItem = false,
    MenuListProps = {},
    onClose,
    onEntering,
    open,
    PaperProps = {},
    PopoverClasses,
    transitionDuration = 'auto',
    nestedMenu = false,
    variant = 'selectedMenu',
    ...other
  } = props;
  const theme = useTheme();

  const [lastEnteredItemIndex, setLastEnteredItemIndexActual] = useState(null);

  const setLastEnteredItemIndex = val => {
    setLastEnteredItemIndexActual(val)
  };

  const autoFocusItem = autoFocus && !disableAutoFocusItem && open;

  const menuListActionsRef = React.useRef(null);
  const contentAnchorRef = React.useRef(null);

  const getContentAnchorEl = () => contentAnchorRef.current;

  const handleEntering = (element, isAppearing) => {
    if (menuListActionsRef.current) {
      menuListActionsRef.current.adjustStyleForScrollbar(element, theme);
    }

    if (onEntering) {
      onEntering(element, isAppearing);
    }
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setLastEnteredItemIndex(null);

      if (onClose) {
        onClose(event, 'tabKeyDown');
      }
    }
  };

  const handleMenuClose = event => {
    setLastEnteredItemIndex(null);
    
    if (onClose) onClose(event);
  };

  /**
   * the index of the item should receive focus
   * in a `variant="selectedMenu"` it's the first `selected` item
   * otherwise it's the very first item.
   */
  let activeItemIndex = -1;
  // since we inject focus related props into children we have to do a lookahead
  // to check if there is a `selected` item. We're looking for the last `selected`
  // item and use the first valid item as a fallback
  React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      if (isFragment(child)) {
        console.error(
          [
            "Material-UI: the Menu component doesn't accept a Fragment as a child.",
            'Consider providing an array instead.',
          ].join('\n'),
        );
      }
    }

    if (!child.props.disabled) {
      if (variant === 'selectedMenu' && child.props.selected) {
        activeItemIndex = index;
      } else if (activeItemIndex === -1) {
        activeItemIndex = index;
      }
    }
  });

  const items = React.Children.map(children, (child, index) => {
    const { nestedItems } = child.props;
    const { anchorEl, atLeastOneNestedMenu } = other;

    const hasNestedMenu = Boolean(nestedItems);
    const parentMenuOpen = Boolean(anchorEl)

    let additionalPropsAdded = false;
    const additionalProps = {}; 
    
    // This is the original purpase of this React.Children.map and is basically unchanged.
    if (index === activeItemIndex) {
      additionalPropsAdded = true;
      
      Object.assign(additionalProps, {
        ref: instance => {
          // #StrictMode ready
          contentAnchorRef.current = ReactDOM.findDOMNode(instance);
          setRef(child.ref, instance);
        }
      });
    }

    if (nestedMenu) {
      additionalPropsAdded = true;

      Object.assign(additionalProps, {
        // Tells each MenuItem that it's in a nested Menu so the style that re-enables
        // pointer-events can be applied.
        className: classes.nestedMenuItem 
      });
    }
    
    // If the current item in this map has nestedItems,
    // we need the Menu to orchestrate its nestedMenu
    if (hasNestedMenu) {
      additionalPropsAdded = true;

      Object.assign(additionalProps, {
        openNestedMenu: index === lastEnteredItemIndex && parentMenuOpen ,
      });
      
    }
    
    // If there are ANY children with nestedMenus, then ALL 
    // of the children need to know how to close any open nestedMenus
    // and reset the state that controls which nested menu is open.
    if (atLeastOneNestedMenu || true) {
      additionalPropsAdded = true;
      
      // If there is an incoming onClick for the item, inject parent menu state management
      // function into it, otherwise do nothing.
      const onClickWithMenuReset = child.props.onClick ? e => {
        handleMenuClose(e);
        child.props.onClick(e);
      } : undefined;
      
      Object.assign(additionalProps, {
        onNestedMenuClose: e => handleMenuClose(e),
        onClick: onClickWithMenuReset,
        onMouseEnter: () => {
          setLastEnteredItemIndex(index);
        }
      });
    }

    // Using a semaphore instead of inspecting addtionalProps
    // directly to avoid performance hits at scale. Might be 
    // fine to just do Object.keys(additionalProps).length > 0,
    // but that seems like iterations we can avoid.
    if (additionalPropsAdded) {
      return React.cloneElement(child, {
        ...additionalProps
      });
    }

    return child;
  });
  
  return (
    <Popover
      getContentAnchorEl={getContentAnchorEl}
      classes={PopoverClasses}
      onClose={handleMenuClose}
      onEntering={handleEntering}
      anchorOrigin={theme.direction !== 'rtl' ? RTL_ORIGIN : LTR_ORIGIN}
      transformOrigin={theme.direction === 'rtl' ? RTL_ORIGIN : LTR_ORIGIN}
      PaperProps={{
        ...PaperProps,
        classes: {
          ...PaperProps.classes,
          root: classes.paper,
        },
      }}
      open={open}
      ref={ref}
      transitionDuration={transitionDuration}
      {...other}
    >
      <MenuList
        data-mui-test="Menu"
        onKeyDown={handleListKeyDown}
        actions={menuListActionsRef}
        autoFocus={autoFocus && (activeItemIndex === -1 || disableAutoFocusItem)}
        autoFocusItem={autoFocusItem}
        variant={variant}
        {...MenuListProps}
        className={clsx(classes.list, MenuListProps.className)}
      >
        {items}
      </MenuList>
    </Popover>
  );
});

Menu.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * The DOM element used to set the position of the menu.
   */
  anchorEl: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.instanceOf(typeof Element === 'undefined' ? Object : Element),
  ]),
  /**
   * If `true` (Default) will focus the `[role="menu"]` if no focusable child is found. Disabled
   * children are not focusable. If you set this prop to `false` focus will be placed
   * on the parent modal container. This has severe accessibility implications
   * and should only be considered if you manage focus otherwise.
   */
  autoFocus: PropTypes.bool,
  /**
   * Menu contents, normally `MenuItem`s.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  /**
   * When opening the menu will not focus the active item but the `[role="menu"]`
   * unless `autoFocus` is also set to `false`. Not using the default means not
   * following WAI-ARIA authoring practices. Please be considerate about possible
   * accessibility implications.
   */
  disableAutoFocusItem: PropTypes.bool,
  /**
   * Props applied to the [`MenuList`](/api/menu-list/) element.
   */
  MenuListProps: PropTypes.object,
  /**
   * Callback fired when the component requests to be closed.
   *
   * @param {object} event The event source of the callback.
   * @param {string} reason Can be: `"escapeKeyDown"`, `"backdropClick"`, `"tabKeyDown"`.
   */
  onClose: PropTypes.func,
  /**
   * Callback fired before the Menu enters.
   */
  onEnter: PropTypes.func,
  /**
   * Callback fired when the Menu has entered.
   */
  onEntered: PropTypes.func,
  /**
   * Callback fired when the Menu is entering.
   */
  onEntering: PropTypes.func,
  /**
   * Callback fired before the Menu exits.
   */
  onExit: PropTypes.func,
  /**
   * Callback fired when the Menu has exited.
   */
  onExited: PropTypes.func,
  /**
   * Callback fired when the Menu is exiting.
   */
  onExiting: PropTypes.func,
  /**
   * If `true`, the menu is visible.
   */
  open: PropTypes.bool.isRequired,
  /**
   * @ignore
   */
  PaperProps: PropTypes.object,
  /**
   * `classes` prop applied to the [`Popover`](/api/popover/) element.
   */
  PopoverClasses: PropTypes.object,
  /**
   * The length of the transition in `ms`, or 'auto'
   */
  transitionDuration: PropTypes.oneOfType([
    PropTypes.oneOf(['auto']),
    PropTypes.number,
    PropTypes.shape({
      appear: PropTypes.number,
      enter: PropTypes.number,
      exit: PropTypes.number,
    }),
  ]),
  /**
   * The variant to use. Use `menu` to prevent selected items from impacting the initial focus
   * and the vertical alignment relative to the anchor element.
   */
  variant: PropTypes.oneOf(['menu', 'selectedMenu']),
};

export default withStyles(styles, { name: 'MuiMenu' })(Menu);
