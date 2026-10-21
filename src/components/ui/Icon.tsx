import type { ReactNode } from "react";
const paths: Record<string, ReactNode> = {
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
