"use client"

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {  Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { useWebsiteBuilderStore } from "@/lib/websiteBuilderStore";


interface FAQ {
  id: string;
  question: string;
  answer: string;
  visibility: boolean;
}

interface AddFAQModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd: (faq: FAQ) => void;
}

export const AddFAQModal = ({ open, setOpen, onAdd }: AddFAQModalProps) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  if (!open) return null;

  const handleAdd = async () => {
    try {
      const response = await axiosInstance.post("/api/v1/landing/faqs", {
        question,
        answer,
      });

      const newFAQ: FAQ = {
        id: response.data.data.id,
        question,
        answer,
        visibility: true,
      };

      onAdd(newFAQ);
      setOpen(false);
      setQuestion("");
      setAnswer("");
    } catch (error) {
      console.error("Error adding FAQ:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add FAQ</h2>
        <div className="space-y-3">
          <Input
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Textarea
            placeholder="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={3}
          />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </div>
      </div>
    </div>
  );
};


interface FAQsEditorProps {
  block: { id: string; title: string; faqs: FAQ[] };
}

 const FAQsEditor = ({ block }: FAQsEditorProps) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [open, setOpen] = useState(false);

    const { updateBlock } = useWebsiteBuilderStore();

  // Fetch FAQs on mount
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/landing/faqs");
        setFaqs(response.data.data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };
    getData();
  }, []);

  const addFAQ = (faq: FAQ) => {
    setFaqs((prev) => [...prev, faq]);
    updateBlock(block.id, { faqs: [...block.faqs, faq] });
  };

  const updateFAQ = async (faq: FAQ) => {
    try {
      await axiosInstance.put(`/api/v1/landing/faqs/${faq.id}`, { visibility: faq.visibility });
      setFaqs((prev) => prev.map((f) => (f.id === faq.id ? faq : f)));
      updateBlock(block.id, {
        faqs: block.faqs.map((f) => (f.id === faq.id ? faq : f)),
      });
    } catch (error) {
      console.error("Update FAQ error:", error);
    }
  };

  const deleteFAQ = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/v1/landing/faqs/${id}`);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      updateBlock(block.id, { faqs: block.faqs.filter((f) => f.id !== id) });
    } catch (error) {
      console.error("Delete FAQ error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          value={block.title}
          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
          placeholder="Section Title"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">FAQs</h3>
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            Add FAQ
          </Button>
          <AddFAQModal open={open} setOpen={setOpen} onAdd={addFAQ} />
        </div>

        {faqs.map((faq, index) => (
          <Card key={faq.id} className="p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">FAQ {index + 1}</span>
              <Button variant="ghost" size="icon" onClick={() => deleteFAQ(faq.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 mt-2">
              <Input
                placeholder="Question"
                value={faq.question}
                onChange={(e) =>
                  setFaqs((prev) =>
                    prev.map((f) => (f.id === faq.id ? { ...f, question: e.target.value } : f))
                  )
                }
              />
              <Textarea
                placeholder="Answer"
                value={faq.answer}
                onChange={(e) =>
                  setFaqs((prev) =>
                    prev.map((f) => (f.id === faq.id ? { ...f, answer: e.target.value } : f))
                  )
                }
                rows={3}
              />
              <div className="flex items-center gap-2">
                <label>
                  <input
                    type="checkbox"
                    checked={faq.visibility}
                    onChange={(e) =>
                      setFaqs((prev) =>
                        prev.map((f) =>
                          f.id === faq.id ? { ...f, visibility: e.target.checked } : f
                        )
                      )
                    }
                  />
                  Visible
                </label>
                <Button size="sm" onClick={() => updateFAQ(faq)}>Update</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FAQsEditor;