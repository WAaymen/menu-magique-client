import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart, Bell, Receipt, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import steakImg from "@/assets/steak.jpg";
import saladImg from "@/assets/salad.jpg";
import dessertImg from "@/assets/dessert.jpg";
import soupImg from "@/assets/soup.jpg";
import restaurantHero from "@/assets/restaurant-hero.jpg";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Steak Grillé",
    description: "Filet de bœuf grillé aux légumes de saison",
    price: 28.50,
    category: "Plats Principaux",
    image: steakImg
  },
  {
    id: "2",
    name: "Salade César",
    description: "Salade fraîche avec croûtons et parmesan",
    price: 14.90,
    category: "Entrées",
    image: saladImg
  },
  {
    id: "3",
    name: "Soupe à l'Oignon",
    description: "Soupe traditionnelle française au fromage fondu",
    price: 9.80,
    category: "Entrées",
    image: soupImg
  },
  {
    id: "4",
    name: "Dessert Chocolat",
    description: "Fondant au chocolat avec fruits rouges",
    price: 8.50,
    category: "Desserts",
    image: dessertImg
  }
];

const RestaurantMenu = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [showCart, setShowCart] = useState(false);
  const [orderStatus, setOrderStatus] = useState<"none" | "pending" | "preparing" | "ready">("none");
  const { toast } = useToast();

  const categories = ["Tous", "Entrées", "Plats Principaux", "Desserts"];
  const tableNumber = 12; // This would come from the QR code context

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    toast({
      title: "Ajouté au panier",
      description: `${item.name} a été ajouté à votre commande`,
    });
  };

  const removeFromCart = (itemId: string) => {
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(cartItem => 
        cartItem.id === itemId 
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    }
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const filteredItems = selectedCategory === "Tous" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const submitOrder = () => {
    setOrderStatus("pending");
    toast({
      title: "Commande envoyée",
      description: "Votre commande a été transmise à la cuisine",
    });
    
    // Simulate order progression
    setTimeout(() => {
      setOrderStatus("preparing");
      toast({
        title: "Commande en préparation",
        description: "Votre commande est en cours de préparation",
      });
    }, 3000);
    
    setTimeout(() => {
      setOrderStatus("ready");
      toast({
        title: "Commande prête",
        description: "Votre commande est prête à être servie",
      });
    }, 8000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-restaurant-cream to-background">
      {/* Hero Header */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={restaurantHero} 
          alt="Restaurant ambiance" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-restaurant-dark/70 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-between px-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Menu Magique</h1>
            <p className="text-restaurant-cream text-lg">Table N° {tableNumber}</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="icon"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => setShowCart(!showCart)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-xs">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              )}
            </Button>
            {orderStatus !== "none" && (
              <Button 
                variant="outline" 
                size="icon"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Bell className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Order Status */}
      {orderStatus !== "none" && (
        <div className="bg-primary/10 border-l-4 border-primary p-4 m-4">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold text-primary">
                {orderStatus === "pending" && "Commande en attente"}
                {orderStatus === "preparing" && "Commande en préparation"}
                {orderStatus === "ready" && "Commande prête"}
              </p>
              <p className="text-sm text-muted-foreground">
                {orderStatus === "pending" && "Votre commande a été reçue"}
                {orderStatus === "preparing" && "Nos chefs préparent votre commande"}
                {orderStatus === "ready" && "Votre commande est prête à être servie"}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-border/50"
            >
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <Badge variant="secondary" className="bg-restaurant-gold/20 text-restaurant-dark">
                    {item.price.toFixed(2)} €
                  </Badge>
                </div>
                <CardDescription className="text-sm">{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  onClick={() => addToCart(item)}
                  className="w-full bg-gradient-to-r from-primary to-restaurant-warm hover:from-primary/90 hover:to-restaurant-warm/90 text-white font-medium"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter au panier
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Shopping Cart */}
        {showCart && cart.length > 0 && (
          <Card className="mb-6 bg-card/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Votre Commande
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-3">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.price.toFixed(2)} € x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => removeFromCart(item.id)}
                        className="h-8 w-8"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => addToCart(item)}
                        className="h-8 w-8"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between items-center pt-3 border-t font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">{getTotal().toFixed(2)} €</span>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={submitOrder}
                    disabled={orderStatus !== "none"}
                    className="flex-1 bg-gradient-to-r from-primary to-restaurant-warm hover:from-primary/90 hover:to-restaurant-warm/90"
                  >
                    <Receipt className="h-4 w-4 mr-2" />
                    Valider la commande
                  </Button>
                  <Button variant="outline" size="icon">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenu;