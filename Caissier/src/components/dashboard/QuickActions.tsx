import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Menu, Receipt } from "lucide-react";

interface QuickActionsProps {
  onNewOrder: () => void;
  onManageMenu: () => void;
  onViewReceipts: () => void;
}

export const QuickActions = ({ 
  onNewOrder, 
  onManageMenu, 
  onViewReceipts
}: QuickActionsProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Button 
          variant="gradient" 
          className="h-20 flex-col gap-2"
          onClick={onNewOrder}
        >
          <Plus className="h-6 w-6" />
          <span className="text-sm font-medium">Nouvelle commande</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 flex-col gap-2"
          onClick={onManageMenu}
        >
          <Menu className="h-6 w-6" />
          <span className="text-sm font-medium">Gérer le menu</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 flex-col gap-2"
          onClick={onViewReceipts}
        >
          <Receipt className="h-6 w-6" />
          <span className="text-sm font-medium">Factures</span>
        </Button>
      </div>
    </Card>
  );
};