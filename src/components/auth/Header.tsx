import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Link } from "@tanstack/react-router";
import internet from "@/assets/internet.svg";
import AuthButton from "./AuthButton";

type HeaderProps = {
  currentPage?: string;
};

export default function Header({ currentPage }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    { label: "Analytics", href: "/analytics" },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          userSelect: "none",
        }}
      >
        <Box component="img" src={internet} height="35px" mr={1} />
        <Typography variant="h6" component="div">
          LinkUp
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={Link}
              to={item.href}
              sx={{ textAlign: "center" }}
              selected={currentPage?.toLowerCase() === item.label.toLowerCase()}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link
              to={"/"}
              search={{ filter: "recent" }}
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
                userSelect: "none",
              }}
            >
              <Box component="img" src={internet} height="40px" mr={1} />
              <Typography variant="h6" component="div" sx={{ fontWeight: 700, display: "flex", alignItems: "center" }}>
                LinkUp
              </Typography>
            </Link>
          </Box>

          {/* Desktop navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={Link}
                to={item.href}
                color="inherit"
                sx={{
                  fontWeight: 500,
                  fontSize: 14,
                  borderBottom: currentPage?.toLowerCase() === item.label.toLowerCase() ? 2 : 0,
                  borderColor: "primary.main",
                  borderRadius: 0,
                  pb: 0.5,
                }}
              >
                {item.label}
              </Button>
            ))}
            <AuthButton />
          </Box>

          {/* Mobile menu button */}
          {isMobile && (
            <Box sx={{ display: "flex" }}>
              <AuthButton />
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ ml: 1, display: { md: "none" } }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </Container>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}
