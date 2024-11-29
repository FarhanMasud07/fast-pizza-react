import { formatCurrency } from "../../utils/helpers";
import DeleteItem from "../../ui/DeleteItem";
import UpdateItemQuantity from "./UpdateItemQuantity";
import { useSelector } from "react-redux";
import { getCartItemBuyId } from "./cartSlice";

function CartItem({ item }) {
  const { pizzaId, name, quantity, totalPrice } = item;
  const currentCartItem = useSelector(getCartItemBuyId(pizzaId));

  return (
    <li className="py-3 sm:flex sm:justify-between sm:items-center">
      <p className="mb-1 sm:mb-0">
        {quantity}&times; {name}
      </p>
      <div className="flex justify-between items-center sm:gap-6">
        <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>
        <UpdateItemQuantity pizzaId={pizzaId} currentCartItem={currentCartItem} />
        <DeleteItem id={pizzaId} />
      </div>
    </li>
  );
}

export default CartItem;
