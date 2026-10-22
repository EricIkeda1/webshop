import { useState, type ImgHTMLAttributes } from "react";
/** Avoid a broken-image icon when an image outside the snapshot is unavailable. */
export default function ProductImage({
  src,
  alt,
  ...props
}: Omit<ImgHTMLAttributes<HTMLImageElement>, "onError">) {
  const [failedSource, setFailedSource] = useState<string>();
  const failed = failedSource === src;
  return (
    <img
      {...props}
      src={failed ? "/assets/product-unavailable.svg" : src}
      alt={failed ? `${alt ?? "Produto"} — imagem indisponível` : alt}
      onError={() => setFailedSource(src)}
    />
  );
}
