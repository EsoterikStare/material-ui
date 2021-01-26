import * as React from "react";
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

function getSubmenuAnchorPoints(event, visibleSubmenu) {
  const { top, right, bottom, left } = visibleSubmenu.getBoundingClientRect();
  // If left is bigger than mouse's clientX, than the submenu is visible on
  // the left side
  const x = left > event.clientX ? left : right;
  return [
    { x, y: top },
    { x, y: bottom },
  ];
}

// eslint-disable-next-line import/prefer-default-export
export function useTransitToSubmenu(menu, htmlOnMouseEnter) {
  const onMouseEnterRef = useLiveRef(htmlOnMouseEnter);
  const enterPointRef = React.useRef(null);
  const submenuTopPointRef = React.useRef(null);
  const submenuBottomPointRef = React.useRef(null);
  const previousClientX = React.useRef(0);
  const previousClientY = React.useRef(0);

  const assignSubmenuAnchorPoints = React.useCallback(
    (event) => {
      if (!menu || !menu.children.length) return;
      submenuTopPointRef.current = null;
      submenuBottomPointRef.current = null;
      const visibleSubmenu = menu.open ? menu : null;
      if (!visibleSubmenu) return;
      [
        submenuTopPointRef.current,
        submenuBottomPointRef.current,
      ] = getSubmenuAnchorPoints(event, visibleSubmenu);
    },
    [menu]
  );

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
      const hasAnchorPoints = () =>
        submenuTopPointRef.current && submenuBottomPointRef.current;
      if (event.type === "mouseleave" && !hasAnchorPoints()) {
        assignSubmenuAnchorPoints(event);
      }
      if (!hasAnchorPoints()) return false;
      return (
        movementX &&
        enterPointRef.current &&
        isPointInTriangle(
          { x: event.clientX, y: event.clientY },
          enterPointRef.current,
          submenuTopPointRef.current,
          submenuBottomPointRef.current
        )
      );
    },
    [assignSubmenuAnchorPoints]
  );

  const onMouseEnter = React.useCallback(
    (event) => {
      onMouseEnterRef.current(event);
      if (event.defaultPrevented) return;
      // If we want to guard against certain menu implementations (e.g. menubar)
      // using this logic, it can be done here.
      enterPointRef.current = { x: event.clientX, y: event.clientY };
      assignSubmenuAnchorPoints(event);
    },
    [assignSubmenuAnchorPoints, onMouseEnterRef]
  );

  return { onMouseEnter, isMouseInTransitToSubmenu };
}