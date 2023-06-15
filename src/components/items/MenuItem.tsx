import { PropsWithChildren } from 'react';
interface Props {
  id: string;
  value: string;
}

export type MenuItemProps = PropsWithChildren<Props>;

export default function MenuItem(props: MenuItemProps) {
  return <></>;
}
