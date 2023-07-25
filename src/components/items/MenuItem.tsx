import { PropsWithChildren } from 'react';
interface Props {
  id: string;
  value: string;
  icon?: React.FunctionComponentElement<
    React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>
  >;
}

export type MenuItemProps = PropsWithChildren<Props>;

export default function MenuItem(props: MenuItemProps) {
  return <></>;
}
