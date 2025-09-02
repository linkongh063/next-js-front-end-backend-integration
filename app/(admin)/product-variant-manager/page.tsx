"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

export default function AttributeManager() {
  const [attributes, setAttributes] = useState<any[]>([]);
  const [newAttr, setNewAttr] = useState("");
  const [selectedAttr, setSelectedAttr] = useState<any | null>(null);
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    fetch("/api/attributes")
      .then((res) => res.json())
      .then(setAttributes);
  }, []);

  const addAttribute = async () => {
    if (!newAttr.trim()) return;
    const res = await fetch("/api/attributes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newAttr }),
    });
    if (res.ok) {
      const attr = await res.json();
      setAttributes([...attributes, { ...attr, values: [] }]);
      setNewAttr("");
    }
  };

  const addValue = async () => {
    console.log('selectedAttr', selectedAttr)
    console.log('newValue', newValue)
    if (!selectedAttr || !newValue.trim()) return;
    const res = await fetch(`/api/attributes/${selectedAttr.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: newValue.trim() }),
    });
    if (res.ok) {
      const val = await res.json();
      setAttributes((prev) =>
        prev.map((a) =>
          a.id === selectedAttr.id ? { ...a, values: [...a.values, val] } : a
        )
      );
      setNewValue("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Variant Attributes</h2>

        {/* Add Attribute Modal */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Attribute
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Attribute</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="e.g. Size, Color"
              value={newAttr}
              onChange={(e) => setNewAttr(e.target.value)}
            />
            <DialogFooter>
              <Button onClick={addAttribute}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableCaption>A list of all attributes and values.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Values</TableHead>
            <TableHead className="w-[150px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attributes.map((attr) => (
            <TableRow key={attr.id}>
              <TableCell className="font-medium">{attr.name}</TableCell>
              <TableCell>
                {attr.values?.map((val: any) => (
                  <span
                    key={val.id}
                    className="inline-block bg-gray-100 px-2 py-1 rounded text-sm mr-2"
                  >
                    {val.value}
                  </span>
                ))}
              </TableCell>
              <TableCell className="text-right">
                {/* Add Value Modal */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAttr(attr)}
                    >
                      Add Value
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Add Value to <span className="font-bold">{attr.name}</span>
                      </DialogTitle>
                    </DialogHeader>
                    <Input
                      placeholder={`Enter ${attr.name} value`}
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                    />
                    <DialogFooter>
                      <Button onClick={addValue}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
