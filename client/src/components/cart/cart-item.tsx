import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

interface CartItemProps {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItem({ 
  id, 
  name, 
  price, 
  imageUrl, 
  quantity, 
  onUpdateQuantity, 
  onRemove 
}: CartItemProps) {
  const [itemQuantity, setItemQuantity] = useState(quantity);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      setItemQuantity(newQuantity);
      onUpdateQuantity(id, newQuantity);
    }
  };
  
  const increaseQuantity = () => {
    const newQuantity = itemQuantity + 1;
    setItemQuantity(newQuantity);
    onUpdateQuantity(id, newQuantity);
  };
  
  const decreaseQuantity = () => {
    if (itemQuantity > 1) {
      const newQuantity = itemQuantity - 1;
      setItemQuantity(newQuantity);
      onUpdateQuantity(id, newQuantity);
    }
  };
  
  return (
    <div className="flex items-center py-4 border-b border-neutral-200">
      <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
      </div>
      
      <div className="ml-4 flex-grow">
        <h4 className="font-heading font-medium text-neutral-800">{name}</h4>
        <p className="text-primary font-bold">KES {(price * 130).toFixed(2)}</p>
      </div>
      
      <div className="flex items-center space-x-2 ml-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-md"
          onClick={decreaseQuantity}
        >
          -
        </Button>
        <Input
          type="number"
          min="1"
          value={itemQuantity}
          onChange={handleQuantityChange}
          className="h-8 w-16 text-center"
        />
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-md"
          onClick={increaseQuantity}
        >
          +
        </Button>
      </div>
      
      <div className="ml-4 w-24 text-right">
        <p className="font-bold text-neutral-800">${(price * itemQuantity).toFixed(2)}</p>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="ml-2 text-neutral-500 hover:text-red-500"
        onClick={() => onRemove(id)}
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
