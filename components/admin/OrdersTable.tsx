"use client";

import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export interface OrderItemDTO {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: { name: string } | null;
  variant?: { sku: string } | null;
}

export interface OrderDTO {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  total: number;
  placedAt: string;
  user?: { email: string; name: string | null } | null;
  address?: { fullName: string; phone: string } | null;
  orderItems?: OrderItemDTO[];
}

export function OrdersTable({
  orders,
  total,
  page,
  pageSize,
  statusFilter,
  query,
  basePath,
}: {
  orders: OrderDTO[];
  total: number;
  page: number;
  pageSize: number;
  statusFilter?: string;
  query?: string;
  basePath: string; // e.g. "/dashboard/orders" or "/dashboard/orders/pending"
}) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState(query || "");
  const [statusSel, setStatusSel] = useState<string>(statusFilter || "ALL");
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/orders/admin/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      // Simple approach: refresh the page
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const pageLink = (p: number) => {
    const sp = new URLSearchParams();
    sp.set("page", String(p));
    sp.set("pageSize", String(pageSize));
    if (statusFilter && statusFilter !== "ALL") sp.set("status", statusFilter);
    if (query) sp.set("q", query);
    return `${basePath}?${sp.toString()}`;
  };

  const statusOptions: OrderStatus[] = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
  ];

  const submitFilters = () => {
    const sp = new URLSearchParams();
    sp.set("page", "1");
    sp.set("pageSize", String(pageSize));
    if (statusSel && statusSel !== "ALL") sp.set("status", statusSel);
    if (search) sp.set("q", search);
    router.push(`${basePath}?${sp.toString()}`);
  };

  const statusBadge = (s: OrderStatus) => {
    const color =
      s === "PENDING"
        ? "bg-yellow-100 text-yellow-800"
        : s === "PROCESSING"
        ? "bg-blue-100 text-blue-800"
        : s === "SHIPPED"
        ? "bg-purple-100 text-purple-800"
        : s === "DELIVERED"
        ? "bg-green-100 text-green-800"
        : s === "CANCELLED"
        ? "bg-red-100 text-red-800"
        : "bg-gray-100 text-gray-800";
    return <Badge className={color}>{s}</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search orders (order #, email, name)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[280px]"
          />
          <Button variant="default" onClick={submitFilters}>
            Filter
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusSel} onValueChange={(v) => setStatusSel(v)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={submitFilters}>
            Apply
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.orderNumber}</TableCell>
                <TableCell>{new Date(o.placedAt).toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{o.address?.fullName || o.user?.name || "-"}</span>
                    <span className="text-sm text-muted-foreground">{o.user?.email || "-"}</span>
                  </div>
                </TableCell>
                <TableCell>${Number(o.total).toFixed(2)}</TableCell>
                <TableCell>{statusBadge(o.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Select
                      defaultValue={o.status}
                      onValueChange={(v) => handleStatusChange(o.id, v as OrderStatus)}
                      disabled={updatingId === o.id}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages} • {total} total orders
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" disabled={page <= 1}>
            <a href={pageLink(page - 1)}>Previous</a>
          </Button>
          <Button asChild variant="outline" disabled={page >= totalPages}>
            <a href={pageLink(page + 1)}>Next</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OrdersTable;
