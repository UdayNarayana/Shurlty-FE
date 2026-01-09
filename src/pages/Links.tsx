import { useEffect, useState } from "react";
import CreateLinkForm from "../components/links/CreateLinkForm/CreateLinkForm";
import LinksTable from "../components/links/LinksTable/LinksTable";
import { getMyLinks, type LinkItem } from "../services/linksService";

export default function Links() {
  const [items, setItems] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyLinks();
      setItems(data);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Failed to load links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 18, display: "grid", gap: 14 }}>
      <CreateLinkForm onCreated={load} />
      <LinksTable items={items} loading={loading} error={error} />
    </div>
  );
}
