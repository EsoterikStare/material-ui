import React, { useMemo, useState } from 'react';
import { isFragment } from 'react-is';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import withStyles from '../styles/withStyles';
import Popover from '../Popover';
import MenuList from '../MenuList';
import * as ReactDOM from 'react-dom';
import setRef from '../utils/setRef';
import useTheme from '../styles/useTheme';
import createChainedFunction from '../utils/createChainedFunction';

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
  disablePointerEvents: {
    pointerEvents: 'none', // To stop Modal from capturing hover events
  },
  enablePointerEvents: {
    pointerEvents: 'auto', // To enable capturing hover events on MenuList
  },
};

const Menu = React.forwardRef(function Menu(props, ref) {
  const {
    autoFocus = true,
    children,
    classes,
    disableAutoFocusItem = false,
    MenuListProps = {},
    // menuLevel = 1,
    onClose,
    onEnter,
    onEntering,
    onEntered,
    open,
    PaperProps = {},
    setParentLastEnteredItemIndex,
    PopoverClasses,
    transitionDuration = 'auto',
    nestedMenu = false,
    variant = 'selectedMenu',
    ...other
  } = props;
  const theme = useTheme();

  const [lastEnteredItemIndex, setLastEnteredItemIndex] = useState(null);
  const [entering, setEntering] = useState(false);

  const atLeastOneNestedMenu = useMemo(() => {
    return Array.isArray(children)
      ? nestedMenu ||
          children.some(
            (child) =>
              React.isValidElement(child) &&
              child.props &&
              child.props.nestedItems &&
              child.props.nestedItems.length > 0,
          )
      : false;
  }, [children, nestedMenu]);

  const autoFocusItem = autoFocus && !disableAutoFocusItem && open;

  const menuListActionsRef = React.useRef(null);
  const contentAnchorRef = React.useRef(null);

  const getContentAnchorEl = () => contentAnchorRef.current;

  const handleEnter = (element, isAppearing) => {
    if (atLeastOneNestedMenu) {
      setEntering(true);
      setLastEnteredItemIndex(null);
    }

    if (onEnter) {
      onEnter(element, isAppearing);
    }
  };

  const handleEntering = (element, isAppearing) => {
    if (menuListActionsRef.current) {
      menuListActionsRef.current.adjustStyleForScrollbar(element, theme);
    }

    if (onEntering) {
      onEntering(element, isAppearing);
    }
  };

  const handleEntered = (element, isAppearing) => {
    if (atLeastOneNestedMenu) setEntering(false);

    if (onEntered) {
      onEntered(element, isAppearing)
    }
  };
  
  const handleListKeyDown = (event) => {
    if (event.key === 'Tab' || event.key === 'Escape') {
      event.preventDefault();
      setLastEnteredItemIndex(null);

      if (onClose) {
        onClose(event, `${event.key.toLowerCase()}KeyDown`);
      }
    }

    if (event.key === 'ArrowLeft' && nestedMenu) {
      // Tell the parent Menu to close the nested Menu that you're in, but
      // don't trigger the nested Menu onClose cascade.
      event.stopPropagation();
      event.preventDefault();
      setParentLastEnteredItemIndex(null);
    }
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
    if (!React.isValidElement(child)) {
      return;
    }

    const {
      nestedItems,
      onMouseMove: onMouseMoveChildProp,
    } = child.props;
    const { anchorEl } = other;

    const hasNestedMenu = Boolean(nestedItems);
    const parentMenuOpen = Boolean(anchorEl);

    let additionalPropsAdded = false;
    const additionalProps = {};

    // This is the original purpose of this React.Children.map and is basically unchanged.
    if (index === activeItemIndex) {
      additionalPropsAdded = true;

      Object.assign(additionalProps, {
        ref: (instance) => {
          // #StrictMode ready
          contentAnchorRef.current = ReactDOM.findDOMNode(instance);
          setRef(child.ref, instance);
        },
      });
    }

    // If the current item in this map has nestedItems,
    // we need the Menu to orchestrate its nestedMenu
    if (hasNestedMenu && parentMenuOpen) {
      additionalPropsAdded = true;

      const handleArrowRightKeydown = (event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          setLastEnteredItemIndex(index);
        }
      };
      
      Object.assign(additionalProps, {
        handleArrowRightKeydown,
        openNestedMenu: index === lastEnteredItemIndex && !entering,
        setParentLastEnteredItemIndex: setLastEnteredItemIndex,
      });
    }

    // If there are ANY children with nestedMenus, then ALL
    // of the children need to know how to close any open nestedMenus
    // and reset the state that controls which nested menu is open.
    if (atLeastOneNestedMenu) {
      additionalPropsAdded = true;


      Object.assign(additionalProps, {
        onMouseMove: (e) => {
          setLastEnteredItemIndex(index);
          if (onMouseMoveChildProp) {
            onMouseMoveChildProp(e);
          }
        },
        // parentMenuLevel: menuLevel,
      });
    }

    // Using a semaphore instead of inspecting addtionalProps
    // directly to avoid performance hits at scale. Might be
    // fine to just do Object.keys(additionalProps).length > 0,
    // but that seems like iterations we can avoid.
    if (additionalPropsAdded) {
      // eslint-disable-next-line consistent-return
      return React.cloneElement(child, {
        ...additionalProps,
      });
    }

    // eslint-disable-next-line consistent-return
    return child;
  });

  return (
    <Popover
      getContentAnchorEl={getContentAnchorEl}
      className={clsx({
        [classes.disablePointerEvents]: nestedMenu
      })}
      classes={PopoverClasses}
      onClose={onClose}
      onEnter={handleEnter}
      onEntering={handleEntering}
      onEntered={handleEntered}
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
        className={clsx(classes.list, MenuListProps.className, {
          [classes.enablePointerEvents]: nestedMenu
        })}
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
   * @ignore
   * Whether or not the menu is a nested menu.
   */
  nestedMenu: PropTypes.bool,
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
  * @ignore
  */
  setParentLastEnteredItemIndex: PropTypes.func,
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
