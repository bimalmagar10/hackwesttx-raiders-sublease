import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Home, MapPin, Plus } from "lucide-react";
import { useState } from "react";
import SubleaseForm from "./sublease-form";

interface Property {
  property_id: string;
  title: string;
  description: string;
  property_type?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country: string;
  square_feet?: number;
  amenities?: { [key: string]: string } | string[];
  owner_id: string;
  created_at: string;
  images?: Array<{
    image_id: string;
    image_url: string;
    image_name: string;
    is_primary: boolean;
    alt_text?: string;
    image_size?: number;
    created_at: string;
  }>;
}

interface PropertyCardProps {
  property: Property;
  variant?: "grid" | "list";
}

export function PropertyCard({
  property,
  variant = "grid",
}: PropertyCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get the primary image or first available image
  const primaryImage =
    property.images?.find((img) => img.is_primary) || property.images?.[0];
  const imageUrl = primaryImage
    ? `http://localhost:8000${primaryImage.image_url}`
    : "/placeholder.svg";

  // Format location
  const location = `${property.city}, ${property.state}`;

  // Convert amenities object to array if needed
  const amenitiesArray = Array.isArray(property.amenities)
    ? property.amenities
    : property.amenities
    ? Object.values(property.amenities)
    : [];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {/* <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
          <CheckCircle className="w-3 h-3 mr-1" />
          Available
        </Badge> */}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-foreground">
          {property.title}
        </h3>
        <div className="flex items-center text-muted-foreground mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center text-muted-foreground mb-2">
          <Home className="w-4 h-4 mr-1" />
          <span className="text-sm">
            {property.property_type || "Property"}
          </span>
        </div>
        {property.square_feet && (
          <p className="text-sm text-muted-foreground mb-2">
            {property.square_feet} sq ft
          </p>
        )}
        <p
          className="text-sm text-muted-foreground overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
          }}
        >
          {property.description}
        </p>
        {amenitiesArray.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {amenitiesArray.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {amenitiesArray.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{amenitiesArray.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-muted-foreground">
              {property.address_line1}
            </span>
            <span className="text-sm text-muted-foreground">
              {new Date(property.created_at).toLocaleDateString()}
            </span>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create Sublease
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Sublease for {property.title}</DialogTitle>
              </DialogHeader>
              <SubleaseForm
                propertyId={property.property_id}
                title={`Sublease - ${property.title}`}
                description={`Available for sublease: ${property.description}`}
                onSuccess={() => {
                  setIsDialogOpen(false);
                }}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}
