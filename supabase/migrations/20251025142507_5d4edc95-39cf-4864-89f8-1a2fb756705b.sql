-- Tighten RLS to limit public writes strictly to seed range (IDs 1-96)
DROP POLICY IF EXISTS "Public can insert code examples" ON public.code_examples;
CREATE POLICY "Public can insert code examples (seed only)"
ON public.code_examples
FOR INSERT
TO anon, authenticated
WITH CHECK ((id >= 1) AND (id <= 96));

DROP POLICY IF EXISTS "Public can update code examples" ON public.code_examples;
CREATE POLICY "Public can update code examples (seed only)"
ON public.code_examples
FOR UPDATE
TO anon, authenticated
USING ((id >= 1) AND (id <= 96))
WITH CHECK ((id >= 1) AND (id <= 96));