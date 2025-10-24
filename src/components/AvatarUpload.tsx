import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl: string | null;
  onUpload: (filePath: string) => void;
}

export const AvatarUpload = ({ userId, currentAvatarUrl, onUpload }: AvatarUploadProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatarUrl);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setAvatarUrl(currentAvatarUrl);
  }, [currentAvatarUrl]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

      onUpload(publicUrl);
      setAvatarUrl(publicUrl);
      showSuccess('Avatar updated successfully!');
    } catch (error: any) {
      showError(error.message || 'Error uploading avatar.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl ?? undefined} alt="User avatar" />
        <AvatarFallback>
          <User className="h-10 w-10" />
        </AvatarFallback>
      </Avatar>
      <div>
        <Button asChild variant="outline">
          <label htmlFor="avatar-upload">
            {uploading ? 'Uploading...' : 'Upload new avatar'}
          </label>
        </Button>
        <Input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
        <p className="text-sm text-muted-foreground mt-2">PNG, JPG, GIF up to 1MB.</p>
      </div>
    </div>
  );
};