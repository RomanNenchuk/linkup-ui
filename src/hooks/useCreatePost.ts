import { createPost } from "@/api/posts";
import { postSchema, type PostFormValues } from "@/schemas/postSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function useCreatePost() {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [location, setLocation] = useState<PostLocation | null>(null);
  const [userCurrentLocation, setUserCurrentLocation] = useState<LocationCoordinates | null>(null);

  const {
    mutate: handleCreatePost,
    isPending,
    isError,
  } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      navigate({ to: "/" });
    },
    onError: (error: any) => {
      console.error("Failed to create post:", error);
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const titleValue = watch("title") || "";
  const contentValue = watch("content") || "";

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages((prev) => [...prev, ...files].slice(0, 5)); // Limit to 5 images
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: PostFormValues) => {
    const formData = new FormData();

    formData.append("Title", data.title);
    if (data.content) formData.append("Content", data.content);

    if (data.latitude) formData.append("Latitude", String(data.latitude));
    if (data.longitude) formData.append("Longitude", String(data.longitude));
    if (data.address) formData.append("Address", data.address);

    selectedImages.forEach((file) => {
      formData.append("PostPhotos", file);
    });

    handleCreatePost(formData);
  };

  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setUserCurrentLocation({ lat: latitude, lng: longitude });
    });
  };

  useEffect(() => {
    requestUserLocation();
  }, []);

  return {
    onSubmit,
    handleSubmit,
    control,
    isPending,
    isError,
    errors,
    titleValue,
    contentValue,
    handleImageSelect,
    handleRemoveImage,
    selectedImages,
    location,
    setLocation,
    userCurrentLocation,
  };
}
