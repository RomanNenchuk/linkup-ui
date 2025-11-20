import { getBorderRadius } from "@/utils/post-card/getBorderRadius";
import { Box, Card, CardContent, Skeleton, useMediaQuery, useTheme } from "@mui/material";

type PostsLoadingProps = {
  cardNumber?: number;
};

export default function PostsLoading({ cardNumber = 3 }: PostsLoadingProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {Array.from({ length: cardNumber }).map((_, index) => (
        <Card
          key={index}
          sx={{
            borderRadius: getBorderRadius(index, cardNumber, isMobile),
            border: 1,
            borderBottom: 0,
            borderColor: "divider",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="20%" />
              </Box>
            </Box>
            <Skeleton variant="text" width="80%" sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
          </CardContent>
        </Card>
      ))}
    </>
  );
}
