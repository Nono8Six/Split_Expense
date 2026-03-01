import { motion } from "motion/react";

interface ColorPickerProps {
    selected: string;
    onChange: (color: string) => void;
}

const COLORS = [
    "#4F46E5", // Indigo
    "#EC4899", // Pink
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#3B82F6", // Blue
    "#8B5CF6", // Violet
    "#EF4444", // Red
    "#14B8A6", // Teal
];

/**
 * Sélecteur de couleur sous forme de pastilles iOS-style.
 * @param selected - La couleur actuellement sélectionnée (hex)
 * @param onChange - Callback appelé avec la nouvelle couleur sélectionnée
 */
export function ColorPicker({ selected, onChange }: ColorPickerProps) {
    return (
        <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => (
                <button
                    key={color}
                    type="button"
                    onClick={() => onChange(color)}
                    className="w-9 h-9 rounded-full transition-transform active:scale-90 relative"
                    style={{ backgroundColor: color }}
                >
                    {selected === color && (
                        <motion.div
                            layoutId="color-ring"
                            className="absolute inset-[-4px] rounded-full border-2 border-current"
                            style={{ color }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
}
