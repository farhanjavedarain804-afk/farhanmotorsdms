import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/apiClient";
import { toast } from "sonner";

export function useTable<T extends Record<string, any>>(table: string, opts: { order?: string; ascending?: boolean } = {}) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    let q: any = supabase.from(table).select("*");
    if (opts.order) q = q.order(opts.order, { ascending: opts.ascending ?? false });
    const { data, error } = await q;
    if (error) toast.error(`Load ${table}: ${error.message || 'Error'}`);
    else setRows((data ?? []) as T[]);
    setLoading(false);
  }, [table, opts.order, opts.ascending]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const insert = async (values: Partial<T>) => {
    const { error } = await supabase.from(table).insert(values);
    if (error) { toast.error(error.message || 'Insert error'); return false; }
    toast.success("Saved successfully");
    await fetchAll();
    return true;
  };

  const update = async (id: string, values: Partial<T>) => {
    const { error } = await supabase.from(table).update(values).eq("id", id);
    if (error) { toast.error(error.message || 'Update error'); return false; }
    toast.success("Updated successfully");
    await fetchAll();
    return true;
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) { toast.error(error.message || 'Delete error'); return false; }
    toast.success("Deleted successfully");
    await fetchAll();
    return true;
  };

  return { rows, loading, insert, update, remove, refresh: fetchAll };
}
