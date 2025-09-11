from django.contrib import admin
from .models import Guest

@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    list_display = ['name', 'room_number', 'check_in', 'check_out', 'email']
    list_filter = ['check_in', 'check_out']
    search_fields = ['name', 'room_number', 'email', 'phone']
    ordering = ['room_number']
