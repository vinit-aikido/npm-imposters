import { DatabaseSeeder } from '@/components/DatabaseSeeder';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const SeedDatabase = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="w-full max-w-md space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <DatabaseSeeder />

        <div className="text-center space-y-2 text-sm text-muted-foreground">
          <p>
            This is a one-time operation to populate the database with code examples.
          </p>
          <p>
            After seeding, the app will fetch data from the database for better performance.
          </p>
        </div>
      </div>
    </div>
  );
};