import { getSession } from "next-auth/react";
import { PropertyFormData } from "./schemas";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>;
  useAuth?: boolean;
}

export interface PropertyResponse {
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

// Sublease creation data type
export interface SubleaseCreateData {
  title: string;
  description: string;
  rate: number;
  minimum_stay_days: number;
  maximum_stay_days: number;
  available_from: string;
  available_until: string;
  status: string;
  property_id: string;
}

// Sublease response type
export interface SubleaseResponse {
  sublease_id: string;
  title: string;
  description: string;
  rate: number;
  minimum_stay_days: number;
  maximum_stay_days: number;
  available_from: string;
  available_until: string;
  status: string;
  property_id: string;
  lessor_id: string;
  created_at: string;
  updated_at?: string;
  property_images: Array<{
    image_id: string;
    image_url: string;
    image_name: string;
    is_primary: boolean;
    alt_text?: string;
    image_size?: number;
    created_at: string;
  }>;
  lessor?: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    profile_image_url?: string;
    average_rating?: number;
    total_ratings: number;
  };
}

export async function fetchAPI<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { useAuth = false, headers = {}, ...restOptions } = options;
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(url);
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  let finalHeaders: Record<string, string> = {
    ...defaultHeaders,
    ...headers,
  };

  if (useAuth) {
    const session = await getSession();

    if (!session?.user?.access_token) {
      throw new Error("No authentication token available");
    }

    finalHeaders.Authorization = `Bearer ${session.user.access_token}`;
  }

  const config: RequestInit = {
    ...restOptions,
    headers: finalHeaders,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// Property API functions starts here /
export async function createProperty(
  propertyData: PropertyFormData
): Promise<PropertyResponse> {
  const formData = new FormData();

  // Add text fields
  formData.append("title", propertyData.title);
  formData.append("description", propertyData.description);

  if (propertyData.property_type) {
    formData.append("property_type", propertyData.property_type);
  }

  formData.append("address_line1", propertyData.address_line1);

  if (propertyData.address_line2) {
    formData.append("address_line2", propertyData.address_line2);
  }

  formData.append("city", propertyData.city);
  formData.append("state", propertyData.state);
  formData.append("country", propertyData.country);

  if (propertyData.square_feet) {
    formData.append("square_feet", propertyData.square_feet.toString());
  }

  // Add amenities as JSON string
  if (propertyData.amenities && propertyData.amenities.length > 0) {
    formData.append("amenities", JSON.stringify(propertyData.amenities));
  }

  // Add image files
  if (propertyData.images && propertyData.images.length > 0) {
    propertyData.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  const session = await getSession();
  console.log(session);

  if (!session?.user?.access_token) {
    throw new Error("No authentication token available");
  }
  const response = await fetch(`${API_BASE_URL}/api/v1/properties`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.user.access_token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.detail ||
        `API request failed: ${response.status} ${response.statusText}`
    );
  }

  const result = await response.json();
  return result.data;
}

// Fetch all properties
export async function getProperties(): Promise<PropertyResponse[]> {
  try {
    const response = await fetchAPI("/api/v1/properties", {
      method: "GET",
      useAuth: true,
    });

    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
}

// Create a new sublease
export async function createSublease(
  data: SubleaseCreateData
): Promise<SubleaseResponse> {
  try {
    const response = await fetchAPI<SubleaseResponse>("/api/v1/subleases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      useAuth: true,
    });

    return response;
  } catch (error) {
    console.error("Error creating sublease:", error);
    throw error;
  }
}

// Fetch all subleases
export async function getSubleases(): Promise<SubleaseResponse[]> {
  try {
    const response = await fetchAPI("/api/v1/subleases", {
      method: "GET",
      useAuth: true,
    });

    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error("Error fetching subleases:", error);
    throw error;
  }
}

// Message types and interfaces
export interface MessageResponse {
  message_id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  message_type: "text" | "image" | "file";
  created_at: string;
  updated_at: string;
  is_read: boolean;
}

export interface ConversationResponse {
  conversation_id: string;
  user_id: string;
  other_user_id: string;
  other_user_name: string;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface MessageCreateData {
  content: string;
  message_type?: "text" | "image" | "file";
}

// Messages API functions

// Get all conversations for the current user
export async function getConversations(): Promise<ConversationResponse[]> {
  try {
    const response = await fetchAPI("/api/v1/messages/conversations", {
      method: "GET",
      useAuth: true,
    });

    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
}

// Get conversation with a specific user (creates if doesn't exist)
export async function getOrCreateConversation(
  otherUserId: string
): Promise<ConversationResponse> {
  try {
    const response = await fetchAPI<ConversationResponse>(
      `/api/v1/messages/conversations/${otherUserId}`,
      {
        method: "GET",
        useAuth: true,
      }
    );

    return response;
  } catch (error) {
    console.error("Error getting conversation:", error);
    throw error;
  }
}

// Get messages for a specific conversation
export async function getMessages(
  conversationId: string,
  page: number = 1,
  limit: number = 50
): Promise<MessageResponse[]> {
  try {
    const response = await fetchAPI(
      `/api/v1/messages/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
      {
        method: "GET",
        useAuth: true,
      }
    );

    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}

// Send a message
export async function sendMessage(
  conversationId: string,
  data: MessageCreateData
): Promise<MessageResponse> {
  try {
    const response = await fetchAPI<MessageResponse>(
      `/api/v1/messages/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        useAuth: true,
      }
    );

    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

// Mark messages as read
export async function markMessagesAsRead(
  conversationId: string
): Promise<void> {
  try {
    await fetchAPI(`/api/v1/messages/conversations/${conversationId}/read`, {
      method: "POST",
      useAuth: true,
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw error;
  }
}
