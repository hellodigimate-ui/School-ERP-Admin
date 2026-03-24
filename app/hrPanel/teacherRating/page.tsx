"use client"

import Layout from "@/components/hrPanel/layout";
import { Star } from "lucide-react";

const teachers = [
  { name: "Dr. Anita Roy", subject: "Mathematics", rating: 4.9, reviews: 45, teaching: 5.0, punctuality: 4.8, knowledge: 5.0, communication: 4.7 },
  { name: "Mr. Vikram Das", subject: "Physics", rating: 4.8, reviews: 38, teaching: 4.9, punctuality: 4.7, knowledge: 4.9, communication: 4.6 },
  { name: "Mrs. Priya Nair", subject: "English", rating: 4.7, reviews: 42, teaching: 4.8, punctuality: 4.6, knowledge: 4.7, communication: 4.8 },
  { name: "Mr. Arjun Mehta", subject: "Chemistry", rating: 4.6, reviews: 35, teaching: 4.7, punctuality: 4.5, knowledge: 4.8, communication: 4.4 },
  { name: "Ms. Kavita Joshi", subject: "Biology", rating: 4.5, reviews: 30, teaching: 4.6, punctuality: 4.4, knowledge: 4.6, communication: 4.5 },
  { name: "Mr. Suresh Rao", subject: "History", rating: 4.3, reviews: 28, teaching: 4.4, punctuality: 4.2, knowledge: 4.5, communication: 4.1 },
];

const RatingBar = ({ value, max = 5 }: { value: number; max?: number }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
      <div className="h-full bg-warning rounded-full transition-all" style={{ width: `${(value / max) * 100}%` }} />
    </div>
    <span className="text-xs font-medium text-foreground w-7">{value}</span>
  </div>
);

const Page = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Teacher Ratings</h1>
            <p className="text-sm text-muted-foreground mt-1">Performance ratings based on student & peer feedback</p>
          </div>
        </div>

        <div className="space-y-4">
          {teachers.map((t, i) => (
            <div key={i} className="stat-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-lg">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{t.name}</h3>
                      <p className="text-xs text-muted-foreground">{t.subject} · {t.reviews} reviews</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-warning/10 px-3 py-1.5 rounded-lg">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className="text-lg font-bold text-foreground">{t.rating}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <div><p className="text-xs text-muted-foreground mb-1">Teaching</p><RatingBar value={t.teaching} /></div>
                    <div><p className="text-xs text-muted-foreground mb-1">Punctuality</p><RatingBar value={t.punctuality} /></div>
                    <div><p className="text-xs text-muted-foreground mb-1">Knowledge</p><RatingBar value={t.knowledge} /></div>
                    <div><p className="text-xs text-muted-foreground mb-1">Communication</p><RatingBar value={t.communication} /></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Page;
