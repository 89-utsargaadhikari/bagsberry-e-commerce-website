'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminHeader } from '@/components/admin-header';
import { ProductForm } from '@/components/product-form';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { uploadProductImage, deleteProductImage } from '@/lib/upload-image';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price?: number;
  category: string;
  category_id?: string;
  brand_id?: string;
  stock_quantity: number;
  is_featured: boolean;
  image_url?: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error: any) {
        console.error('Error fetching product:', error);
        toast({
          title: 'Error',
          description: 'Failed to load product',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, toast]);

  const handleSubmit = async (formData: FormData) => {
    if (!product) return;
    
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Handle image upload
      let imageUrl = product.image_url;
      const imageFile = formData.get('image') as File;
      
      if (imageFile && imageFile.size > 0) {
        // Delete old image if it exists and is from Supabase storage
        if (imageUrl && imageUrl.includes('supabase')) {
          try {
            await deleteProductImage(imageUrl);
          } catch (err) {
            console.error('Error deleting old image:', err);
          }
        }
        
        // Upload new image
        imageUrl = await uploadProductImage(imageFile);
      }

      // Prepare updated product data
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
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      };

      // Update product in database
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Product updated successfully',
      });

      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update product',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 w-64 bg-muted rounded" />
              <Card className="p-8 space-y-4">
                <div className="h-48 bg-muted rounded" />
                <div className="h-10 bg-muted rounded" />
                <div className="h-10 bg-muted rounded" />
              </Card>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <AdminHeader />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Product Not Found
            </h1>
            <button
              onClick={() => router.push('/admin/products')}
              className="text-primary hover:underline"
            >
              Back to Products
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
            <p className="mt-2 text-foreground/70">
              Update product information and settings
            </p>
          </div>

          <Card className="p-8">
            <ProductForm
              initialData={product}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </Card>
        </div>
      </main>
    </>
  );
}
