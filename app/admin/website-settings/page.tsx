"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { BlockList } from "@/components/website-setting/BlockList";
import { BlockEditor } from "@/components/website-setting/BlockEditor";

import { Button } from "@/components/ui/button";
import { useWebsiteBuilderStore } from "@/lib/websiteBuilderStore";
import { RotateCcw, ExternalLink, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Page = () => {
  const { resetToDefault } = useWebsiteBuilderStore();
  const [showPreview, setShowPreview] = useState(false);

  const handleReset = () => {
    resetToDefault();
    toast({
      title: "Reset Complete",
      description: "Website content has been reset to default.",
    });
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 p-6 rounded-2xl 
                        bg-white/70 backdrop-blur-lg shadow-md border border-white/40">

          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Website Setting
            </h1>
            <p className="text-gray-600 mt-2">
              Customize your school landing page beautifully
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="rounded-xl border-purple-200 hover:bg-purple-50 hover:border-purple-400 transition"
            >
              <RotateCcw className="h-4 w-4 mr-2 text-purple-600" />
              Reset
            </Button>

            <Button
              onClick={handlePreview}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 
                         hover:from-purple-500 hover:to-pink-500 text-white shadow-md transition"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Full Preview
            </Button>
          </div>
        </div>

        {/* Builder Interface */}
        <div className="grid grid-cols-4 gap-6 h-[calc(100vh-16rem)]">

          {/* Left Panel */}
          <div className="col-span-1 h-full rounded-2xl p-5 
                          bg-white/70 backdrop-blur-lg shadow-lg 
                          border border-white/40 overflow-auto 
                          hover:shadow-xl transition">

            <h2 className="text-lg font-semibold mb-4 text-purple-600">
              Blocks
            </h2>
            <BlockList />
          </div>

          {/* Right Panel */}
          <div className="col-span-3 h-full rounded-2xl p-6 
                          bg-white/80 backdrop-blur-lg shadow-lg 
                          border border-white/40 overflow-auto 
                          hover:shadow-xl transition">

            <h2 className="text-lg font-semibold mb-4 text-blue-600">
              Editor
            </h2>
            <BlockEditor />
          </div>
        </div>
      </div>

      {/* ================= PREVIEW MODAL ================= */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col">

          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">
              Website Preview
            </h2>

            <Button
              variant="outline"
              onClick={() => setShowPreview(false)}
              className="rounded-lg"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>

          {/* Iframe */}
          <div className="flex-1 bg-white">
            <iframe
              src="http://localhost:3000" // 👈 Change this to your website URL
              className="w-full h-full border-none"
              title="Website Preview"
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Page;
