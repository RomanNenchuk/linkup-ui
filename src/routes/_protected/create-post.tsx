import type React from "react";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import { PhotoCamera, Close, Send } from "@mui/icons-material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Header from "@/components/auth/Header";
import { createPost } from "@/api/posts";
import { postSchema, type PostFormValues } from "@/schemas/postSchemas";
import UserAvatar from "@/components/auth/UserAvatar";
import { useAuth } from "@/contexts/AuthProvider";

export const Route = createFileRoute("/_protected/create-post")({
  component: CreatePostPage,
});

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const { user } = useAuth();

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

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Header />

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          justifyContent: "center",
          pt: 12,
          px: { xs: 2, sm: 4 },
          pb: 4,
        }}
      >
        <Card sx={{ maxWidth: 600, width: "100%" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Create Post
            </Typography>

            {isError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                Failed to create post. Please try again.
              </Alert>
            )}

            {user && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <UserAvatar id={user.id} size={35} displayName={user.displayName} />
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {user.displayName}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Title Field */}
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Title"
                  placeholder="Enter post title"
                  variant="outlined"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  inputProps={{ maxLength: 100 }}
                  sx={{ mb: 1 }}
                />
              )}
            />

            {/* Character Count for Title */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {titleValue.length}/100
              </Typography>
            </Box>

            {/* Content Field */}
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  label="Content"
                  placeholder="What's on your mind?"
                  variant="outlined"
                  error={!!errors.content}
                  helperText={errors.content?.message}
                  inputProps={{ maxLength: 300 }}
                  sx={{ mb: 1 }}
                />
              )}
            />

            {/* Character Count for Content */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Typography variant="caption" color={contentValue.length > 250 ? "error" : "text.secondary"}>
                {contentValue.length}/300
              </Typography>
            </Box>

            {/* Selected Images */}
            {selectedImages.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Selected Images ({selectedImages.length}/5)
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {selectedImages.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        width: 80,
                        height: 80,
                        borderRadius: 1,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Box
                        component="img"
                        src={URL.createObjectURL(file)}
                        alt={`Selected ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                        sx={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          bgcolor: "rgba(0, 0, 0, 0.6)",
                          color: "white",
                          "&:hover": {
                            bgcolor: "rgba(0, 0, 0, 0.8)",
                          },
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            <Divider sx={{ mb: 3 }} />

            {/* Actions */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image-upload"
                  multiple
                  type="file"
                  onChange={handleImageSelect}
                  disabled={selectedImages.length >= 5}
                />
                <label htmlFor="image-upload">
                  <IconButton color="primary" component="span" disabled={selectedImages.length >= 5}>
                    <PhotoCamera />
                  </IconButton>
                </label>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate({ to: "/" })} disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={isPending} startIcon={<Send />}>
                  {isPending ? "Posting..." : "Post"}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
