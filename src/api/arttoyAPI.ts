/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArtToy } from "@/mainstore";
import { API_V1_URL } from "./baseUrl";

const API_URL = `${API_V1_URL}/arttoy`;

export const getArtToyById = async (id: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch ArtToy");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching ArtToy by ID:", error);
    throw error;
  }
};

export const getArtToys = async (token: string) => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch ArtToys");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching ArtToys:", error);
    throw error;
  }
};

export const createArtToy = async (artToyData: any, token: string) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(artToyData),
    });

    if (!response.ok) {
      throw new Error("Failed to create ArtToy");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating ArtToy:", error);
    throw error;
  }
};

export const deleteArtToy = async (id: string, token?: string) => {
  if (!token) {
    throw new Error("Unauthorized: Token is missing");
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete ArtToy");
    }

    return { message: "ArtToy deleted successfully" };
  } catch (error) {
    console.error("Error deleting ArtToy:", error);
    throw error;
  }
};

export const updateArtToy = async (
  id: string,
  updatedData?: Partial<ArtToy>,
  token?: string,
) => {
  if (!token) {
    throw new Error("Unauthorized: Token is missing");
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update ArtToy");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating ArtToy:", error);
    throw error;
  }
};
