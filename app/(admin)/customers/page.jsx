"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Users,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  RefreshCw,
  X,
  Eye
} from "lucide-react";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import NewCustomerProfileUpload from "@/components/NewCustomerProfileUpload";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "CUSTOMER",
    profilePicture: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Error state management
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const response = await fetch("/api/user");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch customers (${response.status})`);
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError(error.message || "An unexpected error occurred while loading customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = roleFilter === "all" || customer.role === roleFilter;
      
      return matchesSearch && matchesRole;
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
  }, [customers, searchTerm, sortField, sortDirection, roleFilter]);

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
    
    if (!formData.name.trim()) {
      errors.name = "Customer name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Check for duplicate email (excluding current customer when editing)
    const existingCustomer = customers.find(customer => 
      customer.email === formData.email && 
      (!editingCustomer || customer.id !== editingCustomer.id)
    );
    if (existingCustomer) {
      errors.email = "This email is already taken";
    }

    if (!editingCustomer && !formData.password.trim()) {
      errors.password = "Password is required";
    } else if (!editingCustomer && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
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
      const url = editingCustomer ? `/api/user` : "/api/user";
      const method = editingCustomer ? "PUT" : "POST";
      
      const payload = editingCustomer 
        ? { id: editingCustomer.id, name: formData.name, email: formData.email }
        : { ...formData };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Failed to ${editingCustomer ? "update" : "create"} customer (${response.status})`;
        throw new Error(errorMessage);
      }

      await fetchCustomers(); // Refresh the list
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving customer:", error);
      setSubmitError(error.message || "An unexpected error occurred while saving the customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (customerId) => {
    setDeleteError(null); // Clear any previous delete errors
    
    try {
      const response = await fetch(`/api/user`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: customerId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Failed to delete customer (${response.status})`;
        throw new Error(errorMessage);
      }

      await fetchCustomers(); // Refresh the list
    } catch (error) {
      console.error("Error deleting customer:", error);
      setDeleteError(error.message || "An unexpected error occurred while deleting the customer");
    }
  };

  // Handle dialog open/close
  const handleOpenAddDialog = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "CUSTOMER",
      profilePicture: ""
    });
    setFormErrors({});
    setSubmitError(null); // Clear submit errors
    setEditingCustomer(null);
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (customer) => {
    setFormData({
      name: customer.name,
      email: customer.email,
      password: "", // Don't populate password for editing
      phone: customer.phone || "",
      role: customer.role,
      profilePicture: customer.profilePicture || ""
    });
    setFormErrors({});
    setSubmitError(null); // Clear submit errors
    setEditingCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleOpenViewDialog = (customer) => {
    setViewingCustomer(customer);
    setIsViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsViewDialogOpen(false);
    setEditingCustomer(null);
    setViewingCustomer(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "CUSTOMER",
      profilePicture: ""
    });
    setFormErrors({});
    setSubmitError(null); // Clear submit errors
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Handle profile picture update
  const handleProfilePictureUpdate = (newImageUrl) => {
    // Update the customer in the local state
    setCustomers(prev => prev.map(customer =>
      customer.id === (viewingCustomer?.id || editingCustomer?.id)
        ? { ...customer, profilePicture: newImageUrl }
        : customer
    ));
    
    // Update the viewing customer state
    if (viewingCustomer) {
      setViewingCustomer(prev => ({ ...prev, profilePicture: newImageUrl }));
    }
    
    // Update the editing customer state
    if (editingCustomer) {
      setEditingCustomer(prev => ({ ...prev, profilePicture: newImageUrl }));
      // Also update the form data for immediate UI update
      setFormData(prev => ({ ...prev, profilePicture: newImageUrl }));
    }
  };

  // Handle profile picture update for new customer (add modal)
  const handleNewCustomerProfilePictureUpdate = (newImageUrl) => {
    setFormData(prev => ({ ...prev, profilePicture: newImageUrl }));
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
    fetchCustomers();
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "ADMIN": return "destructive";
      case "STAFF": return "secondary";
      case "CUSTOMER": return "default";
      default: return "outline";
    }
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
            <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
              <Skeleton className="h-10 w-full max-w-sm" />
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

  // Show error state with retry option
  if (error && !loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <p className="text-muted-foreground">
              Manage your customer accounts and information
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-destructive">Failed to Load Customers</h3>
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
                  Add Customer
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
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer accounts and information
          </p>
        </div>
        <Button onClick={handleOpenAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
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
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAndSortedCustomers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No customers found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || roleFilter !== "all" 
                  ? "Try adjusting your search terms or filters" 
                  : "Get started by adding your first customer"
                }
              </p>
              {!searchTerm && roleFilter === "all" && (
                <Button onClick={handleOpenAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              )}
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
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Email</span>
                      {getSortIcon("email")}
                    </div>
                  </TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Joined</span>
                      {getSortIcon("createdAt")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={customer.profilePicture || undefined} alt={customer.name} />
                          <AvatarFallback className="text-sm font-medium">
                            {customer.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{customer.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.phone ? (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{customer.phone}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(customer.role)}>
                        {customer.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(customer.createdAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenViewDialog(customer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditDialog(customer)}
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
                              <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{customer.name}"? This action cannot be undone and will remove all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(customer.id)}
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
          )}
        </CardContent>
      </Card>

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          setIsAddDialogOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Create a new customer account with their basic information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Profile Picture Upload Section */}
            <div className="flex flex-col items-center space-y-4 pb-6 border-b">
              <NewCustomerProfileUpload
                currentImage={formData.profilePicture}
                customerName={formData.name || "New Customer"}
                onImageUpdate={handleNewCustomerProfilePictureUpdate}
                onError={(error) => setSubmitError(error)}
              />
              <div className="text-center">
                <h3 className="text-lg font-semibold">{formData.name || "New Customer"}</h3>
                <Badge variant={getRoleBadgeVariant(formData.role)}>
                  {formData.role}
                </Badge>
              </div>
            </div>
            
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter customer name"
                className={formErrors.name ? "border-destructive" : ""}
              />
              {formErrors.name && (
                <p className="text-sm text-destructive">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="customer@example.com"
                className={formErrors.email ? "border-destructive" : ""}
              />
              {formErrors.email && (
                <p className="text-sm text-destructive">{formErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter password"
                className={formErrors.password ? "border-destructive" : ""}
              />
              {formErrors.password && (
                <p className="text-sm text-destructive">{formErrors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Customer"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          setIsEditDialogOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update the customer information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Profile Picture Upload Section */}
            {editingCustomer && (
              <div className="flex flex-col items-center space-y-4 pb-6 border-b">
                <ProfilePictureUpload
                  currentImage={formData.profilePicture}
                  customerName={formData.name}
                  customerId={editingCustomer.id}
                  onImageUpdate={handleProfilePictureUpdate}
                  onError={(error) => setSubmitError(error)}
                />
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{formData.name}</h3>
                  <Badge variant={getRoleBadgeVariant(formData.role)}>
                    {formData.role}
                  </Badge>
                </div>
              </div>
            )}
            
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
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter customer name"
                className={formErrors.name ? "border-destructive" : ""}
              />
              {formErrors.name && (
                <p className="text-sm text-destructive">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="customer@example.com"
                className={formErrors.email ? "border-destructive" : ""}
              />
              {formErrors.email && (
                <p className="text-sm text-destructive">{formErrors.email}</p>
              )}
            </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Customer"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Customer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsViewDialogOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View detailed information about this customer.
            </DialogDescription>
          </DialogHeader>
          {viewingCustomer && (
            <div className="space-y-6">
              {/* Profile Picture Display Section */}
              <div className="flex flex-col items-center space-y-4 pb-6 border-b">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={viewingCustomer.profilePicture || undefined} alt={viewingCustomer.name} />
                  <AvatarFallback className="text-lg font-medium">
                    {viewingCustomer.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{viewingCustomer.name}</h3>
                  <Badge variant={getRoleBadgeVariant(viewingCustomer.role)}>
                    {viewingCustomer.role}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{viewingCustomer.email}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{viewingCustomer.phone || "Not provided"}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(viewingCustomer.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Customer ID</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {viewingCustomer.id}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
