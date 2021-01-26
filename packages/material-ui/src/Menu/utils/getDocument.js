/**
 * Returns `element.ownerDocument || document`.
 */

// eslint-disable-next-line import/prefer-default-export
export function getDocument(element) {
  return element ? element.ownerDocument || element : document;
}
