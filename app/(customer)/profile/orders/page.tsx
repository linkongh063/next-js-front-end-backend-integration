"use client";
import React from "react";
import OrdersList from "@/components/client/OrdersList";

export default function ProfileOrdersPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>
      <OrdersList />
    </div>
  );
}
