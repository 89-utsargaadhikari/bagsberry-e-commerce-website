'use client';

import { useState } from 'react';
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
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface ProductFormProps {
  initialData?: {
    name: string;
    slug: string;
    description: string;
    price: number;
    sale_price?: number;
    category: string;
    stock_quantity: number;
    is_featured: boolean;
    image_url?: string;
  };
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

const categories = [
  'Tote',
  'Crossbody',
  'Shoulder',
  'Clutch',
  'Hobo',
  'Evening Bag',
  'Backpack',
  'Satchel',
];

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
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
    stock_quantity: initialData?.stock_quantity || 0,
    is_featured: initialData?.is_featured || false,
  });

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

      {/* Category & Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            name="category"
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
  );
}
