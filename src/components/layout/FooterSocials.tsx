interface Props {
  onSelect: () => void;
}
export default function FooterSocials({ onSelect }: Props) {
  return (
    <div className="site-footer-socials" aria-label="Redes sociais">
      <button onClick={onSelect} aria-label="Instagram">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle className="social-fill" cx="17.5" cy="6.7" r="1" />
        </svg>
      </button>
      <button onClick={onSelect} aria-label="YouTube">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            className="social-fill"
            d="M21.5 7.2a3 3 0 0 0-2.1-2.1C17.6 4.6 12 4.6 12 4.6s-5.6 0-7.4.5a3 3 0 0 0-2.1 2.1A31 31 0 0 0 2 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.8.5 7.4.5 7.4.5s5.6 0 7.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.5-4.8Z"
          />
          <path className="social-play" d="m10 8.5 6 3.5-6 3.5Z" />
        </svg>
      </button>
      <button onClick={onSelect} aria-label="Facebook">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            className="social-fill"
            d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.7-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z"
          />
        </svg>
      </button>
    </div>
  );
}
