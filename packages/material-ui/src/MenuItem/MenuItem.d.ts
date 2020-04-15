import { ListItemTypeMap, ListItemProps } from '../ListItem';
import { OverridableComponent, OverrideProps } from '../OverridableComponent';
import { ExtendButtonBase } from '../ButtonBase';
import { MenuProps } from '../Menu';
import { Omit } from '@material-ui/types';

export type MenuItemClassKey = 'root' | 'gutters' | 'selected' | 'dense';

export type MenuItemTypeMap<P = {}, D extends React.ElementType = 'li'> = Omit<
  ListItemTypeMap<P, D>,
  'classKey'
> & {
  classKey: MenuItemClassKey;
  /**
   * `classes` prop applied to the [`ListItem`](/api/list-item/) element.
   */
  ListItemClasses: ListItemProps['classes'];
  props: P & {
    /**
     * Fires when the right arrow key is pressed
     * on a MenuItem that contains nested items
     * and passes focus to the first child of the
     * nested items array
     */
    handleArrowRightKeydown?: React.ReactEventHandler<{}>;
    onKeyDown?: React.KeyboardEventHandler<any>;
    onMouseEnter?: React.MouseEventHandler<any>;
    /**
     * If `true`, opens the nested Menu
     * component passing in nestedItems
     * as the Menu's children
     */
    openNestedMenu?: boolean;
    /**
     * Function passed to nested menus to maintain the last index of an
     * entered child to orchestrate menu open/close states.
     */
    setParentLastEnteredItemIndex?: (index: number) => void;
    /**
     * Menu to display as a sub-menu.
     */
    subMenu?: React.ReactNode;
    /**
     * Normally `Icon`, `SvgIcon`, or a `@material-ui/icons`
     * SVG icon element rendered on a MenuItem that
     * contains a subMenu
     */
    subMenuIcon?: React.ReactNode;
  };
};

/**
 *
 * Demos:
 *
 * - [Menus](https://material-ui.com/components/menus/)
 *
 * API:
 *
 * - [MenuItem API](https://material-ui.com/api/menu-item/)
 * - inherits [ListItem API](https://material-ui.com/api/list-item/)
 */
declare const MenuItem: OverridableComponent<
  MenuItemTypeMap<{ button: false }, MenuItemTypeMap['defaultComponent']>
> &
  ExtendButtonBase<MenuItemTypeMap<{ button?: true }, MenuItemTypeMap['defaultComponent']>>;

export type MenuItemProps<
  D extends React.ElementType = MenuItemTypeMap['defaultComponent'],
  P = {}
> = OverrideProps<MenuItemTypeMap<P, D>, D>;

export default MenuItem;
