interface CategoryTagProps {
  category: string;
}

export default function CategoryTag({ category }: CategoryTagProps) {
  const toTitleCase = (value: string): string =>
    value
      .split(' ')
      .map((word) => (word ? `${word[0].toUpperCase()}${word.slice(1)}` : ''))
      .join(' ');

  const getCategoryColor = (category: string): string => {
    // Normalize the string (capitalisation and spaces don't matter)
    const normalized = category.toLowerCase().replace(/\s+/g, '');
    
    // Preset color palette
    const colorPalette = [
      '#3B82F6', // Blue
      '#8B5CF6', // Purple
      '#EC4899', // Pink
      '#EF4444', // Red
      '#F97316', // Orange
      '#10B981', // Emerald
      '#06B6D4', // Cyan
      '#6366F1', // Indigo
      '#14B8A6', // Teal
      '#F59E0B', // Amber
      '#8B5A3C', // Brown
      '#6B7280', // Gray
    ];
    
    // Simple hash function to generate a number from the string
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Map hash to length of color palette
    const index = Math.abs(hash) % colorPalette.length;
    
    return colorPalette[index];
  };

  const bgColor = getCategoryColor(category);

  return (
    <span 
      className="text-white px-4 py-2 rounded text-sm font-medium"
      style={{ backgroundColor: bgColor }}
    >
      {toTitleCase(category)}
    </span>
  );
}
