/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import { FooterBlock } from "@/lib/websiteBuilderStore";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface FooterItem {
  id: string;
  title: string;
  content: string;
  address: string;
  phone: string;
  email: string;
}

const Footer = ({ block }: { block: FooterBlock }) => {
  const [open, setOpen] = useState(false);
  const [footerItem, setFooterItem] = useState<FooterItem | null>(null);

  // GET footer item
  useEffect(() => {
    async function getData() {
      try {
        const response = await axiosInstance.get("/api/v1/landing/footer");
        if (response.data.data.footer) {
          setFooterItem(response.data.data.footer);
        }
      } catch (error) {
        console.error("Footer API error:", error);
      }
    }
    getData();
  }, []);

  // UPDATE
  const handleUpdate = async () => {
    if (!footerItem) return;
    try {
      await axiosInstance.post(`/api/v1/landing/footer`, footerItem);
      console.log("Footer item updated");
    } catch (error:any) {
      console.error("Update error:", error.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Footer Item</Label>
        {!footerItem && (
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        )}
      </div>

      {footerItem && (
        <Card className="p-3">
          <div className="space-y-2">

            <Input
              placeholder="Title"
              value={footerItem.title}
              onChange={(e) => setFooterItem({ ...footerItem, title: e.target.value })}
            />
            <Input
              placeholder="Content"
              value={footerItem.content}
              onChange={(e) => setFooterItem({ ...footerItem, content: e.target.value })}
            />
            <Input
              placeholder="Address"
              value={footerItem.address}
              onChange={(e) => setFooterItem({ ...footerItem, address: e.target.value })}
            />
            <Input
              placeholder="Phone"
              value={footerItem.phone}
              onChange={(e) => setFooterItem({ ...footerItem, phone: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={footerItem.email}
              onChange={(e) => setFooterItem({ ...footerItem, email: e.target.value })}
            />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button onClick={handleUpdate}>Update</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Footer;
