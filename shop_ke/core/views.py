from django.shortcuts import render
from catalog.models import Product, Category


def home(request):
    categories = Category.objects.filter(is_active=True)[:8]
    products = Product.objects.filter(is_active=True).order_by('-created_at')[:8]
    return render(request, 'core/home.html', {
        'categories': categories,
        'products': products,
    })
