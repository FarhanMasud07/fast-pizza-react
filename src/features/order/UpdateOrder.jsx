import React from 'react'
import Button from '../../ui/Button';
import { useFetcher } from 'react-router-dom';
import { updateOrder } from '../../services/apiRestaurant';

function UpdateOrder({ order }) {
    const fetcher = useFetcher();
    return (
        <fetcher.Form method='PATCH' className="text-right">
            <Button type="primary" disabled={fetcher.state === 'loading'}>Make priority</Button>
        </fetcher.Form>
    )
}

export default UpdateOrder;

export async function action({ request, params }) {
    await updateOrder(params?.orderId, { priority: true });
    return null;
}