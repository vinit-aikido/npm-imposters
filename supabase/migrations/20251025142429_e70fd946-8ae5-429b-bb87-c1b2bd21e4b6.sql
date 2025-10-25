-- Ensure primary key exists on code_examples.id for proper upserts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   pg_constraint
    WHERE  conrelid = 'public.code_examples'::regclass
    AND    contype = 'p'
  ) THEN
    ALTER TABLE public.code_examples
    ADD CONSTRAINT code_examples_pkey PRIMARY KEY (id);
  END IF;
END
$$;

-- Allow public INSERTs for seeding (data is non-sensitive)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'code_examples'
      AND policyname = 'Public can insert code examples'
  ) THEN
    EXECUTE 'CREATE POLICY "Public can insert code examples" ON public.code_examples FOR INSERT TO anon, authenticated WITH CHECK (true)';
  END IF;
END
$$;

-- Allow public UPDATEs (needed for UPSERT)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'code_examples'
      AND policyname = 'Public can update code examples'
  ) THEN
    EXECUTE 'CREATE POLICY "Public can update code examples" ON public.code_examples FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true)';
  END IF;
END
$$;

-- Optional: keep updated_at fresh on updates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_code_examples_updated_at'
  ) THEN
    CREATE TRIGGER update_code_examples_updated_at
    BEFORE UPDATE ON public.code_examples
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END
$$;