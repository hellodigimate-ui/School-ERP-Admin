import { useWebsiteBuilderStore } from "@/lib/websiteBuilderStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Info, Grid3X3, Phone, ChevronUp, ChevronDown, Star, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const blockIcons = {
  hero: Image,
  about: Info,
  features: Grid3X3,
  programs: Grid3X3,
  contact: Phone,
  navbar: Menu,
  testimonial: Star,
  footer: Info,
  faq: Info,
  program: Grid3X3,
};

const blockLabels = {

  navbar: 'Navigation Bar',
  hero: 'Hero Banner',
  about: 'About School',
  features: 'Features',
  programs: 'Programs',
  contact: 'Contact Info',
  testimonial: 'Testimonials',
  footer: 'Footer',
  faq: 'Faq',
  

};

export function BlockList() {
  const { blocks, selectedBlockId, selectBlock, reorderBlocks } = useWebsiteBuilderStore();

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < blocks.length) {
      reorderBlocks(index, newIndex);
    }
  };

  return (
    <Card className="h-scren overflow-hidden ">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Page Sections</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {blocks.map((block, index) => {
          const Icon = blockIcons[block.type];
          const isSelected = selectedBlockId === block.id;

          return (
            <div
              key={block.id}
              className={cn(
                "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              )}
              onClick={() => selectBlock(block.id)}
            >
              <Menu className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Icon className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="flex-1 text-sm font-medium truncate">
                {blockLabels[block.type]}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={index === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    moveBlock(index, 'up');
                  }}
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={index === blocks.length - 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    moveBlock(index, 'down');
                  }}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
