'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Upload, X, Plus } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  initialData?: {
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
  };
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url || null
  );
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    sale_price: initialData?.sale_price || 0,
    category: initialData?.category || '',
    category_id: initialData?.category_id || '',
    brand_id: initialData?.brand_id || '',
    stock_quantity: initialData?.stock_quantity || 0,
    is_featured: initialData?.is_featured || false,
  });

  // Dialog states for adding new category/brand
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [brandDialogOpen, setBrandDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandDescription, setNewBrandDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch categories and brands
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      const [categoriesRes, brandsRes] = await Promise.all([
        supabase.from('categories').select('id, name').eq('is_active', true).order('name'),
        supabase.from('brands').select('id, name').eq('is_active', true).order('name'),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (brandsRes.data) setBrands(brandsRes.data);
    };

    fetchData();
  }, []);

  // Function to add new category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: 'Error',
        description: 'Category name is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const supabase = createClient();
      const slug = newCategoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: newCategoryName.trim(),
          slug: slug,
          description: newCategoryDescription.trim() || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setCategories([...categories, { id: data.id, name: data.name }]);
      setFormData({ ...formData, category_id: data.id });

      toast({
        title: 'Success',
        description: 'Category added successfully',
      });

      // Close dialog and reset
      setCategoryDialogOpen(false);
      setNewCategoryName('');
      setNewCategoryDescription('');
    } catch (error: any) {
      console.error('Error adding category:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add category',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Function to add new brand
  const handleAddBrand = async () => {
    if (!newBrandName.trim()) {
      toast({
        title: 'Error',
        description: 'Brand name is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const supabase = createClient();
      const slug = newBrandName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { data, error } = await supabase
        .from('brands')
        .insert({
          name: newBrandName.trim(),
          slug: slug,
          description: newBrandDescription.trim() || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setBrands([...brands, { id: data.id, name: data.name }]);
      setFormData({ ...formData, brand_id: data.id });

      toast({
        title: 'Success',
        description: 'Brand added successfully',
      });

      // Close dialog and reset
      setBrandDialogOpen(false);
      setNewBrandName('');
      setNewBrandDescription('');
    } catch (error: any) {
      console.error('Error adding brand:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add brand',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await onSubmit(data);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Image Upload */}
      <div className="space-y-4">
        <Label htmlFor="image">Product Image</Label>
        <div className="flex items-start gap-4">
          {imagePreview ? (
            <div className="relative">
              <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-primary/20">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2"
                onClick={() => setImagePreview(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="w-48 h-48 rounded-lg border-2 border-dashed border-primary/20 flex items-center justify-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1">
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Upload a product image (JPG, PNG, WebP)
            </p>
          </div>
        </div>
      </div>

      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={(e) => {
            setFormData({
              ...formData,
              name: e.target.value,
              slug: generateSlug(e.target.value),
            });
          }}
          placeholder="Rose Velvet Evening Bag"
          required
        />
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">URL Slug *</Label>
        <Input
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="rose-velvet-evening-bag"
          required
        />
        <p className="text-sm text-muted-foreground">
          Auto-generated from product name
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Luxurious rose velvet evening bag with gold chain strap..."
          rows={5}
          required
        />
      </div>

      {/* Price & Sale Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Regular Price (NPR) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price || ''}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
            placeholder="2500"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sale_price">Sale Price (NPR)</Label>
          <Input
            id="sale_price"
            name="sale_price"
            type="number"
            step="0.01"
            value={formData.sale_price || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                sale_price: parseFloat(e.target.value) || 0,
              })
            }
            placeholder="1999"
          />
        </div>
      </div>

      {/* Category & Brand */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="category_id">Category *</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1 h-7 text-xs"
              onClick={() => setCategoryDialogOpen(true)}
            >
              <Plus className="h-3 w-3" />
              Add New
            </Button>
          </div>
          <Select
            name="category_id"
            value={formData.category_id}
            onValueChange={(value) =>
              setFormData({ ...formData, category_id: value })
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="brand_id">Brand *</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1 h-7 text-xs"
              onClick={() => setBrandDialogOpen(true)}
            >
              <Plus className="h-3 w-3" />
              Add New
            </Button>
          </div>
          <Select
            name="brand_id"
            value={formData.brand_id}
            onValueChange={(value) =>
              setFormData({ ...formData, brand_id: value })
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stock Quantity */}
      <div className="space-y-2">
        <Label htmlFor="stock_quantity">Stock Quantity *</Label>
        <Input
          id="stock_quantity"
          name="stock_quantity"
          type="number"
          value={formData.stock_quantity || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              stock_quantity: parseInt(e.target.value) || 0,
            })
          }
          placeholder="15"
          required
        />
      </div>

      {/* Featured */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_featured"
          name="is_featured"
          checked={formData.is_featured}
          onChange={(e) =>
            setFormData({ ...formData, is_featured: e.target.checked })
          }
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="is_featured" className="cursor-pointer">
          Feature this product on homepage
        </Label>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>

    {/* Add Category Dialog */}
    <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="new-category-name">Category Name *</Label>
            <Input
              id="new-category-name"
              placeholder="Handbags"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-category-description">Description</Label>
            <Textarea
              id="new-category-description"
              placeholder="Optional description..."
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
              rows={3}
              disabled={isSaving}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setCategoryDialogOpen(false);
              setNewCategoryName('');
              setNewCategoryDescription('');
            }}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleAddCategory} disabled={isSaving}>
            {isSaving ? 'Adding...' : 'Add Category'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Add Brand Dialog */}
    <Dialog open={brandDialogOpen} onOpenChange={setBrandDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Brand</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="new-brand-name">Brand Name *</Label>
            <Input
              id="new-brand-name"
              placeholder="Gucci"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-brand-description">Description</Label>
            <Textarea
              id="new-brand-description"
              placeholder="Optional description..."
              value={newBrandDescription}
              onChange={(e) => setNewBrandDescription(e.target.value)}
              rows={3}
              disabled={isSaving}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setBrandDialogOpen(false);
              setNewBrandName('');
              setNewBrandDescription('');
            }}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleAddBrand} disabled={isSaving}>
            {isSaving ? 'Adding...' : 'Add Brand'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
