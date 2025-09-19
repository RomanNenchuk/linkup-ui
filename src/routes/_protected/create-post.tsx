import { Box, Card, CardContent, Typography, Alert, Divider } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/auth/Header";
import SelectedImagesList from "@/components/posts/create-post/SelectedImagesList";
import CreatePostActions from "@/components/posts/create-post/CreatePostActions";
import useCreatePost from "@/hooks/useCreatePost";
import UserInfoSection from "@/components/posts/create-post/UserInfoSection";
import TitleField from "@/components/posts/create-post/TitleField";
import ContentField from "@/components/posts/create-post/ContentField";

export const Route = createFileRoute("/_protected/create-post")({
  component: CreatePostPage,
});

export default function CreatePostPage() {
  const {
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
  } = useCreatePost();

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Header />
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 8,
          px: 2,
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
            <UserInfoSection />

            <TitleField control={control} errors={errors} value={titleValue} />
            <ContentField control={control} errors={errors} value={contentValue} />

            {selectedImages.length > 0 && (
              <SelectedImagesList selectedImages={selectedImages} handleRemoveImage={handleRemoveImage} />
            )}

            <Divider sx={{ mb: 3 }} />

            <CreatePostActions
              selectedImages={selectedImages}
              handleImageSelect={handleImageSelect}
              isPending={isPending}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
