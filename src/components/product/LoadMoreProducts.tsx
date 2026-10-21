interface Props {
  loading: boolean;
  hasMore: boolean;
  count: number;
  error?: string;
  onLoadMore: () => void;
}
export default function LoadMoreProducts({
  loading,
  hasMore,
  count,
  error,
  onLoadMore,
}: Props) {
  return (
    <div className="load-more">
      <p className="small-note" role="status" aria-live="polite">
        {loading
          ? "Carregando produtos…"
          : count
            ? `${count} produtos exibidos${hasMore ? "" : " · Você viu todos desta seleção"}`
            : "Nenhum produto encontrado nesta seleção."}
      </p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {(hasMore || error) && (
        <button
          className="btn load-more-button"
          onClick={onLoadMore}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true" /> Carregando…
            </>
          ) : error ? (
            "Tentar novamente"
          ) : (
            "Ver mais"
          )}
        </button>
      )}
    </div>
  );
}
