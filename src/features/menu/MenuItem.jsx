import { formatCurrency } from "../../utils/helpers";
import Button from '../../ui/Button';
import { useDispatch, useSelector } from "react-redux";
import { addItem, getCartItemBuyId } from "../cart/cartSlice";
import DeleteItem from '../../ui/DeleteItem';
import UpdateItemQuantity from "../cart/UpdateItemQuantity";

function MenuItem({ pizza }) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const dispatch = useDispatch();
  const currentQuantity = useSelector(getCartItemBuyId(id));
  const hasCarItem = currentQuantity > 0;

  function handleCart() {
    const pizza = {
      pizzaId: id,
      name,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice * 1
    }
    dispatch(addItem(pizza));
  }

  return (
    <li className="flex gap-4 py-2">
      <img src={imageUrl} alt={name}
        className={`h-24 ${soldOut
          ? 'opacity-70 grayscale'
          : ''}`}
      />
      <div className="flex flex-col grow pt-0.5">
        <p className="font-medium">{name}</p>
        <p className="text-sm italic text-stone-500 capitalize">{ingredients.join(", ")}</p>
        <div className="flex mt-auto items-center justify-between">
          {!soldOut
            ? <p className="text-sm">{formatCurrency(unitPrice)}</p>
            : <p className="text-sm uppercase font-medium text-stone-500">Sold out</p>
          }
          {hasCarItem && <div className="flex items-center gap-3 sm:gap-8">
            <UpdateItemQuantity pizzaId={id} currentCartItem={currentQuantity} />
            <DeleteItem id={id} />
          </div>}
          {!soldOut && !hasCarItem && <Button type="small" onClick={handleCart}>Add to cart</Button>}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
