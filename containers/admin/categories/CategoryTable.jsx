"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FolderTree,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  RefreshCw,
  X
} from "lucide-react";
import { BASE_URL } from "@/utils/api";
import { useRouter } from 'next/navigation';

export default function CategoryTable({data}) {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]); // Flattened list for parent selection
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentId: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // Error state management
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      setCategories(data);
      
      // Create flattened list for parent selection
      const flattened = flattenCategories(data);
      setAllCategories(flattened);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(error.message || "An unexpected error occurred while loading categories");
    } finally {
      setLoading(false);
    }
  };

  // Flatten categories for easier searching and parent selection
  const flattenCategories = (categories, level = 0) => {
    let flattened = [];
    categories.forEach(category => {
      flattened.push({ ...category, level });
      if (category.children && category.children.length > 0) {
        flattened = flattened.concat(flattenCategories(category.children, level + 1));
      }
    });
    return flattened;
  };

  // Sync local state from server props whenever data changes
  useEffect(() => {
    fetchCategories();
  }, [data]);

  // Filter and sort categories
  const filteredAndSortedCategories = useMemo(() => {
    const flattened = flattenCategories(categories);
    
    let filtered = flattened.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           category.slug.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "createdAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [categories, searchTerm, sortField, sortDirection]);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Category name is required";
    }
    
    if (!formData.slug.trim()) {
      errors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    // Check for duplicate slug (excluding current category when editing)
    const existingCategory = allCategories.find(category => 
      category.slug === formData.slug && 
      (!editingCategory || category.id !== editingCategory.id)
    );
    if (existingCategory) {
      errors.slug = "This slug is already taken";
    }

    // Prevent circular reference (category can't be its own parent)
    if (editingCategory && formData.parentId === editingCategory.id) {
      errors.parentId = "Category cannot be its own parent";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null); // Clear any previous submit errors
    
    try {
      const url = editingCategory ? `${BASE_URL}/category/${editingCategory.id}` : `${BASE_URL}/category`;
      const method = editingCategory ? "PATCH" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId === "none" ? null : formData.parentId || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Failed to ${editingCategory ? "update" : "create"} category (${response.status})`;
        throw new Error(errorMessage);
      }

      // Revalidate server data and update props
      router.refresh();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving category:", error);
      setSubmitError(error.message || "An unexpected error occurred while saving the category");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (categoryId) => {
    setDeleteError(null); // Clear any previous delete errors
    
    try {
      const response = await fetch(`/api/category/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Failed to delete category (${response.status})`;
        throw new Error(errorMessage);
      }

      // Revalidate server data and update props
      router.refresh();
    } catch (error) {
      console.error("Error deleting category:", error);
      setDeleteError(error.message || "An unexpected error occurred while deleting the category");
    }
  };

  // Handle dialog open/close
  const handleOpenAddDialog = () => {
    setFormData({
      name: "",
      slug: "",
      parentId: "none"
    });
    setFormErrors({});
    setSubmitError(null); // Clear submit errors
    setEditingCategory(null);
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      parentId: category.parentId || "none"
    });
    setFormErrors({});
    setSubmitError(null); // Clear submit errors
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      parentId: "none"
    });
    setFormErrors({});
    setSubmitError(null); // Clear submit errors
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug when name changes (only for new categories)
    if (field === "name" && !editingCategory) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Toggle category expansion
  const toggleExpanded = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Render hierarchical category tree
  const renderCategoryTree = (categories, level = 0) => {
    return categories.map((category) => {
      const hasChildren = category.children && category.children.length > 0;
      const isExpanded = expandedCategories.has(category.id);
      
      return (
        <React.Fragment key={category.id}>
          <TableRow className="hover:bg-muted/50">
            <TableCell>
              <div className="flex items-center space-x-2" style={{ paddingLeft: `${level * 20}px` }}>
                {hasChildren ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => toggleExpanded(category.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                ) : (
                  <div className="w-6" />
                )}
                {hasChildren ? (
                  isExpanded ? (
                    <FolderOpen className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Folder className="h-4 w-4 text-blue-600" />
                  )
                ) : (
                  <div className="h-4 w-4 rounded bg-gray-300" />
                )}
                <span className="font-medium">{category.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{category.slug}</Badge>
            </TableCell>
            <TableCell>
              {category.parentId ? (
                <Badge variant="outline">Child Category</Badge>
              ) : (
                <Badge variant="default">Parent Category</Badge>
              )}
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {category.children?.length || 0} children
              </Badge>
            </TableCell>
            <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEditDialog(category)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Category</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{category.name}"? 
                        {hasChildren && " This will also delete all subcategories."}
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(category.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
          {hasChildren && isExpanded && renderCategoryTree(category.children, level + 1)}
        </React.Fragment>
      );
    });
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ?
      <ArrowUp className="h-4 w-4" /> :
      <ArrowDown className="h-4 w-4" />;
  };

  // Error Alert Component
  const ErrorAlert = ({ error, onDismiss, title = "Error" }) => {
    if (!error) return null;
    
    return (
      <div className="mb-6 p-4 border border-destructive/20 bg-destructive/10 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-destructive mb-1">{title}</h3>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive hover:text-destructive/80"
              onClick={onDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  // Retry function for failed operations
  const handleRetry = () => {
    setError(null);
    setDeleteError(null);
    router.refresh();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-10 w-full max-w-sm" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state with retry option
  if (error && !loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">
              Manage your product categories and subcategories
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-destructive">Failed to Load Categories</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {error}
              </p>
              <div className="flex justify-center space-x-4">
                <Button onClick={handleRetry} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={handleOpenAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product categories and subcategories
          </p>
        </div>
        <Button onClick={handleOpenAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Error Alerts */}
      <ErrorAlert
        error={deleteError}
        onDismiss={() => setDeleteError(null)}
        title="Delete Failed"
      />

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {searchTerm ? (
            // Show flat list when searching
            filteredAndSortedCategories.length === 0 ? (
              <div className="text-center py-12">
                <FolderTree className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No categories found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Name</span>
                        {getSortIcon("name")}
                      </div>
                    </TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Children</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2" style={{ paddingLeft: `${category.level * 20}px` }}>
                          <span className="font-medium">{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{category.slug}</Badge>
                      </TableCell>
                      <TableCell>
                        {category.parentId ? (
                          <Badge variant="outline">Child Category</Badge>
                        ) : (
                          <Badge variant="default">Parent Category</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {category.children?.length || 0} children
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEditDialog(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{category.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(category.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )
          ) : (
            // Show hierarchical tree when not searching
            categories.length === 0 ? (
              <div className="text-center py-12">
                <FolderTree className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No categories found</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding your first category
                </p>
                <Button onClick={handleOpenAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category Tree</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Children</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderCategoryTree(categories)}
                </TableBody>
              </Table>
            )
          )}
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          setIsAddDialogOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category for organizing your products.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Submit Error Alert */}
            {submitError && (
              <div className="p-3 border border-destructive/20 bg-destructive/10 rounded-md">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-destructive">{submitError}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 text-destructive hover:text-destructive/80"
                    onClick={() => setSubmitError(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter category name"
                className={formErrors.name ? "border-destructive" : ""}
              />
              {formErrors.name && (
                <p className="text-sm text-destructive">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="category-slug"
                className={formErrors.slug ? "border-destructive" : ""}
              />
              {formErrors.slug && (
                <p className="text-sm text-destructive">{formErrors.slug}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentId">Parent Category (Optional)</Label>
              <Select value={formData.parentId} onValueChange={(value) => handleInputChange("parentId", value)}>
                <SelectTrigger className={formErrors.parentId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No parent (Top-level category)</SelectItem>
                  {allCategories
                    .filter(category => category.level < 2) // Only show categories up to level 1 (2nd level)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {"—".repeat(category.level)} {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {formErrors.parentId && (
                <p className="text-sm text-destructive">{formErrors.parentId}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          setIsEditDialogOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Submit Error Alert */}
            {submitError && (
              <div className="p-3 border border-destructive/20 bg-destructive/10 rounded-md">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-destructive">{submitError}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 text-destructive hover:text-destructive/80"
                    onClick={() => setSubmitError(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter category name"
                className={formErrors.name ? "border-destructive" : ""}
              />
              {formErrors.name && (
                <p className="text-sm text-destructive">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="category-slug"
                className={formErrors.slug ? "border-destructive" : ""}
              />
              {formErrors.slug && (
                <p className="text-sm text-destructive">{formErrors.slug}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-parentId">Parent Category (Optional)</Label>
              <Select value={formData.parentId} onValueChange={(value) => handleInputChange("parentId", value)}>
                <SelectTrigger className={formErrors.parentId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No parent (Top-level category)</SelectItem>
                  {allCategories
                    .filter(category => category.id !== editingCategory?.id && category.level < 2) // Prevent self-selection and limit to level 1
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {"—".repeat(category.level)} {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {formErrors.parentId && (
                <p className="text-sm text-destructive">{formErrors.parentId}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
