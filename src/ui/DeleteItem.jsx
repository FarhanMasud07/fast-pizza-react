import React from 'react';
import Button from './Button';
import { useDispatch } from 'react-redux';
import { deleteItem } from '../features/cart/cartSlice';

function DeleteItem({ id }) {
    const dispatch = useDispatch();

    function handleDeleteItem() {
        dispatch(deleteItem(id));
    }
    return (
        <Button type="small" onClick={handleDeleteItem}>Delete</Button>
    )
}

export default DeleteItem;