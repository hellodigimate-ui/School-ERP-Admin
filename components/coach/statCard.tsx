"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  subtitle?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  gradient,
  subtitle,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl p-5 shadow-card border border-border hover:shadow-elevated transition-shadow"
    >
      <div className="flex items-start justify-between">
        {/* Left Content */}
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <p className="text-3xl font-bold text-foreground mt-1">
            {value}
          </p>

          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}