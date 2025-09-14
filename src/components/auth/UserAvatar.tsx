import { Avatar } from "@mui/material";

type UserAvatarProps = {
  id: string;
  displayName: string;
  size?: number;
};

function stringToHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

function stringToInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function UserAvatar({ id, displayName, size = 56 }: UserAvatarProps) {
  const hue = stringToHue(id);
  const color1 = `hsl(${hue}, 70%, 60%)`;
  const color2 = `hsl(${(hue + 40) % 360}, 70%, 70%)`;

  return (
    <Avatar
      sx={{
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        width: size,
        height: size,
        fontSize: size / 2.5,
        fontWeight: 700,
        color: "rgba(0,0,0,0.8)",
        border: "2px solid rgba(0,0,0,0.15)",
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 50%)",
        },
      }}
    >
      {stringToInitials(displayName)}
    </Avatar>
  );
}
