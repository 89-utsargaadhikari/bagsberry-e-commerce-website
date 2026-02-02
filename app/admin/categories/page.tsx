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
import { Plus, Trash2, Edit, Tag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
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

      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            slug: slug,
            description: formData.description,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingCategory.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Category updated successfully',
        });
      } else {
        // Create new category
        const maxOrder = categories.length > 0
          ? Math.max(...categories.map(c => c.display_order))
          : 0;

        const { error } = await supabase
          .from('categories')
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
          description: 'Category created successfully',
        });
      }

      setFormData({ name: '', description: '' });
      setEditingCategory(null);
      setDialogOpen(false);
      fetchCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save category',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? Products using this category will need to be reassigned.')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
      fetchCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !currentState })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Category ${!currentState ? 'activated' : 'deactivated'}`,
      });
      fetchCategories();
    } catch (error: any) {
      console.error('Error toggling category:', error);
      toast({
        title: 'Error',
        description: 'Failed to update category',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingCategory(null);
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
                <Tag className="h-8 w-8" />
                Categories
              </h1>
              <p className="mt-2 text-foreground/70">
                Manage product categories for your store
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? 'Edit Category' : 'Create New Category'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Tote Bags"
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
                      placeholder="Brief description of this category"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingCategory ? 'Update' : 'Create'} Category
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
          ) : categories.length === 0 ? (
            <Card className="p-12 text-center">
              <Tag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No categories yet
              </h3>
              <p className="text-foreground/70 mb-4">
                Create your first category to organize products
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </Card>
          ) : (
            <Card>
              <div className="divide-y">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="p-4 flex items-center justify-between hover:bg-secondary/5 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-foreground/60 mt-1">
                          {category.description}
                        </p>
                      )}
                      <p className="text-xs text-foreground/40 mt-1">
                        Slug: {category.slug}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={category.is_active}
                          onCheckedChange={() =>
                            handleToggleActive(category.id, category.is_active)
                          }
                        />
                        <span className="text-xs text-foreground/60 w-16">
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(category)}
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
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
