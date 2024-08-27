import { Button, ButtonProps } from "./ui/button";

type LoaderButtonType = {
  onClickFunc?: (() => void) | (() => Promise<void>);
  isLoading: boolean;
  className: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
} & ButtonProps;

export default function LoaderButton({
  onClickFunc,
  isLoading,
  className,
  children,
  icon,
  ...props
}: LoaderButtonType) {
  return (
    <Button
      {...props}
      className={`flex gap-2 ${className}`}
      onClick={onClickFunc}
      disabled={isLoading}
    >
      {isLoading ? (
        <svg
          className="animate-spin lucide lucide-loader-circle"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      ) : (
        icon
      )}
      {children}
    </Button>
  );
}
