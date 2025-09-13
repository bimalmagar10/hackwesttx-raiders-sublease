import {
  Car,
  ChefHat,
  Dumbbell,
  WashingMachine,
  Waves,
  Wifi,
  Settings,
  Heart,
  Home,
  User,
} from "lucide-react";
export const isDevelopmentEnvironment = process.env.NODE_ENV === "development";
export const isProductionEnvironment = process.env.NODE_ENV === "production";

export const featuredProperties = [
  {
    id: 1,
    title: "Modern Studio Near Campus",
    location: "Downtown University District",
    price: 850,
    duration: "1-2 months",
    rating: 4.8,
    reviews: 12,
    image: "/placeholder.svg?height=200&width=300",
    user: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    amenities: ["WiFi", "Furnished", "Parking"],
    available: "Available Now",
    verified: true,
  },
  {
    id: 2,
    title: "Cozy 1BR Apartment",
    location: "Student Housing Complex",
    price: 1200,
    duration: "2-3 months",
    rating: 4.9,
    reviews: 8,
    image: "/placeholder.svg?height=200&width=300",
    user: {
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    amenities: ["Gym", "Pool", "Laundry"],
    available: "Available Dec 15",
    verified: true,
  },
  {
    id: 3,
    title: "Shared Room in House",
    location: "Near State University",
    price: 650,
    duration: "1-4 months",
    rating: 4.6,
    reviews: 15,
    image: "/placeholder.svg?height=200&width=300",
    user: {
      name: "Emma Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    amenities: ["Kitchen", "Garden", "Study Room"],
    available: "Available Now",
    verified: true,
  },
];

export const socialPosts = [
  {
    id: 1,
    user: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      university: "State University",
    },
    timestamp: "2 hours ago",
    content:
      "Looking to sublease my cozy studio apartment near campus! Perfect for someone who needs a quiet place to study. Available from January to March. DM me if interested! 🏠✨",
    property: {
      title: "Modern Studio Near Campus",
      location: "Downtown University District",
      price: 850,
      duration: "1-3 months",
      images: [
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
      ],
      amenities: ["WiFi", "Furnished", "Parking", "Study Desk"],
      available: "Available Now",
    },
    engagement: {
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
    },
  },
  {
    id: 2,
    user: {
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      university: "Tech University",
    },
    timestamp: "5 hours ago",
    content:
      "Spacious 1BR apartment available for sublease! Great for couples or someone who wants extra space. Located in the heart of university district with easy access to campus and downtown. 🌟",
    property: {
      title: "Spacious 1BR Apartment",
      location: "University District",
      price: 1200,
      duration: "2-4 months",
      images: [
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
      ],
      amenities: ["Gym", "Pool", "Laundry", "Balcony"],
      available: "Available Dec 15",
    },
    engagement: {
      likes: 18,
      comments: 12,
      shares: 5,
      isLiked: true,
    },
  },
  {
    id: 3,
    user: {
      name: "Emma Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      university: "Community College",
    },
    timestamp: "1 day ago",
    content:
      "Shared room available in a beautiful house! Looking for a friendly roommate to share this amazing space. Great for students who want a homey environment with a garden view. 🌿",
    property: {
      title: "Shared Room in House",
      location: "Student Housing Complex",
      price: 650,
      duration: "1-6 months",
      images: [
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
      ],
      amenities: ["Kitchen", "Garden", "Study Room", "WiFi"],
      available: "Available Now",
    },
    engagement: {
      likes: 31,
      comments: 15,
      shares: 7,
      isLiked: false,
    },
  },
];

export const amenities = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "parking", label: "Parking", icon: Car },
  { id: "gym", label: "Gym", icon: Dumbbell },
  { id: "pool", label: "Pool", icon: Waves },
  { id: "laundry", label: "Laundry", icon: WashingMachine },
  { id: "kitchen", label: "Kitchen", icon: ChefHat },
];

export const properties = [
  {
    id: 1,
    title: "Modern Studio Near Campus",
    location: "Downtown University District",
    price: 850,
    duration: "1-2 months",
    rating: 4.8,
    reviews: 12,
    image: "/placeholder.svg?height=200&width=300",
    user: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    amenities: ["WiFi", "Furnished", "Parking"],
    available: "Available Now",
  },
  {
    id: 2,
    title: "Cozy 1BR Apartment",
    location: "Student Housing Complex",
    price: 1200,
    duration: "2-3 months",
    rating: 4.9,
    reviews: 8,
    image: "/placeholder.svg?height=200&width=300",
    user: {
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    amenities: ["Gym", "Pool", "Laundry"],
    available: "Available Dec 15",
  },
  {
    id: 3,
    title: "Shared Room in House",
    location: "Near State University",
    price: 650,
    duration: "1-4 months",
    rating: 4.6,
    reviews: 15,
    image: "/placeholder.svg?height=200&width=300",
    user: {
      name: "Emma Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    amenities: ["Kitchen", "Garden", "Study Room"],
    available: "Available Now",
  },
  {
    id: 4,
    title: "Luxury Downtown Loft",
    location: "City Center",
    price: 1800,
    duration: "3-6 months",
    rating: 4.7,
    reviews: 6,
    image: "/placeholder.svg?height=200&width=300",
    user: {
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    amenities: ["Balcony", "Gym", "Concierge"],
    available: "Available Jan 1",
  },
  {
    id: 5,
    title: "Quiet Studio Apartment",
    location: "Residential Area",
    price: 750,
    duration: "1-3 months",
    rating: 4.5,
    reviews: 9,
    image: "/placeholder.svg?height=200&width=300",
    user: {
      name: "Lisa Wang",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    amenities: ["WiFi", "Kitchen", "Parking"],
    available: "Available Now",
  },
  {
    id: 6,
    title: "Spacious 2BR Apartment",
    location: "University Heights",
    price: 1500,
    duration: "2-4 months",
    rating: 4.8,
    reviews: 11,
    image: "/placeholder.svg?height=200&width=300",
    user: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    amenities: ["Balcony", "Dishwasher", "AC"],
    available: "Available Dec 20",
  },
];

export const userStats = {
  totalListings: 3,
  completedStays: 12,
  rating: 4.8,
  responseRate: 95,
  joinDate: "March 2023",
};

export const myListings = [
  {
    id: 1,
    title: "Modern Studio Near Campus",
    location: "Downtown University District",
    price: 850,
    duration: "1-2 months",
    rating: 4.8,
    reviews: 12,
    image: "/placeholder.svg?height=200&width=300",
    user: {
      name: "You",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    amenities: ["WiFi", "Furnished", "Parking"],
    available: "Available Now",
  },
  {
    id: 2,
    title: "Cozy Room in Shared House",
    location: "Student District",
    price: 650,
    duration: "2-4 months",
    rating: 4.6,
    reviews: 8,
    image: "/placeholder.svg?height=200&width=300",
    user: {
      name: "You",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    amenities: ["Kitchen", "Garden", "WiFi"],
    available: "Available Jan 1",
  },
];

export const favoriteListings = [
  {
    id: 3,
    title: "Luxury Downtown Loft",
    location: "City Center",
    price: 1800,
    duration: "3-6 months",
    rating: 4.7,
    reviews: 6,
    image: "/placeholder.svg?height=200&width=300",
    user: {
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    amenities: ["Balcony", "Gym", "Concierge"],
    available: "Available Jan 1",
  },
];

export const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "listings", label: "My Listings", icon: Home },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
];
