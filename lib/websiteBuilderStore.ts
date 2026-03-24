import { create } from 'zustand';

export interface HeroBlock {
  id: string;
  type: 'hero';
  title: string;
  subtitle: string;
  cta_text_1: string;
  cta_link_1: string;
  cta_text_2: string;
  cta_link_2: string;
  backgroundImage: string;
}

export interface AboutBlock {
  id: string;
  type: 'about';
  title: string;
  description: string;
  mission: string;
  vision: string;
}

export interface NavbarBlock {
  id: string;
  type: 'navbar';
  links: Array<{
    id: string;
    label: string;
    href: string;
  }>;
}

export interface FeaturesBlock {
  id: string;
  type: 'features';
  title: string;
  features: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface ContactBlock {
  id: string;
  type: 'contact';
  title: string;
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
}

export interface FooterBlock {
  id: string;
  type: 'footer';
  title: string;
  content: string;
  address: string;
  phone: string;
  email: string;
}

export interface TestimonialBlock {
  id: string;
  type: 'testimonial';
  title: string;
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    feedback: string;
    avatarUrl: string;
  }>;
}

export interface  FaqBlock {
  title: string;
  id: string;
  type: 'faq';
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
    visibility: boolean;
  }>;
}

export interface ProgramsBlock {
  id: string;
  type: 'programs';
  title: string;
  programs: Array<{
    id: string;
    name: string;
    description: string;
    duration: string;
    imageUrl: string;
  }>;
}

export type WebsiteBlock = NavbarBlock | HeroBlock | AboutBlock | FeaturesBlock | ContactBlock  |  TestimonialBlock | FooterBlock | FaqBlock | ProgramsBlock;

interface WebsiteBuilderState {
  blocks: WebsiteBlock[];
  selectedBlockId: string | null;
  setBlocks: (blocks: WebsiteBlock[]) => void;
  updateBlock: (id: string, updates: Partial<WebsiteBlock>) => void;
  selectBlock: (id: string | null) => void;
  reorderBlocks: (fromIndex: number, toIndex: number) => void;
  resetToDefault: () => void;
}



const defaultBlocks: WebsiteBlock[] = [
  {
    id: 'hero-1',
    type: 'hero',
    title: 'Welcome to Our School',
    subtitle: 'Nurturing minds, building futures. Where every student discovers their potential.',
    cta_text_1: 'Admissions Open',
    cta_link_1: '/admissions',
    cta_text_2: 'Learn More',
    cta_link_2: '/programs',
    backgroundImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80',
  },
  {
    id: 'about-1',
    type: 'about',
    title: 'About Our School',
    description: 'Springfield Academy has been a cornerstone of educational excellence since 1985. Our commitment to holistic development ensures every student thrives.',
    mission: 'To provide world-class education that empowers students to become responsible global citizens.',
    vision: 'To be the leading institution in innovative and inclusive education.',
  },
  {
    id: 'features-1',
    type: 'features',
    title: 'Why Choose Us',
    features: [
      { id: 'f1', icon: 'GraduationCap', title: 'Expert Faculty', description: 'Highly qualified teachers with decades of experience.' },
      { id: 'f2', icon: 'BookOpen', title: 'Modern Curriculum', description: 'Up-to-date syllabus aligned with global standards.' },
      { id: 'f3', icon: 'Users', title: 'Small Class Sizes', description: 'Personalized attention with 20:1 student-teacher ratio.' },
      { id: 'f4', icon: 'Trophy', title: 'Award Winning', description: 'Recognized for academic and extracurricular excellence.' },
    ],
  },
  {
    id: 'contact-1',
    type: 'contact',
    title: 'Contact Us',
    address: 'Digimate lalarpura',
    phone: '+91 98765 43210',
    email: 'hellow@digimate.com',
    mapEmbedUrl: '',
  },
  {
    id: 'navbar-1',
    type: 'navbar',
    links: [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'about', label: 'About', href: '/about' },
      { id: 'programs', label: 'Programs', href: '/programs' },
      { id: 'admissions', label: 'Admissions', href: '/admissions' },
      { id: 'contact', label: 'Contact', href: '/contact' },
    ],
  },

  {
    id: 'testimonial-1',
    type: 'testimonial',
    title: 'What Our Community Says',
    testimonials: [
      {
        id: 't1',
        name: 'Abhishek Jangid',
        role: 'Alumni',
        feedback: 'Springfield Academy provided me with the foundation I needed to succeed in college and beyond.',
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      {
        id: 't2',
        name: 'Prince',
        role: 'Parent',
        feedback: 'The teachers at Springfield Academy truly care about each student\'s growth and success.',
        avatarUrl: 'https://randomuser.me/api/portraits/men/46.jpg',
      },
    ],
  },

  {
    id: 'footer-1',
    type: 'footer',
    title: 'Springfield Academy',
    content: '© 2024 Springfield Academy. All rights reserved.',
    address: 'Digimate lalarpura',
    phone: '+91 98765 43210',
    email: 'info@springfieldacademy.edu'
  },

  {
    id: 'faq-1',
    type: 'faq',
    title: 'Frequently Asked Questions',
    faqs: [
      {
        id: 'q1',
        question: 'What is the admission process?',
        answer: 'Our admission process includes an application form, entrance exam, and interview.',
        visibility: true,
      },
      {
        id: 'q2',
        question: 'What extracurricular activities are offered?',
        answer: 'We offer a variety of clubs and sports including debate, drama, soccer, and more.',
        visibility: true,
      },
    ],
  },
  
  {
    id: 'programs-1',
    type: 'programs',
    title: 'Our Programs',
    programs: [
      {
        id: 'p1',
        name: 'Computer Science',
        description: 'An in-depth program covering programming, algorithms, and software development.',
        duration: '4 years',
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
      },
      {
        id: 'p2',
        name: 'Business Administration',
        description: 'Learn the fundamentals of business, management, and entrepreneurship.',
        duration: '4 years',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
      },
    ],
  },
];

export const useWebsiteBuilderStore = create<WebsiteBuilderState>((set) => ({
  blocks: defaultBlocks,
  selectedBlockId: null,
  setBlocks: (blocks) => set({ blocks }),
  updateBlock: (id, updates) =>
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === id ? { ...block, ...updates } as WebsiteBlock : block
      ),
    })),
  selectBlock: (id) => set({ selectedBlockId: id }),
  reorderBlocks: (fromIndex, toIndex) =>
    set((state) => {
      const blocks = [...state.blocks];
      const [removed] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, removed);
      return { blocks };
    }),
  resetToDefault: () => set({ blocks: defaultBlocks, selectedBlockId: null }),
}));
