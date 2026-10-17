import Image from "next/image";

type ResponsiveImageProps = {
  id?: string;
  src: string;
  mediumSrc?: string;
  alt: string;
  width: number;
  height: number;
  mediumWidth: number;
  mediumHeight: number;
  className?: string;
  otherProps?: any;
};

export default function ResponsiveImage({
  id,
  src,
  mediumSrc,
  alt,
  width,
  height,
  mediumWidth,
  mediumHeight,
  className,
  ...otherProps
}: ResponsiveImageProps) {
  return (
    <>
      <Image
        id={id}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`block md:hidden ${className}`}
        {...otherProps}
      />
      <Image
        id={id}
        src={mediumSrc || src}
        alt={alt}
        width={mediumWidth}
        height={mediumHeight}
        className={`hidden md:block ${className}`}
        {...otherProps}
      />
    </>
  );
}
