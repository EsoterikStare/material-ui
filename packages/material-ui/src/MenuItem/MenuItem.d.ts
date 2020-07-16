import { Omit } from '@material-ui/types';
import { ListItemTypeMap, ListItemProps } from '../ListItem';
import { OverridableComponent, OverrideProps } from '../OverridableComponent';
import { ExtendButtonBase } from '../ButtonBase';

export type MenuItemClassKey = keyof NonNullable<MenuItemTypeMap['props']['classes']>;

export interface MenuItemTypeMap<P = {}, D extends React.ElementType = 'li'> {
  props: P &
    Omit<ListItemTypeMap<P, D>['props'], 'children'> & {
      /**
       * Menu item contents.
       */
      children?: React.ReactNode;
      /**
       */
      classes?: {
        /** Styles applied to the root element. */
        root?: string;
        /** Styles applied to the root element unless `disableGutters={true}`. */
        gutters?: string;
        /** Styles applied to the root element if `selected={true}`. */
        selected?: string;
        /** Styles applied to the root element if dense. */
        dense?: string;
      };
      /**
       * `classes` prop applied to the [`ListItem`](/api/list-item/) element.
       */
      ListItemClasses?: ListItemProps['classes'];
      handleArrowRightKeydown?: React.ReactEventHandler<{}>;
      handleParentClose?: React.ReactEventHandler<{}>;
      onKeyDown?: React.KeyboardEventHandler<any>;
      onMouseEnter?: React.MouseEventHandler<any>;
      /**
       * When `true`, opens the subMenu, if provided.
       */
      openSubMenu?: boolean;
      setParentOpenSubMenuIndex?: (index: number) => void;
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
  defaultComponent: D;
}

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
