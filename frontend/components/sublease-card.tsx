import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Calendar,
  MessageCircle,
  MoreHorizontal,
  DollarSign,
  Star,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL, SubleaseResponse } from "@/lib/api";
import { useRouter } from "next/navigation";

interface SubleaseCardProps {
  sublease: SubleaseResponse;
  currentUserId?: string;
}

export function SubleaseCard({ sublease, currentUserId }: SubleaseCardProps) {
  const router = useRouter();
  const lessorName = sublease.lessor
    ? `${sublease.lessor.first_name} ${sublease.lessor.last_name}`
    : "Unknown";
  const lessorInitials = sublease.lessor
    ? `${sublease.lessor.first_name[0]}${sublease.lessor.last_name[0]}`
    : "UN";

  // Check if this sublease belongs to the current user
  const isMySubLease = currentUserId && sublease.lessor_id === currentUserId;

  // Format dates
  const availableFrom = new Date(sublease.available_from).toLocaleDateString();
  const availableUntil = new Date(
    sublease.available_until
  ).toLocaleDateString();
  const createdAt = new Date(sublease.created_at).toLocaleDateString();

  // Calculate duration in days
  const fromDate = new Date(sublease.available_from);
  const untilDate = new Date(sublease.available_until);
  const durationDays = Math.ceil(
    (untilDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        {/* Post Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={sublease.lessor?.profile_image_url} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {lessorInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {lessorName}
                  </h3>
                  {sublease.lessor?.average_rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {sublease.lessor.average_rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Posted on {createdAt}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-400">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {sublease.title}
            </h2>
            {sublease.description && (
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {sublease.description}
              </p>
            )}
          </div>

          {/* Property Details */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${sublease.rate}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  /month
                </span>
              </div>
              <Badge
                variant={sublease.status === "active" ? "default" : "secondary"}
                className="capitalize"
              >
                {sublease.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {durationDays} days ({sublease.minimum_stay_days}-
                  {sublease.maximum_stay_days || "∞"} days stay)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  Available: {availableFrom} - {availableUntil}
                </span>
              </div>
            </div>

            {/* Property Images */}
            {sublease.property_images.length > 0 && (
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-2">
                  {sublease.property_images.slice(0, 2).map((image, index) => (
                    <div
                      key={image.image_id}
                      className="relative h-48 w-full rounded-lg overflow-hidden"
                    >
                      <Image
                        src={`${API_BASE_URL}${image.image_url}`}
                        alt={image.alt_text || sublease.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                      />
                    </div>
                  ))}
                  {/* If there's only one image, show a placeholder or duplicate */}
                  {sublease.property_images.length === 1 && (
                    <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">
                        No additional image
                      </span>
                    </div>
                  )}
                </div>
                {sublease.property_images.length > 2 && (
                  <div className="flex space-x-2 mt-2">
                    {sublease.property_images.slice(2, 5).map((image) => (
                      <div
                        key={image.image_id}
                        className="relative h-16 w-16 rounded-md overflow-hidden"
                      >
                        <Image
                          src={`${API_BASE_URL}${image.image_url}`}
                          alt={image.alt_text || "Property image"}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    ))}
                    {sublease.property_images.length > 5 && (
                      <div className="h-16 w-16 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                          +{sublease.property_images.length - 5}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Engagement Section */}
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {!isMySubLease && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-blue-500 transition-colors"
                    onClick={() => {
                      router.push(`/messages/${sublease.lessor_id}`);
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Contact</span>
                  </Button>
                </>
              )}
              {isMySubLease && (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled
                  className="text-gray-400 cursor-not-allowed"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Contact</span>
                </Button>
              )}
            </div>
            {!isMySubLease && (
              <Link href={`/subleases/${sublease.sublease_id}`}>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  View Details
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
