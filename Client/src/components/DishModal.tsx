import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { MenuItem } from "./RestaurantMenu";

interface DishModalProps {
  dish: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (dish: MenuItem, quantity: number) => void;
}

const DishModal = ({ dish, isOpen, onClose, onAddToCart }: DishModalProps) => {
  const [quantity, setQuantity] = useState(1);

  // Don't render if no dish or modal is not open
  if (!dish || !isOpen) return null;

  const handleAddToCart = () => {
    onAddToCart(dish, quantity);
    setQuantity(1);
    onClose();
  };

  const increaseQuantity = () => setQuantity(q => q + 1);
  const decreaseQuantity = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto dialog-content">
        <DialogHeader>
          <DialogTitle className="text-xl">{dish.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pb-4">
          {/* Image */}
          <div className="aspect-video overflow-hidden rounded-lg">
            <img 
              src={dish.image_url || '/placeholder.svg'} 
              alt={dish.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </div>
          
          {/* Description and Price */}
          <div className="space-y-2">
            <p className="text-muted-foreground">{dish.description}</p>
            <div className="flex justify-between items-center">
              <Badge variant="secondary" className="bg-restaurant-gold/20 text-restaurant-dark text-lg px-3 py-1">
                {typeof dish.price === 'number' ? dish.price.toFixed(2) : parseFloat(dish.price || 0).toFixed(2)} DZD
              </Badge>
              <Badge variant="outline">{dish.category}</Badge>
            </div>
          </div>
          
          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quantité</label>
            <div className="flex items-center gap-3">
              <Button 
                size="icon" 
                variant="outline" 
                onClick={decreaseQuantity}
                className="h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-medium w-12 text-center">{quantity}</span>
              <Button 
                size="icon" 
                variant="outline" 
                onClick={increaseQuantity}
                className="h-10 w-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          

          
          {/* Total and Add Button */}
          <div className="space-y-3 pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="text-xl font-bold text-primary">
                {((typeof dish.price === 'number' ? dish.price : parseFloat(dish.price || 0)) * quantity).toFixed(2)} DZD
              </span>
            </div>
            
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-primary to-restaurant-warm hover:from-primary/90 hover:to-restaurant-warm/90 text-white font-medium h-12"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Ajouter au panier ({quantity})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DishModal;