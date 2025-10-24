import { useSession } from '@/contexts/SessionContext';
import { Navigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { useState, useEffect } from 'react';
import { AvatarUpload } from '@/components/AvatarUpload';

const profileFormSchema = z.object({
  full_name: z.string().min(2, { message: 'Full name must be at least 2 characters.' }).max(50, { message: 'Full name must be 50 characters or less.' }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const { session, loading, user, profile } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({ full_name: profile.full_name || '' });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: data.full_name, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;
      showSuccess('Profile updated successfully!');
    } catch (error: any) {
      showError(error.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarUpload = async (filePath: string) => {
    if (!user) return;
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ avatar_url: filePath, updated_at: new Date().toISOString() })
            .eq('id', user.id);
        if (error) throw error;
    } catch (error: any) {
        showError(error.message || 'Failed to update avatar.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-2xl p-4 md:p-8">
        <header className="my-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
        </header>
        <main>
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update your personal information here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {user && <AvatarUpload userId={user.id} currentAvatarUrl={profile?.avatar_url ?? null} onUpload={handleAvatarUpload} />}
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user?.email ?? ''} disabled />
                </div>
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" {...form.register('full_name')} />
                  {form.formState.errors.full_name && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.full_name.message}</p>
                  )}
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default Profile;