import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CodeExample {
  id: number;
  packageName: string;
  isMalware: boolean;
  code: string;
  explanation: string;
  severity?: 'critical' | 'high' | 'medium';
  cveId?: string;
  npmUrl: string;
  weeklyDownloads: string;
  lastPublished: string;
  version: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const useCodeExamples = () => {
  return useQuery({
    queryKey: ['code-examples'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('code_examples')
        .select('*')
        .order('id');

      if (error) {
        console.error('Error fetching code examples:', error);
        throw error;
      }

      // Map database columns to camelCase for consistency
      return (data || []).map(row => ({
        id: row.id,
        packageName: row.package_name,
        isMalware: row.is_malware,
        code: row.code,
        explanation: row.explanation,
        severity: row.severity as 'critical' | 'high' | 'medium' | undefined,
        cveId: row.cve_id,
        npmUrl: row.npm_url,
        weeklyDownloads: row.weekly_downloads,
        lastPublished: row.last_published,
        version: row.version,
        difficulty: row.difficulty as 'easy' | 'medium' | 'hard',
      })) as CodeExample[];
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
  });
};