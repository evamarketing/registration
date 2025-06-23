import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, UserPlus, Database } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AdminSetup = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, makeUserAdmin } = useAuth();

  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await makeUserAdmin(email);
      setEmail('');
    } catch (error) {
      console.error('Error making user admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeSelfAdmin = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      await makeUserAdmin(user.email);
    } catch (error) {
      console.error('Error making self admin:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Shield className="h-5 w-5" />
            Admin Access Setup
          </CardTitle>
          <CardDescription className="text-orange-700">
            Set up admin access for the SEDP system. This is required for first-time setup.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              No admin users found in the system. You need to assign admin role to at least one user to access the admin panel.
            </AlertDescription>
          </Alert>

          {user && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Quick Setup</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Make your current account ({user.email}) an administrator:
                </p>
                <Button 
                  onClick={handleMakeSelfAdmin}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {loading ? 'Setting up...' : 'Make Me Admin'}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-orange-50 px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <form onSubmit={handleMakeAdmin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Make Another User Admin</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="Enter user email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={loading || !email.trim()}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {loading ? 'Assigning...' : 'Assign Admin Role'}
                </Button>
              </form>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">What happens next?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• The selected user will be granted admin privileges</li>
              <li>• They can access the admin panel to manage registrations</li>
              <li>• Admin users can approve/reject applications</li>
              <li>• They can manage categories, announcements, and system settings</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;