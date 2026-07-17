"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function SheltersHeader() {
  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col"
    >
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-foreground font-medium">Shelters</span>
      </nav>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
        Shelter Finder
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        Find emergency shelters with real-time capacity, facilities, and
        directions
      </p>
    </motion.div>
  );
}
