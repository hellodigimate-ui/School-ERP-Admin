"use client"

import { useWebsiteBuilderStore,  HeroBlock, AboutBlock, ContactBlock, NavbarBlock,FeaturesBlock, TestimonialBlock, ProgramsBlock } from "@/lib/websiteBuilderStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import Faq from "@/components/landing/Faq";
import Footer from "@/components/landing/Footer";


{/*<---------NavBar---------->*/}

interface NavItem {
    id: string;
    name: string;
    route: string;
}

const AddLinkModal = ({
  open,
  setOpen,
  onAdd,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd: (link: NavItem) => void;
}) => {
  const [name, setName] = useState("");
  const [route, setRoute] = useState("");

  if (!open) return null;

  const handleAdd = () => {
    axiosInstance.post("/api/v1/landing/navbaritems", {
      name,
      route,
    })
    .then((response) => {
      console.log("Link added:", response.data);
      const newLink = {
        id: response.data.data.id,
        name,
        route,
      };
      onAdd(newLink);
      setOpen(false);
    })
    .catch((error) => {
      console.error("Error adding link:", error);
    });
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center">
      
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />

      {/* modal */}
      <div className="relative bg-card dark:bg-card rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add Navigation Link</h2>
      

        <div className="space-y-3">
          <Input
            placeholder="Label"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Href"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add</Button>
        </div>
      </div>
    </div>
  );
};

function NavbarEditor({ block }: { block: NavbarBlock }) {
  const { updateBlock } = useWebsiteBuilderStore();
  const [open, setOpen] = useState(false);

  const [menuItems, setMenuItems] = useState<NavItem[]>([]);
  
    useEffect(() => {
      async function getData() {
        try {
          const response = await axiosInstance.get("/api/v1/landing/navbaritems");
          console.log("Navbar data:", response.data);
          setMenuItems(response.data.data);
        } catch (error) {
          console.error("Navbar API error:", error);
        }
      }
  
      getData();
    }, []);
  

  const addLink = (newLink: NavItem) => {
    setMenuItems((prev) => [...prev, newLink]);
    updateBlock(block.id, {
      links: [...block.links,
         {
          id: newLink.id,
          label: newLink.name,
          href: newLink.route,
          },
        ],
    });
  };


  const handleUpdate = async (link: NavItem) => {
  try {
    await axiosInstance.put(
      `/api/v1/landing/navbaritems/${link.id}`,
      {
        name: link.name,
        route: link.route,
      }
    );

    console.log("Link updated");
  } catch (error) {
    console.error("Update error:", error);
  }
};


  const handleDelete = async (id: string) => {
  try {
    await axiosInstance.delete(
      `/api/v1/landing/navbaritems/${id}`
    );

    setMenuItems((prev) =>
      prev.filter((item) => item.id !== id)
    );

    console.log("Link deleted");
  } catch (error) {
    console.error("Delete error:", error);
  }
};

  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Navigation Links</Label>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <div className="space-y-3">
        {menuItems.map((link, index) => (
          <Card key={link.id} className="p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Link {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleDelete(link.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>


              <Input
                placeholder="Label"
                value={link.name}
                onChange={(e) =>
                  setMenuItems((prev) =>
                    prev.map((item) =>
                      item.id === link.id
                        ? { ...item, name: e.target.value }
                        : item
                    ))}/>

              <Input
                placeholder="Href"
                value={link.route}
                onChange={(e) =>
                  setMenuItems((prev) =>
                    prev.map((item) =>
                      item.id === link.id
                        ? { ...item, route: e.target.value }
                        : item
                    ))}/>

            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => handleUpdate(link)}>Update</Button>
            </div>
          </Card>
        ))}
      </div>

      <AddLinkModal open={open} setOpen={setOpen} onAdd={addLink} />
    </div>
  );
}

export function BlockEditor() {
  const { blocks, selectedBlockId,  selectBlock } = useWebsiteBuilderStore();
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  if (!selectedBlock) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full text-muted-foreground">
          <p>Select a block to edit</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg capitalize">{selectedBlock.type} Block</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => selectBlock(null)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="space-y-4">
          {selectedBlock.type === 'hero' && <HeroEditor block={selectedBlock} />}
          {selectedBlock.type === 'about' && <AboutEditor block={selectedBlock} />}
          {selectedBlock.type === 'features' && <FeaturesEditor block={selectedBlock} />}
          {selectedBlock.type === 'contact' && <ContactEditor block={selectedBlock} />}
          {selectedBlock.type === 'navbar' && <NavbarEditor block={selectedBlock} />}
          {selectedBlock.type === 'testimonial' && <TestimonialEditor block={selectedBlock} />}
          {selectedBlock.type === 'faq' && <Faq block={{id: selectedBlock.id, title: selectedBlock.title || '', faqs: selectedBlock.faqs || []}} />}
          {selectedBlock.type === 'footer' && <Footer block={selectedBlock} />}
          {selectedBlock.type === 'programs' && <ProgramEditor block={selectedBlock} />}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

{/*<---------Hero---------->*/}

interface HeroItems {
  id: string;
  title: string;
  content: string;
  cta_text_1?: string;
  cta_link_1?: string;
  cta_text_2?: string;
  cta_link_2?: string;
  backgroundImage?: string;
}

export function HeroEditor({ block }: { block: HeroBlock }) {
  const { updateBlock } = useWebsiteBuilderStore();
  const [heroData, setHeroData] = useState<HeroItems | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHero() {
      try {
        const response = await axiosInstance.get("/api/v1/landing/banner");
        const data = response.data.data;


        setHeroData({
          id: block?.id ?? "1",
          title: data?.title ?? "title",
          content: data?.content ?? "content",
          cta_text_1: data?.cta_text_1 ?? "cta text",
          cta_link_1: data?.cta_link_1 ?? "cta link",
          cta_text_2: data?.cta_text_2 ?? "cta text 2",
          cta_link_2: data?.cta_link_2 ?? "cta link 2",
          backgroundImage: data?.backgroundImage ?? "hello",
        });

        updateBlock(block.id, {
          title: data.title,
          content: data.content,
          cta_text_1: data.cta_text_1,
          cta_link_1: data.cta_link_1,
          cta_text_2: data.cta_text_2,
          cta_link_2: data.cta_link_2,
          backgroundImage: data.backgroundImage,
        });
      } catch (error) {
        console.error("Failed to fetch hero data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHero();
  }, [block.id, updateBlock]);



  type HeroBlockEditableField = 'title' | 'content' | 'cta_text_1' | 'cta_link_1' | 'cta_text_2' | 'cta_link_2' | 'backgroundImage';

  // Map UI field names to block property names
  const heroFieldMap: Record<HeroBlockEditableField, string> = {
    title: 'title',
    content: 'content',
    cta_text_1: 'cta_text_1',
    cta_link_1: 'cta_link_1',
    cta_text_2: 'cta_text_2',
    cta_link_2: 'cta_link_2',
    backgroundImage: 'backgroundImage',
  };

  const handleChange = (field: HeroBlockEditableField, value: string) => {
    if (!heroData) return;
    const updatedHero = { ...heroData, [field]: value };
    setHeroData(updatedHero);
    updateBlock(block.id, { [heroFieldMap[field]]: value });
  };

  const handleSave = () => {
    axiosInstance.post("/api/v1/landing/banner", {
      title: heroData?.title,
      content: heroData?.content,
      cta_text_1: heroData?.cta_text_1,
      cta_link_1: heroData?.cta_link_1,
      cta_text_2: heroData?.cta_text_2,
      cta_link_2: heroData?.cta_link_2,
      backgroundImage: heroData?.backgroundImage,
    })
    .then((response) => {
      console.log("Hero block saved:", response.data);
      updateBlock(block.id, {
        title: response.data.title,
        content: response.data.content,
        cta_text_1: response.data.cta_text_1,
        cta_link_1: response.data.cta_link_1,
        cta_text_2: response.data.cta_text_2,
        cta_link_2: response.data.cta_link_2,
        backgroundImage: response.data.backgroundImage,
      });
    })
    .catch((error) => {
      console.error("Error saving hero block:", error);
    });
  };

  if (loading || !heroData) return <div>Loading Hero Editor...</div>;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="hero-title">Title</Label>
        <Input
          id="hero-title"
          value={heroData?.title??"title"}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hero-subtitle">Subtitle</Label>
        <Textarea
          id="hero-content"
          value={heroData?.content??"content"}
          onChange={(e) => handleChange("content", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hero-cta">CTA Button Text1</Label>
        <Input
          id="hero-cta"
          value={heroData?.cta_text_1??"cta_text_1"}
          onChange={(e) => handleChange("cta_text_1", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hero-link">CTA Link1</Label>
        <Input
          id="hero-link"
          value={heroData?.cta_link_1??"cta_link_1"}
          onChange={(e) => handleChange("cta_link_1", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hero-cta">CTA Button Text2</Label>
        <Input
          id="hero-cta"
          value={heroData?.cta_text_2??"cta_text_1"}
          onChange={(e) => handleChange("cta_text_2", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hero-link">CTA Link2</Label>
        <Input
          id="hero-link"
          value={heroData?.cta_link_2??"cta_link_1"}
          onChange={(e) => handleChange("cta_link_2", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hero-bg">Background Image URL</Label>
        <Input
          id="hero-bg"
          value={heroData.backgroundImage}
          onChange={(e) => handleChange("backgroundImage", e.target.value)}
          placeholder="https://..."
        />
      </div>

      <Button onClick={() => {
        handleSave();
      }}>
        Update
      </Button>
    </div>
  );
}


{/*<---------About---------->*/}

function AboutEditor({ block }: { block: AboutBlock }) {
  const { updateBlock } = useWebsiteBuilderStore();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="about-title">Section Title</Label>
        <Input
          id="about-title"
          value={block.title}
          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="about-desc">Description</Label>
        <Textarea
          id="about-desc"
          value={block.description}
          onChange={(e) => updateBlock(block.id, { description: e.target.value })}
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="about-mission">Mission Statement</Label>
        <Textarea
          id="about-mission"
          value={block.mission}
          onChange={(e) => updateBlock(block.id, { mission: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="about-vision">Vision Statement</Label>
        <Textarea
          id="about-vision"
          value={block.vision}
          onChange={(e) => updateBlock(block.id, { vision: e.target.value })}
        />
      </div>
    </div>
  );
}

{/*<---------Features---------->*/}

interface Feature {
  id: string;
  icon?: string;
  heading: string;
  subheading: string;
};

const AddFeatureModal = ({
  open,
  setOpen,
  onAdd,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd: (feature: Feature) => void;
}) => {
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");

  if (!open) return null;

  const handleAdd = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/v1/landing/features",
        {
          heading,
          subheading,
        }
      );

      const newFeature: Feature = {
        id: response.data.data.id,
        heading,
        subheading,
      };

      onAdd(newFeature);
      setOpen(false);
      setHeading("");
      setSubheading("");
    } catch (error) {
      console.error("Error adding feature:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />

      <div className="relative bg-card dark:bg-card rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          Add Feature
        </h2>

        <div className="space-y-3">
          <Input
            placeholder="Heading"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
          />
          <Textarea
            placeholder="Subheading"
            value={subheading}
            onChange={(e) => setSubheading(e.target.value)}
            rows={3}
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add</Button>
        </div>
      </div>
    </div>
  );
};

function FeaturesEditor({ block }: { block: FeaturesBlock }) {
  const { updateBlock } = useWebsiteBuilderStore();

    const [features, setFeatures] = useState<Feature[]>([]);
  
    useEffect(() => {
      async function getData() {
        try {
          const response = await axiosInstance.get("/api/v1/landing/features");
          console.log("Features data:", response.data);
          setFeatures(response.data.data);
        } catch (error) {
          console.error("Error fetching features:", error);
        }
      }
  
      getData();
    }, []);

  
  


  // const addFeature = () => {
  //   const newFeature = {
  //     id: `f-${Date.now()}`,
  //     icon: 'Star',
  //     title: 'New Feature',
  //     description: 'Feature description',
  //   };
  //   updateBlock(block.id, { features: [...block.features, newFeature] });
  // };



const [open, setOpen] = useState(false);

const addFeature = (feature: Feature) => {
  setFeatures((prev) => [...prev, feature]);

  updateBlock(block.id, {
    features: [
      ...block.features,
      {
        id: feature.id,
        icon: feature.icon || '',
        title: feature.heading,
        description: feature.subheading,
      },
    ],
  });
};

const updateFeature = async (feature: Feature) => {
  try {
    await axiosInstance.put(
      `/api/v1/landing/features/${feature.id}`,
      {
        heading: feature.heading,
        subheading: feature.subheading,
      }
    );

    // update local API state
    setFeatures((prev) =>
      prev.map((f) =>
        f.id === feature.id ? feature : f
      )
    );

    // update builder block state
    updateBlock(block.id, {
      features: block.features.map((f) =>
        f.id === feature.id
          ? {
              ...f,
              heading: feature.heading,
              subheading: feature.subheading,
            }
          : f
      ),
    });

    console.log("Feature updated");
  } catch (error) {
    console.error("Update feature error:", error);
  }
};





  const deleteFeature = async (id: string) => {
  try {
    await axiosInstance.delete(
      `/api/v1/landing/features/${id}`
    );

    // remove from API state
    setFeatures((prev) =>
      prev.filter((feature) => feature.id !== id)
    );

    // remove from builder block
    updateBlock(block.id, {
      features: block.features.filter(
        (f) => f.id !== id
      ),
    });

    console.log("Feature deleted");
  } catch (error) {
    console.error("Delete feature error:", error);
  }
};






  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="features-title">Section Title</Label>
        <Input
          id="features-title"
          value={block.title}
          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
        />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Features</Label>
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
          <AddFeatureModal
            open={open}
            setOpen={setOpen}
            onAdd={addFeature}
          />
        </div>
        
        {features.map((feature, index) => (
          <Card key={feature.id} className="p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Feature {index + 1}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => deleteFeature(feature.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <Input
                placeholder="Title"
                value={feature.heading}
                onChange={(e) => setFeatures((prev) =>
                  prev.map((f) =>
                    f.id === feature.id
                      ? { ...f, heading: e.target.value }
                      : f
                  )
                )}
              />
              <Textarea
                placeholder="Description"
                value={feature.subheading}
                onChange={(e) => setFeatures((prev) =>
                  prev.map((f) =>
                    f.id === feature.id
                      ? { ...f, subheading: e.target.value }
                      : f
                  )
                )}
                rows={2}
              />
              
            </div>
            <div className="mt-6 flex justify-end gap-2">
            <button onClick={() => updateFeature(feature)} className="bg-blue-500 hover:bg-blue-400 cursor-pointer text-white px-4 py-2 rounded-md">Update</button>
          </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

{/*<---------Contact---------->*/}

function ContactEditor({ block }: { block: ContactBlock }) {
  const { updateBlock } = useWebsiteBuilderStore();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contact-title">Section Title</Label>
        <Input
          id="contact-title"
          value={block.title}
          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-address">Address</Label>
        <Textarea
          id="contact-address"
          value={block.address}
          onChange={(e) => updateBlock(block.id, { address: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-phone">Phone</Label>
        <Input
          id="contact-phone"
          value={block.phone}
          onChange={(e) => updateBlock(block.id, { phone: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          value={block.email}
          onChange={(e) => updateBlock(block.id, { email: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-map">Google Maps Embed URL (optional)</Label>
        <Input
          id="contact-map"
          value={block.mapEmbedUrl}
          onChange={(e) => updateBlock(block.id, { mapEmbedUrl: e.target.value })}
          placeholder="https://www.google.com/maps/embed?..."
        />
      </div>
    </div>
  );
}

{/*<---------Testimonial---------->*/}

type Testimonial = {
  id: string;
  name: string;
  role: string;
  feedback: string;
  avatarUrl: string;
};

const AddTestimonialModal = ({
  open,
  setOpen,
  onAdd,}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd: (testimonial: Testimonial) => void;}) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [feedback, setFeedback] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  if (!open) return null;

  const handleAdd = async () => {
    try {
      const payload = {
        name,
        role,
        feedback,
        avatarUrl,
      };

      const response = await axiosInstance.post(
        "/api/v1/landing/testimonials",
        payload
      );

      const newTestimonial: Testimonial = {
        id: response.data.data.id,
        ...payload,
      };

      onAdd(newTestimonial);
      setOpen(false);

      // reset form
      setName("");
      setRole("");
      setFeedback("");
      setAvatarUrl("");
    } catch (error) {
      console.error("Error adding testimonial:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />

      {/* modal */}
      <div className="relative bg-card dark:bg-card rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add Testimonial</h2>

        <div className="space-y-3">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Role / Designation"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <Input
            placeholder="Avatar URL (optional)"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
          <textarea
            className="w-full rounded-md border p-2 text-sm"
            placeholder="Feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            console.log("ADD CLICKED");
            handleAdd();
          }}>Add
          </Button>
        </div>
      </div>
    </div>
  );
};

function TestimonialEditor({ block }: { block: TestimonialBlock }) {
  const { updateBlock } = useWebsiteBuilderStore();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    useEffect(() => {
      async function getData() {
      await axiosInstance.get("/api/v1/landing/testimonials").then((response)=>{
      console.log("Testimonials data:",response.data);
      setTestimonials(response.data.data);
    }).catch((error)=>{
      console.error("Error fetching testimonials data:",error);
    });
  }
     getData();
    }, []);

  


  const [openAddModal, setOpenAddModal] = useState(false);

const handleAddTestimonial = (testimonial: Testimonial) => {
  // update local UI
  setTestimonials((prev) => [...prev, testimonial]);

  // update builder block
  updateBlock(block.id, {
    testimonials: [...block.testimonials, testimonial],
  });
};



//   const addTestimonial = async () => {
//   try {
//     const payload = {
//       name: "New Person",
//       role: "Role",
//       feedback: "Testimonial message",
//       avatarUrl: "",
//     };

//     const response = await axiosInstance.post(
//       "/api/v1/landing/testimonials",
//       payload
//     );

//     console.log("Testimonial added:", response.data);

//     const newTestimonial = {
//       id: response.data.data.id, 
//       ...payload,
//     };

//     // update local list (UI)
//     setTestimonials((prev) => [...prev, newTestimonial]);

//     // update website builder block (if needed)
//     updateBlock(block.id, {
//       testimonials: [...block.testimonials, newTestimonial],
//     });

//   } catch (error) {
//     console.error("Error adding testimonial:", error);
//   }
// };


  const updateTestimonial = (
    testimonialId: string,
     updates: Partial<Testimonial>
  ) => {

    setTestimonials((prev) =>
    prev.map((t) =>
      t.id === testimonialId ? { ...t, ...updates } : t
    )
  );


    updateBlock(block.id, {
      testimonials: block.testimonials.map((t) =>
        t.id === testimonialId ? { ...t, ...updates } : t
      ),
    });
  };


  const handleUpdate = async (testimonial: Testimonial) => {
  try {
    await axiosInstance.put(
      `/api/v1/landing/testimonials/${testimonial.id}`,
      {
        name: testimonial.name,
        role: testimonial.role,
        feedback: testimonial.feedback,
        avatarUrl: testimonial.avatarUrl,
      }
    );

    console.log("Testimonial updated");
  } catch (error) {
    console.error("Update error:", error);
  }
};




  
const removeTestimonial = async (testimonialId: string) => {
  try {
    await axiosInstance.delete(
      `/api/v1/landing/testimonials/${testimonialId}`
    );

    // update UI state
    setTestimonials((prev) =>
      prev.filter((t) => t.id !== testimonialId)
    );

    // update website builder block
    updateBlock(block.id, {
      testimonials: block.testimonials.filter(
        (t) => t.id !== testimonialId
      ),
    });

    console.log("Testimonial deleted");
  } catch (error) {
    console.error("Delete error:", error);
  }
};



  // const removeTestimonial = (testimonialId: string) => {
  //   updateBlock(block.id, {
  //     testimonials: block.testimonials.filter(
  //       (t) => t.id !== testimonialId
  //     ),
  //   });
  // };



  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Label>Testimonials</Label>
        <Button variant="outline" size="sm"  onClick={() => setOpenAddModal(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
        <AddTestimonialModal
          open={openAddModal}
          setOpen={setOpenAddModal}
          onAdd={handleAddTestimonial}
        />
      </div>

      {/* Testimonials List */}
      {testimonials?.map((testimonial, index) => (
        <Card key={testimonial.id} className="p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Testimonial {index + 1}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeTestimonial(testimonial.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            <Input
              placeholder="Name"
              value={testimonial.name}
              onChange={(e) =>
                updateTestimonial(testimonial.id, {
                  name: e.target.value,
                })
              }
            />

            <Input
              placeholder="Role (e.g. Parent, Alumni)"
              value={testimonial.role}
              onChange={(e) =>
                updateTestimonial(testimonial.id, {
                  role: e.target.value,
                })
              }
            />


            


            <Textarea
              placeholder="Testimonial Feedback"
              rows={3}
              value={testimonial.feedback}
              onChange={(e) =>
                updateTestimonial(testimonial.id, {
                  feedback: e.target.value,
                })
              }
            />

            <Input
              placeholder="Avatar Image URL"
              value={testimonial.avatarUrl}
              onChange={(e) =>
                updateTestimonial(testimonial.id, {
                  avatarUrl: e.target.value,
                })
              }
            />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button  onClick={() => handleUpdate(testimonial)} className="bg-blue-500 hover:bg-blue-400 cursor-pointer text-white px-4 py-2 rounded-md">Update</button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ProgramEditor({ block }: { block: ProgramsBlock }) {
  const { updateBlock } = useWebsiteBuilderStore();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="programs-title">Section Title</Label>
        <Input
          id="programs-title"
          value={block.title}
          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
        />
      </div>
    </div>
  );
}