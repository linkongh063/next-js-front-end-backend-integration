"use client";
import React from "react";
import OrdersList from "@/components/client/OrdersList";

export default function OrdersPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>
      <OrdersList />
    </div>
  );
}
