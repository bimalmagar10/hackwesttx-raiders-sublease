"use client";

import { Header } from "@/components/header";
import { SearchBar } from "@/components/search-bar";
import SubLeaseFilter from "@/components/sub-lease-filter";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  console.log("Session data:", session);
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Search Bar Section - Below Header like Booking.com */}
      <div className="bg-primary py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar variant="hero" />
        </div>
      </div>
      <SubLeaseFilter />
    </div>
  );
}
