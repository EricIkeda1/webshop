import type { ReactNode } from "react";
const paths: Record<string, ReactNode> = {
  close: <path d="m6 6 12 12M18 6 6 18" />,
  chevron: <path d="m9 5 7 7-7 7" />,
  laptop: (
    <>
      <rect x="5" y="3" width="14" height="13" rx="2" />
      <path d="M2 20h20l-3-4H5Z" />
    </>
  ),
  perfume: (
    <>
      <rect x="6" y="8" width="12" height="13" rx="2" />
      <path d="M10 8V3h4v5M10 13h4v4h-4Z" />
    </>
  ),
  shirt: <path d="m8 3-6 4 3 5 3-2v11h8V10l3 2 3-5-6-4a4 4 0 0 1-8 0Z" />,
  tag: (
    <>
      <path d="M3 3h9l9 9-9 9-9-9Z" />
      <circle cx="8" cy="8" r="1" />
    </>
  ),
  box: (
    <>
      <path d="m12 2 9 5v10l-9 5-9-5V7Zm-9 5 9 5 9-5M12 12v10M7 5l10 5" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  logout: <path d="M10 3H4v18h6M9 12h12m-5-5 5 5-5 5" />,
  sort: <path d="M8 3v18m-4-4 4 4 4-4M17 21V3m-4 4 4-4 4 4" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </>
  ),
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
  ),
  bag: (
    <>
      <path d="M5 7h14l1 14H4L5 7Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21v-2a8 8 0 0 1 16 0v2Z" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  home: <path d="m3 10 9-7 9 7v11h-6v-7H9v7H3Z" />,
  truck: (
    <>
      <path d="M2 5h12v12H2ZM14 9h4l4 5v3h-8" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  shield: (
    <>
      <path d="m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6Z" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  card: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="M2 9h20M6 15h4" />
    </>
  ),
  headset: (
    <path d="M3 14v-3a9 9 0 0 1 18 0v3M3 12h4v8H3ZM17 12h4v8h-4M17 22h-5" />
  ),
  trash: <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" />,
  check: <path d="m5 12 4 4L19 6" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
};
export default function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name] ?? paths.bag}
    </svg>
  );
}
