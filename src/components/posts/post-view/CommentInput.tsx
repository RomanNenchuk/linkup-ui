import { Box, TextField, Button } from "@mui/material";
import UserAvatar from "@/components/auth/UserAvatar";
import { Link } from "@tanstack/react-router";

export default function CommentInput({ user, newComment, setNewComment, onSend, disabled }: any) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        position: "sticky",
        top: 0,
        backgroundColor: "background.default",
        alignItems: "flex-start",
        zIndex: 2,
        py: 3,
      }}
    >
      <Link to="/profile">
        <UserAvatar id={user.id} size={32} displayName={user.displayName} />
      </Link>
      <TextField
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write a comment..."
        size="small"
        fullWidth
        multiline
        minRows={1}
        maxRows={3}
      />
      <Button
        variant="contained"
        disabled={!newComment.trim() || disabled}
        sx={{ textTransform: "none" }}
        onClick={onSend}
      >
        Send
      </Button>
    </Box>
  );
}
