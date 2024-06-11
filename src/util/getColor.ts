const colors = {
  selected: 'var(--ai-purple-50-main)',
  default: 'var(--gray-gray-70)'
};

const getIconColor = (itemId: string, selectedItemId: string) => {
  return itemId === selectedItemId ? colors.selected : colors.default;
};

export { getIconColor };
