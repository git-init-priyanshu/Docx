import Image, { type StaticImageData } from "next/image";

/**
 * The original two-column auth frame: centered form on the left, illustration
 * on the right. Used by signup / otp / forget-password / reset-password while
 * the signin route runs the new AuthShell design.
 */
export default function LegacyAuthFrame({
  children,
  image,
  imageAlt = "",
}: {
  children: React.ReactNode;
  image: StaticImageData;
  imageAlt?: string;
}) {
  return (
    <div className="w-full h-dvh lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">{children}</div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src={image}
          alt={imageAlt}
          className="h-full w-full dark:brightness-[0.2] dark:grayscale bg-white"
        />
      </div>
    </div>
  );
}
