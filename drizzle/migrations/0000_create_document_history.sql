CREATE TABLE public.document_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  receipt_no text,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name text,
  values jsonb NOT NULL DEFAULT '{}',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.document_history TO authenticated;
GRANT ALL ON public.document_history TO service_role;
ALTER TABLE public.document_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read document history" ON public.document_history FOR SELECT TO authenticated USING (public.is_staff_or_above(auth.uid()));
CREATE POLICY "Staff can insert document history" ON public.document_history FOR INSERT TO authenticated WITH CHECK (public.is_staff_or_above(auth.uid()));
CREATE POLICY "Staff can update document history" ON public.document_history FOR UPDATE TO authenticated USING (public.is_staff_or_above(auth.uid()));
CREATE POLICY "Admins can delete document history" ON public.document_history FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));