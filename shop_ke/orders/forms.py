from django import forms
from .models import Order


class CheckoutForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = [
            'first_name', 'last_name', 'email', 'phone', 'address',
            'city_or_town', 'county', 'postal_code', 'payment_method', 'mpesa_code'
        ]