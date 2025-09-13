import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  DollarSign,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SocialPostProps {
  post: {
    id: number;
    user: {
      name: string;
      avatar: string;
      verified: boolean;
      university: string;
    };
    timestamp: string;
    content: string;
    property: {
      title: string;
      location: string;
      price: number;
      duration: string;
      images: string[];
      amenities: string[];
      available: string;
    };
    engagement: {
      likes: number;
      comments: number;
      shares: number;
      isLiked: boolean;
    };
  };
}

export function SocialPost({ post }: SocialPostProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        {/* Post Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
                <AvatarFallback>{post.user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {post.user.name}
                  </h3>
                  {post.user.verified && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    >
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>{post.user.university}</span>
                  <span>•</span>
                  <span>{post.timestamp}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-4">
          <p className="text-gray-900 dark:text-gray-100 mb-4">
            {post.content}
          </p>

          {/* Property Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {post.property.title}
                </h4>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{post.property.location}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{post.property.duration}</span>
                  </div>
                  <Badge className="bg-primary text-white">
                    {post.property.available}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-2xl font-bold text-primary">
                  <DollarSign className="h-5 w-5" />
                  {post.property.price}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  per month
                </div>
              </div>
            </div>

            {/* Property Images */}
            {post.property.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                {post.property.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Property ${index + 1}`}
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {index === 3 && post.property.images.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold">
                          +{post.property.images.length - 4} more
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Amenities */}
            <div className="flex flex-wrap gap-2">
              {post.property.amenities.map((amenity) => (
                <Badge
                  key={amenity}
                  variant="secondary"
                  className="bg-primary/10 dark:bg-primary/20 text-primary"
                >
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>{post.engagement.likes} likes</span>
              <span>{post.engagement.comments} comments</span>
            </div>
            <span>{post.engagement.shares} shares</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-2 ${
                  post.engagement.isLiked
                    ? "text-red-500"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${
                    post.engagement.isLiked ? "fill-current" : ""
                  }`}
                />
                <span>Like</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Comment</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
            <Link href={`/property/${post.id}`}>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
