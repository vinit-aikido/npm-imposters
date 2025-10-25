import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { codeExamples } from '@/data/codeExamples';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const DatabaseSeeder = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const seedDatabase = async () => {
    setIsSeeding(true);
    setStatus('idle');
    setMessage('');

    try {
      // Check if database already has data
      const { count } = await supabase
        .from('code_examples')
        .select('*', { count: 'exact', head: true });

      if (count && count > 0) {
        setStatus('error');
        setMessage(`Database already contains ${count} examples. Clear the table first if you want to re-seed.`);
        toast.error('Database already seeded');
        setIsSeeding(false);
        return;
      }

      // Convert camelCase to snake_case for database
      const dbRecords = codeExamples.map(example => ({
        id: example.id,
        package_name: example.packageName,
        is_malware: example.isMalware,
        code: example.code,
        explanation: example.explanation,
        severity: example.severity || null,
        cve_id: example.cveId || null,
        npm_url: example.npmUrl,
        weekly_downloads: example.weeklyDownloads,
        last_published: example.lastPublished,
        version: example.version,
        difficulty: example.difficulty,
      }));

      // Insert in batches of 20 to avoid timeouts
      const batchSize = 20;
      for (let i = 0; i < dbRecords.length; i += batchSize) {
        const batch = dbRecords.slice(i, i + batchSize);
        const { error } = await supabase
          .from('code_examples')
          .insert(batch);

        if (error) {
          throw error;
        }

        setMessage(`Seeding... ${Math.min(i + batchSize, dbRecords.length)}/${dbRecords.length}`);
      }

      setStatus('success');
      setMessage(`Successfully seeded ${dbRecords.length} code examples!`);
      toast.success('Database seeded successfully!');
    } catch (error) {
      console.error('Error seeding database:', error);
      setStatus('error');
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error('Failed to seed database');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold">Database Seeder</h3>
          <p className="text-sm text-muted-foreground">
            Populate the database with all 96 code examples
          </p>
        </div>

        <Button
          onClick={seedDatabase}
          disabled={isSeeding}
          className="w-full"
        >
          {isSeeding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isSeeding ? 'Seeding Database...' : 'Seed Database'}
        </Button>

        {message && (
          <div className={`flex items-start gap-2 p-3 rounded-lg ${
            status === 'success' ? 'bg-green-500/10 text-green-500' :
            status === 'error' ? 'bg-red-500/10 text-red-500' :
            'bg-blue-500/10 text-blue-500'
          }`}>
            {status === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
            {status === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
            <p className="text-sm">{message}</p>
          </div>
        )}
      </div>
    </Card>
  );
};