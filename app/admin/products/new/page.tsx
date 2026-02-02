'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin-header';
import { ProductForm } from '@/components/product-form';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { uploadProductImage } from '@/lib/upload-image';
import { useToast } from '@/hooks/use-toast';

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);

    try {
      const supabase = createClient();

      // Upload image first if provided
      let imageUrl = '';
      const imageFile = formData.get('image') as File;
      if (imageFile && imageFile.size > 0) {
        imageUrl = await uploadProductImage(imageFile);
      }

      // Prepare product data
      const productData = {
        name: formData.get('name') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        sale_price: formData.get('sale_price') ? parseFloat(formData.get('sale_price') as string) : null,
        category: formData.get('category') as string,
        category_id: formData.get('category_id') as string || null,
        brand_id: formData.get('brand_id') as string || null,
        stock_quantity: parseInt(formData.get('stock_quantity') as string),
        is_featured: formData.get('is_featured') === 'on',
        image_url: imageUrl || 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80',
      };

      // Insert product into database
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: 'Success!',
        description: 'Product created successfully',
      });

      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create product',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
            <p className="mt-2 text-foreground/70">
              Create a new product listing for your store
            </p>
          </div>

          <Card className="p-8">
            <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
          </Card>
        </div>
      </main>
    </>
  );
}
