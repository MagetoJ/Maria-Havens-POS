from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
from orders.models import Order, OrderItem
from payments.models import Payment
from menu.models import MenuItem

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sales_report(request):
    # Get query parameters
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    
    # Default to last 30 days if no dates provided
    if not start_date:
        start_date = (timezone.now() - timedelta(days=30)).date()
    else:
        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
    
    if not end_date:
        end_date = timezone.now().date()
    else:
        end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
    
    # Filter orders by date range
    orders = Order.objects.filter(
        created_at__date__gte=start_date,
        created_at__date__lte=end_date
    )
    
    # Calculate totals
    total_revenue = orders.aggregate(Sum('total'))['total__sum'] or 0
    total_orders = orders.count()
    average_order_value = total_revenue / total_orders if total_orders > 0 else 0
    
    # Sales by order type
    sales_by_type = orders.values('type').annotate(
        total_revenue=Sum('total'),
        order_count=Count('id')
    )
    
    # Sales by status
    sales_by_status = orders.values('status').annotate(
        total_revenue=Sum('total'),
        order_count=Count('id')
    )
    
    # Top selling items
    top_items = OrderItem.objects.filter(
        order__created_at__date__gte=start_date,
        order__created_at__date__lte=end_date
    ).values('name').annotate(
        total_quantity=Sum('quantity'),
        total_revenue=Sum('price')
    ).order_by('-total_quantity')[:10]
    
    return Response({
        'period': {
            'start_date': start_date,
            'end_date': end_date
        },
        'summary': {
            'total_revenue': total_revenue,
            'total_orders': total_orders,
            'average_order_value': round(average_order_value, 2)
        },
        'sales_by_type': list(sales_by_type),
        'sales_by_status': list(sales_by_status),
        'top_selling_items': list(top_items)
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_report(request):
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    
    if not start_date:
        start_date = (timezone.now() - timedelta(days=30)).date()
    else:
        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
    
    if not end_date:
        end_date = timezone.now().date()
    else:
        end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
    
    payments = Payment.objects.filter(
        created_at__date__gte=start_date,
        created_at__date__lte=end_date
    )
    
    # Payment method breakdown
    payment_methods = payments.values('method').annotate(
        total_amount=Sum('amount'),
        payment_count=Count('id')
    )
    
    # Payment status breakdown
    payment_status = payments.values('status').annotate(
        total_amount=Sum('amount'),
        payment_count=Count('id')
    )
    
    total_payments = payments.aggregate(Sum('amount'))['amount__sum'] or 0
    
    return Response({
        'period': {
            'start_date': start_date,
            'end_date': end_date
        },
        'total_payments': total_payments,
        'payment_methods': list(payment_methods),
        'payment_status': list(payment_status)
    })
