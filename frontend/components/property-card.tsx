import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, CheckCircle } from "lucide-react";

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  duration: string;
  image: string;
  verified: boolean;
}

interface PropertyCardProps {
  property: Property;
  variant?: "grid" | "list";
}

export function PropertyCard({
  property,
  variant = "grid",
}: PropertyCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={property.image || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {property.verified && (
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-foreground">
          {property.title}
        </h3>
        <div className="flex items-center text-muted-foreground mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Clock className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.duration}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <span className="text-2xl font-bold text-primary">
            ${property.price}
          </span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>
      </CardFooter>
    </Card>
  );
}
