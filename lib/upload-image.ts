import { createClient } from './supabase/client';

export async function uploadProductImage(file: File): Promise<string> {
  const supabase = createClient();
  
  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('product_images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload image');
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product_images')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  const supabase = createClient();
  
  // Extract file path from URL
  const url = new URL(imageUrl);
  const pathParts = url.pathname.split('/');
  const filePath = pathParts.slice(pathParts.indexOf('products')).join('/');

  const { error } = await supabase.storage
    .from('product_images')
    .remove([filePath]);

  if (error) {
    console.error('Delete error:', error);
    throw new Error('Failed to delete image');
  }
}
