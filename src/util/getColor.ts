type TColors = {
  selected: string;
  default: string;
};

const defaultColors: TColors = {
  selected: 'var(--ai-purple-50-main)',
  default: 'var(--gray-gray-70)'
};

const getIconColor = (
  itemId: string,
  selectedItemId: string,
  colors: TColors = defaultColors
): string => {
  return itemId === selectedItemId ? colors.selected : colors.default;
};

export { getIconColor };
