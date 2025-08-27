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
  DialogTrigger,
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
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useRouter } from 'next/navigation';

export default function ProductVariantsTable({productVariant, product}) {
  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [productFilter, setProductFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortField, setSortField] = useState("sku");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [formData, setFormData] = useState({
    productId: "",
    sku: "",
    price: "",
    cost: "",
    stockQuantity: "",
    stockAlertThreshold: "5",
    isDefault: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Fetch data from APIs
  const fetchVariants = async () => {
    try {
      setLoading(true);
      setVariants(productVariant);
    } catch (error) {
      console.error("Error fetching product variants:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProducts(product);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Sync local state from server props whenever they change
  useEffect(() => {
    fetchVariants();
    fetchProducts();
  }, [productVariant, product]);

  // Filter and sort variants
  const filteredAndSortedVariants = useMemo(() => {
    let filtered = variants.filter(variant => {
      const matchesSearch = variant.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (variant.product?.name && variant.product.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesProduct = productFilter === "all" || variant.productId === productFilter;
      
      let matchesStock = true;
      if (stockFilter === "low") {
        matchesStock = variant.stockQuantity <= variant.stockAlertThreshold;
      } else if (stockFilter === "out") {
        matchesStock = variant.stockQuantity === 0;
      } else if (stockFilter === "in") {
        matchesStock = variant.stockQuantity > variant.stockAlertThreshold;
      }

      return matchesSearch && matchesProduct && matchesStock;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "createdAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortField === "product") {
        aValue = a.product?.name || "";
        bValue = b.product?.name || "";
      }

      if (sortField === "price" || sortField === "cost") {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (sortField === "stockQuantity" || sortField === "stockAlertThreshold") {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [variants, searchTerm, productFilter, stockFilter, sortField, sortDirection]);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.productId) {
      errors.productId = "Product is required";
    }
    
    if (!formData.sku.trim()) {
      errors.sku = "SKU is required";
    }

    // Check for duplicate SKU (excluding current variant when editing)
    const existingVariant = variants.find(variant => 
      variant.sku === formData.sku && 
      (!editingVariant || variant.id !== editingVariant.id)
    );
    if (existingVariant) {
      errors.sku = "This SKU is already taken";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = "Price must be greater than 0";
    }

    if (formData.cost && parseFloat(formData.cost) < 0) {
      errors.cost = "Cost cannot be negative";
    }

    if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
      errors.stockQuantity = "Stock quantity must be 0 or greater";
    }

    if (!formData.stockAlertThreshold || parseInt(formData.stockAlertThreshold) < 0) {
      errors.stockAlertThreshold = "Stock alert threshold must be 0 or greater";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const url = editingVariant ? `/api/product-variants/${editingVariant.id}` : "/api/product-variants";
      const method = editingVariant ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          cost: formData.cost ? parseFloat(formData.cost) : null,
          stockQuantity: parseInt(formData.stockQuantity),
          stockAlertThreshold: parseInt(formData.stockAlertThreshold),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.details || `Failed to ${editingVariant ? "update" : "create"} product variant`;
        throw new Error(errorMessage);
      }

      // Revalidate server data and update props
      router.refresh();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving product variant:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (variantId) => {
    try {
      const response = await fetch(`/api/product-variants/${variantId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product variant");
      }

      // Revalidate server data and update props
      router.refresh();
    } catch (error) {
      console.error("Error deleting product variant:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Handle dialog open/close
  const handleOpenAddDialog = () => {
    setFormData({
      productId: "",
      sku: "",
      price: "",
      cost: "",
      stockQuantity: "",
      stockAlertThreshold: "5",
      isDefault: false
    });
    setFormErrors({});
    setEditingVariant(null);
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (variant) => {
    setFormData({
      productId: variant.productId,
      sku: variant.sku,
      price: variant.price.toString(),
      cost: variant.cost ? variant.cost.toString() : "",
      stockQuantity: variant.stockQuantity.toString(),
      stockAlertThreshold: variant.stockAlertThreshold.toString(),
      isDefault: variant.isDefault
    });
    setFormErrors({});
    setEditingVariant(variant);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingVariant(null);
    setFormData({
      productId: "",
      sku: "",
      price: "",
      cost: "",
      stockQuantity: "",
      stockAlertThreshold: "5",
      isDefault: false
    });
    setFormErrors({});
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStockStatus = (variant) => {
    if (variant.stockQuantity === 0) {
      return { status: "Out of Stock", color: "destructive", icon: XCircle };
    } else if (variant.stockQuantity <= variant.stockAlertThreshold) {
      return { status: "Low Stock", color: "secondary", icon: AlertTriangle };
    } else {
      return { status: "In Stock", color: "default", icon: CheckCircle };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
            <div className="flex space-x-4">
              <Skeleton className="h-10 w-full max-w-sm" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Variants</h1>
          <p className="text-muted-foreground">
            Manage product variants, pricing, and inventory
          </p>
        </div>
        <Button onClick={handleOpenAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by SKU or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="product-filter">Product:</Label>
                <Select value={productFilter} onValueChange={setProductFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="stock-filter">Stock:</Label>
                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stock</SelectItem>
                    <SelectItem value="in">In Stock</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                    <SelectItem value="out">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAndSortedVariants.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No variants found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || productFilter !== "all" || stockFilter !== "all" 
                  ? "Try adjusting your search terms or filters" 
                  : "Get started by adding your first product variant"}
              </p>
              {!searchTerm && productFilter === "all" && stockFilter === "all" && (
                <Button onClick={handleOpenAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variant
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("sku")}
                  >
                    <div className="flex items-center space-x-2">
                      <span>SKU</span>
                      {getSortIcon("sku")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("product")}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Product</span>
                      {getSortIcon("product")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Price</span>
                      {getSortIcon("price")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("cost")}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Cost</span>
                      {getSortIcon("cost")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("stockQuantity")}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Stock</span>
                      {getSortIcon("stockQuantity")}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Created</span>
                      {getSortIcon("createdAt")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedVariants.map((variant) => {
                  const stockStatus = getStockStatus(variant);
                  const StatusIcon = stockStatus.icon;
                  
                  return (
                    <TableRow key={variant.id}>
                      <TableCell>
                        <Badge variant="outline">{variant.sku}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {variant.product?.name || "Unknown Product"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{formatCurrency(variant.price)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {variant.cost ? (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>{formatCurrency(variant.cost)}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{variant.stockQuantity}</span>
                          {variant.stockQuantity <= variant.stockAlertThreshold && (
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <StatusIcon className="h-4 w-4" />
                          <Badge variant={stockStatus.color}>{stockStatus.status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {variant.isDefault ? (
                          <Badge variant="default">Default</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(variant.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEditDialog(variant)}
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
                                <AlertDialogTitle>Delete Product Variant</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete variant "{variant.sku}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(variant.id)}
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
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Variant Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Product Variant</DialogTitle>
            <DialogDescription>
              Create a new variant for a product with pricing and inventory details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productId">Product</Label>
              <Select value={formData.productId} onValueChange={(value) => handleInputChange("productId", value)}>
                <SelectTrigger className={formErrors.productId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.productId && (
                <p className="text-sm text-destructive">{formErrors.productId}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                placeholder="Enter unique SKU"
                className={formErrors.sku ? "border-destructive" : ""}
              />
              {formErrors.sku && (
                <p className="text-sm text-destructive">{formErrors.sku}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  className={formErrors.price ? "border-destructive" : ""}
                />
                {formErrors.price && (
                  <p className="text-sm text-destructive">{formErrors.price}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost (Optional)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost}
                  onChange={(e) => handleInputChange("cost", e.target.value)}
                  placeholder="0.00"
                  className={formErrors.cost ? "border-destructive" : ""}
                />
                {formErrors.cost && (
                  <p className="text-sm text-destructive">{formErrors.cost}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
                  placeholder="0"
                  className={formErrors.stockQuantity ? "border-destructive" : ""}
                />
                {formErrors.stockQuantity && (
                  <p className="text-sm text-destructive">{formErrors.stockQuantity}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stockAlertThreshold">Alert Threshold</Label>
                <Input
                  id="stockAlertThreshold"
                  type="number"
                  min="0"
                  value={formData.stockAlertThreshold}
                  onChange={(e) => handleInputChange("stockAlertThreshold", e.target.value)}
                  placeholder="5"
                  className={formErrors.stockAlertThreshold ? "border-destructive" : ""}
                />
                {formErrors.stockAlertThreshold && (
                  <p className="text-sm text-destructive">{formErrors.stockAlertThreshold}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => handleInputChange("isDefault", e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isDefault">Set as default variant</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Variant"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Variant Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Product Variant</DialogTitle>
            <DialogDescription>
              Update the variant information, pricing, and inventory details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-productId">Product</Label>
              <Select value={formData.productId} onValueChange={(value) => handleInputChange("productId", value)}>
                <SelectTrigger className={formErrors.productId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.productId && (
                <p className="text-sm text-destructive">{formErrors.productId}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sku">SKU</Label>
              <Input
                id="edit-sku"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                placeholder="Enter unique SKU"
                className={formErrors.sku ? "border-destructive" : ""}
              />
              {formErrors.sku && (
                <p className="text-sm text-destructive">{formErrors.sku}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  className={formErrors.price ? "border-destructive" : ""}
                />
                {formErrors.price && (
                  <p className="text-sm text-destructive">{formErrors.price}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cost">Cost (Optional)</Label>
                <Input
                  id="edit-cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost}
                  onChange={(e) => handleInputChange("cost", e.target.value)}
                  placeholder="0.00"
                  className={formErrors.cost ? "border-destructive" : ""}
                />
                {formErrors.cost && (
                  <p className="text-sm text-destructive">{formErrors.cost}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-stockQuantity">Stock Quantity</Label>
                <Input
                  id="edit-stockQuantity"
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
                  placeholder="0"
                  className={formErrors.stockQuantity ? "border-destructive" : ""}
                />
                {formErrors.stockQuantity && (
                  <p className="text-sm text-destructive">{formErrors.stockQuantity}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stockAlertThreshold">Alert Threshold</Label>
                <Input
                  id="edit-stockAlertThreshold"
                  type="number"
                  min="0"
                  value={formData.stockAlertThreshold}
                  onChange={(e) => handleInputChange("stockAlertThreshold", e.target.value)}
                  placeholder="5"
                  className={formErrors.stockAlertThreshold ? "border-destructive" : ""}
                />
                {formErrors.stockAlertThreshold && (
                  <p className="text-sm text-destructive">{formErrors.stockAlertThreshold}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isDefault"
                checked={formData.isDefault}
                onChange={(e) => handleInputChange("isDefault", e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="edit-isDefault">Set as default variant</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Variant"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
