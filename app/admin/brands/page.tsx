'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit, Award } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setBrands(data || []);
    } catch (error: any) {
      console.error('Error fetching brands:', error);
      toast({
        title: 'Error',
        description: 'Failed to load brands',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const supabase = createClient();
      const slug = generateSlug(formData.name);

      if (editingBrand) {
        // Update existing brand
        const { error } = await supabase
          .from('brands')
          .update({
            name: formData.name,
            slug: slug,
            description: formData.description,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingBrand.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Brand updated successfully',
        });
      } else {
        // Create new brand
        const maxOrder = brands.length > 0
          ? Math.max(...brands.map(b => b.display_order))
          : 0;

        const { error } = await supabase
          .from('brands')
          .insert([
            {
              name: formData.name,
              slug: slug,
              description: formData.description,
              display_order: maxOrder + 1,
              is_active: true,
            },
          ]);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Brand created successfully',
        });
      }

      setFormData({ name: '', description: '' });
      setEditingBrand(null);
      setDialogOpen(false);
      fetchBrands();
    } catch (error: any) {
      console.error('Error saving brand:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save brand',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand? Products using this brand will need to be reassigned.')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Brand deleted successfully',
      });
      fetchBrands();
    } catch (error: any) {
      console.error('Error deleting brand:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete brand',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('brands')
        .update({ is_active: !currentState })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Brand ${!currentState ? 'activated' : 'deactivated'}`,
      });
      fetchBrands();
    } catch (error: any) {
      console.error('Error toggling brand:', error);
      toast({
        title: 'Error',
        description: 'Failed to update brand',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingBrand(null);
    setFormData({ name: '', description: '' });
    setDialogOpen(true);
  };

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Award className="h-8 w-8" />
                Brands
              </h1>
              <p className="mt-2 text-foreground/70">
                Manage luxury brands for your products
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Brand
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingBrand ? 'Edit Brand' : 'Create New Brand'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Brand Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Gucci"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Brief description of this brand"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingBrand ? 'Update' : 'Create'} Brand
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="h-20 animate-pulse bg-muted" />
              ))}
            </div>
          ) : brands.length === 0 ? (
            <Card className="p-12 text-center">
              <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No brands yet
              </h3>
              <p className="text-foreground/70 mb-4">
                Create your first brand to organize products
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Brand
              </Button>
            </Card>
          ) : (
            <Card>
              <div className="divide-y">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="p-4 flex items-center justify-between hover:bg-secondary/5 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {brand.name}
                      </h3>
                      {brand.description && (
                        <p className="text-sm text-foreground/60 mt-1">
                          {brand.description}
                        </p>
                      )}
                      <p className="text-xs text-foreground/40 mt-1">
                        Slug: {brand.slug}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={brand.is_active}
                          onCheckedChange={() =>
                            handleToggleActive(brand.id, brand.is_active)
                          }
                        />
                        <span className="text-xs text-foreground/60 w-16">
                          {brand.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(brand)}
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(brand.id)}
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}
