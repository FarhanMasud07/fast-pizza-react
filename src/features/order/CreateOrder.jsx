import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { clearItem, getCart, getTotalCartPrice } from '../cart/cartSlice';
import EmptyCart from '../cart/EmptyCart';
import store from '../.././store';
import { formatCurrency } from "../../utils/helpers";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const { userName, status: addressStatus, position, address, error: errorAddress } = useSelector(state => state.user);
  const cart = useSelector(getCart);
  const formErrors = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isLoadingAddress = addressStatus === 'loading';

  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? (totalCartPrice * 0.2) : 0;
  const totalPrice = totalCartPrice + priorityPrice;


  const dispatch = useDispatch();

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold mb-8">Ready to order? Let's go!</h2>

      {/* <Form method="POST" action="/order/new"> */}

      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-cen ter">
          <label className="sm:basis-40">First Name</label>
          <input type="text" name="customer" defaultValue={userName} required className="input grow" />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" name="phone" required className="input w-full" />
            {formErrors?.phone && <p className="text-sm mt-2 text-red-700 bg-red-100 p-2 rounded-md">
              {formErrors.phone}
            </p>}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center relative">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input type="text" name="address" required className="input w-full"
              disabled={isLoadingAddress} defaultValue={address} />
            {addressStatus === 'error' &&
              (
                <p className="text-sm mt-2 text-red-700 bg-red-100 p-2 rounded-md">
                  {errorAddress}
                </p>
              )
            }
          </div>
          {!position.latitude && !position.longitude &&
            (
              <span className="absolute top-[4.9px] right-[3px] md:right-[5px] md:top-[5px] z-50">
                <Button type="small" onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
                  disabled={isLoadingAddress}
                >Get Position</Button>
              </span>
            )
          }
        </div>

        <div className="mb-12 flex gap-5 items-center">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
            className="
            h-6
            w-6
            accent-yellow-400
            focus:outline-none
            focus:ring
            focus:ring-yellow-400
            focus:ring-offset-2
          "
          />
          <label htmlFor="priority" className="font-medium">Want to yo give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input type="hidden" name="position" value={
            position.latitude && position.longitude
              ? `${position.latitude},${position.longitude}`
              : ""
          } />
          <Button disabled={isSubmitting || isLoadingAddress} type="primary">
            {isSubmitting ? "Placing order ......" : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function createOrderAction({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  const errors = {};
  if (!isValidPhone(order.phone)) {
    errors.phone = "Please provide correct phone number.";
  }
  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);
  store.dispatch(clearItem());
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
