"use client";
import React, { useEffect, useState } from "react";

type Address = {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export default function ProfileAddressesPage() {
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/addresses", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load addresses");
      setAddresses(Array.isArray(data?.addresses) ? data.addresses : []);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () => {
    setEditId(null);
    setForm({ fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "", isDefault: false });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let res: Response;
      if (editId) {
        res = await fetch(`/api/addresses/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save address");
      await loadAddresses();
      resetForm();
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (addr: Address) => {
    setEditId(addr.id);
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
      isDefault: addr.isDefault,
    });
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to delete address");
      await loadAddresses();
    } catch (e: any) {
      alert(e?.message || "Something went wrong");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">{editId ? "Edit address" : "Add new address"}</h2>
        {error && <div className="mb-3 p-3 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>}
        <form onSubmit={onSubmit} className="grid gap-3">
          <div>
            <label className="block text-sm mb-1" htmlFor="fullName">Full name</label>
            <input id="fullName" name="fullName" value={form.fullName} onChange={onChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="phone">Phone</label>
            <input id="phone" name="phone" value={form.phone} onChange={onChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="addressLine1">Address line 1</label>
            <input id="addressLine1" name="addressLine1" value={form.addressLine1} onChange={onChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="addressLine2">Address line 2</label>
            <input id="addressLine2" name="addressLine2" value={form.addressLine2} onChange={onChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1" htmlFor="city">City</label>
              <input id="city" name="city" value={form.city} onChange={onChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="state">State</label>
              <input id="state" name="state" value={form.state} onChange={onChange} className="w-full border rounded px-3 py-2" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1" htmlFor="postalCode">Postal code</label>
              <input id="postalCode" name="postalCode" value={form.postalCode} onChange={onChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="country">Country</label>
              <input id="country" name="country" value={form.country} onChange={onChange} className="w-full border rounded px-3 py-2" required />
            </div>
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={onChange} />
            Set as default
          </label>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-black text-white rounded disabled:opacity-60">{saving ? (editId ? "Updating..." : "Saving...") : (editId ? "Update address" : "Save address")}</button>
            {editId && (
              <button type="button" onClick={resetForm} className="px-4 py-2 border rounded">Cancel</button>
            )}
          </div>
        </form>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Your addresses</h2>
        {loading ? (
          <div className="text-sm text-gray-600">Loading addresses...</div>
        ) : addresses.length === 0 ? (
          <div className="text-sm text-gray-600">No addresses yet.</div>
        ) : (
          <div className="divide-y border rounded">
            {addresses.map((addr) => (
              <div key={addr.id} className="p-3 text-sm flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">
                    {addr.fullName} {addr.isDefault && <span className="ml-2 text-xs bg-gray-200 rounded px-2 py-0.5">Default</span>}
                  </div>
                  <div className="text-gray-700">{addr.phone}</div>
                  <div className="text-gray-700">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}</div>
                  <div className="text-gray-700">{addr.city}, {addr.state} {addr.postalCode}</div>
                  <div className="text-gray-700">{addr.country}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 border rounded" onClick={() => onEdit(addr)}>Edit</button>
                  <button className="px-3 py-1 border rounded" onClick={() => onDelete(addr.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
