import * as React from 'react';
import { useLiveRef } from './useLiveRef';

function getTriangleArea(a, b, c) {
  return Math.abs(
    (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2
  );
}

function isPointInTriangle(point, a, b, c) {
  const A = getTriangleArea(a, b, c);
  const A1 = getTriangleArea(point, b, c);
  const A2 = getTriangleArea(a, point, c);
  const A3 = getTriangleArea(a, b, point);
  return A === A1 + A2 + A3;
}

function getSubmenuAnchorPoints(element, enterPointRef) {
  const { top, right, bottom, left } = element.getBoundingClientRect();
  console.timeEnd('test');
  console.log('getSubmenuAnchorPoints', {top, right, bottom, left, enterPointRef})
  // If left is bigger than mouse's clientX, than the submenu is visible on
  // the left side
  const x = left //> enterPointRef.x ? left : right;
  return [
    { x, y: top },
    { x, y: bottom },
  ];
}

// eslint-disable-next-line import/prefer-default-export
export const useTriangle = (externalHandleEntered = () => {}, enterPointRef) => {
  const handleEnteredRef = React.useRef(externalHandleEntered);
  // console.log('global', { enterPointRef })
  const submenuTopPointRef = React.useRef(null);
  const submenuBottomPointRef = React.useRef(null);
  const previousClientX = React.useRef(0);
  const previousClientY = React.useRef(0);

  const assignSubmenuAnchorPoints = React.useCallback(
    (element) => {
      // if (!subMenuOpen) return;
      submenuTopPointRef.current = null;
      submenuBottomPointRef.current = null;
      if (!element) return;
      console.log('assignSubmenuAnchorPoints', element);
      [
        submenuTopPointRef.current,
        submenuBottomPointRef.current,
      ] = getSubmenuAnchorPoints(element, enterPointRef);
    },
    []
  );
  
  const handleEntered = (element, isAppearing) => {
    handleEnteredRef.current(element, isAppearing);
    assignSubmenuAnchorPoints(element);
  };
  const itemOnMouseEnter = onMouseEnter => event => {
    if (onMouseEnter) onMouseEnter(event);
    if (event.defaultPrevented) return;
    enterPointRef.current = ({ x: event.clientX, y: event.clientY });
    console.log('itemOnMouseEnter', { enterPointRef, x: event.clientX, y: event.clientY })
    console.time('test');
  };

  const isMouseInTransitToSubmenu = React.useCallback(
    (event) => {
      const isMoving =
        previousClientX.current !== event.clientX ||
        previousClientY.current !== event.clientY;
      if (event.isTrusted && !isMoving) {
        // Safari sometimes triggers mousemove without a mouse movement
        return true;
      }
      const movementX = Math.abs(previousClientX.current - event.clientX);
      previousClientX.current = event.clientX;
      previousClientY.current = event.clientY;
      const hasAnchorPoints = () => submenuTopPointRef.current && submenuBottomPointRef.current;
      // if (event.type === "mouseleave" && !hasAnchorPoints()) {
      //   assignSubmenuAnchorPoints(event);
      // }
      if (!hasAnchorPoints()) return false;
      return (
        movementX &&
        enterPointRef &&
        isPointInTriangle(
          { x: event.clientX, y: event.clientY },
          enterPointRef,
          submenuTopPointRef.current,
          submenuBottomPointRef.current
        )
      );
    },
    [enterPointRef]
  );

  return {
    handleEntered,
    isMouseInTransitToSubmenu,
    itemOnMouseEnter
  }
};
