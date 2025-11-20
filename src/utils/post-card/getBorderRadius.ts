export const getBorderRadius = (index: number, length: number, isMobile: boolean) => {
  if (isMobile) return 0;

  if (length === 1) return "16px";
  if (index === 0) return "16px 16px 0 0";
  if (index === length - 1) return "0 0 16px 16px";
  return 0;
};
