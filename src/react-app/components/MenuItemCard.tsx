import { Plus } from 'lucide-react';
import { formatCurrency } from '@/react-app/utils/currency';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
}

interface MenuItemCardProps {
  item: MenuItem;
  onAddToOrder: (item: MenuItem, quantity?: number, notes?: string) => void;
}

export default function MenuItemCard({ item, onAddToOrder }: MenuItemCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-video bg-slate-100 relative overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <div className="text-center">
              <div className="text-2xl mb-1">🍽️</div>
              <div className="text-xs">No Image</div>
            </div>
          </div>
        )}
        {!item.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-slate-800 text-sm mb-1">{item.name}</h3>
          {item.description && (
            <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-blue-600">
            {formatCurrency(item.price)}
          </div>
          <button
            onClick={() => onAddToOrder(item)}
            disabled={!item.available}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
