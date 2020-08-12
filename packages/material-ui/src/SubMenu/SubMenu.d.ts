import { MenuProps } from '@material-ui/core/Menu';

export type SubMenuProps = Omit<MenuProps, 'open'>;

export default function SubMenu(props: SubMenuProps): JSX.Element;
