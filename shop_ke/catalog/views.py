from django.shortcuts import get_object_or_404, render
from django.core.paginator import Paginator
from .models import Product, Category


def product_list(request, category_slug=None):
    category = None
    categories = Category.objects.filter(is_active=True)
    products = Product.objects.filter(is_active=True)
    if category_slug:
        category = get_object_or_404(Category, slug=category_slug, is_active=True)
        products = products.filter(category=category)
    paginator = Paginator(products, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'catalog/product_list.html', {
        'category': category,
        'categories': categories,
        'page_obj': page_obj,
    })


def product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug, is_active=True)
    return render(request, 'catalog/product_detail.html', {'product': product})
