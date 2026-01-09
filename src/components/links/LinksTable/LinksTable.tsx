import type { LinkItem } from "../../../services/linksService";

type Props = {
  items: LinkItem[];
  loading?: boolean;
  error?: string | null;
};

const API_BASE:string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

const LinksTable = ({ items, loading, error }: Props) => {
  if (loading) return <div className="card p-3">Loading links…</div>;
  if (error) return <div className="card p-3 text-danger">{error}</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">My Links</h3>
      </div>

      <div className="table-responsive">
        <table className="table table-vcenter card-table">
          <thead>
            <tr>
              <th>Short URL</th>
              <th>Long URL</th>
              <th>Expires</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-secondary">
                  No links yet — create one above.
                </td>
              </tr>
            ) : (
              items.map((l) => (
                <tr key={l.code}>
                  <td className="text-nowrap">
                    <a href={`${API_BASE}/${l.code}`} target="_blank" rel="noreferrer">
                      {`${API_BASE}/${l.code}`}
                    </a>
                  </td>

                  <td style={{ maxWidth: 520 }}>
                    <a href={l.longUrl} target="_blank" rel="noreferrer" className="text-truncate d-inline-block">
                      {l.longUrl}
                    </a>
                  </td>

                  <td className="text-nowrap">
                    {new Date(l.expiresAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LinksTable;