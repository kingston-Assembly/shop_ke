from django.shortcuts import render, redirect
from django.contrib import messages
from django.db import transaction
from cart.cart import Cart
from .forms import CheckoutForm
from .models import Order, OrderItem


def checkout(request):
    cart = Cart(request)
    if len(cart) == 0:
        messages.info(request, 'Your cart is empty.')
        return redirect('catalog:product_list')

    if request.method == 'POST':
        form = CheckoutForm(request.POST)
        if form.is_valid():
            with transaction.atomic():
                order: Order = form.save(commit=False)
                if order.payment_method == 'COD':
                    order.paid = False
                elif order.payment_method == 'MPESA':
                    order.paid = bool(order.mpesa_code)
                order.save()
                for item in cart:
                    OrderItem.objects.create(
                        order=order,
                        product_name=item['product'].name,
                        price=item['price'],
                        quantity=item['quantity'],
                    )
                cart.clear()
            return redirect('orders:success', order_id=order.id)
    else:
        form = CheckoutForm()

    return render(request, 'orders/checkout.html', {
        'cart': cart,
        'form': form,
    })


def success(request, order_id):
    order = Order.objects.get(id=order_id)
    return render(request, 'orders/success.html', {'order': order})
