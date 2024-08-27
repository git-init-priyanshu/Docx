import { Button, ButtonProps } from "./ui/button";

type HeaderBtnPropType = {
  icon?: React.ReactNode;
  size?: number;
} & ButtonProps;

export default function HeaderBtn({
  icon,
  size,
  children,
  ...props
}: HeaderBtnPropType) {
  return <Button {...props}>{children}</Button>;
}
