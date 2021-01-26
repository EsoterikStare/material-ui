import * as React from 'react';
import { useIsomorphicEffect } from './useIsomorphicEffect';

/**
 * A `React.Ref` that keeps track of the passed `value`.
 */
// eslint-disable-next-line import/prefer-default-export
export function useLiveRef(value) {
  const ref = React.useRef(value);
  useIsomorphicEffect(() => {
    ref.current = value;
  });
  return ref;
}
