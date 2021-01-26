import * as React from "react";
import { canUseDOM } from "./canUseDOM";

/**
 * `React.useLayoutEffect` that fallbacks to `React.useEffect` on server side
 * rendering.
 */
// eslint-disable-next-line import/prefer-default-export
export const useIsomorphicEffect = !canUseDOM
  ? React.useEffect
  : React.useLayoutEffect;
  