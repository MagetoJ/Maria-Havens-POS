from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Payment
from .serializers import PaymentSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'method', 'order']
    search_fields = ['transaction_id', 'notes']
    ordering_fields = ['created_at', 'amount', 'status']
    ordering = ['-created_at']
    
    @action(detail=True, methods=['patch'])
    def process_payment(self, request, pk=None):
        payment = self.get_object()
        new_status = request.data.get('status', 'completed')
        transaction_id = request.data.get('transaction_id')
        
        if new_status in [choice[0] for choice in Payment.PAYMENT_STATUS_CHOICES]:
            payment.status = new_status
            if transaction_id:
                payment.transaction_id = transaction_id
            payment.save()
            
            # Update order status if payment is completed
            if new_status == 'completed':
                payment.order.status = 'paid'
                payment.order.save()
            
            serializer = self.get_serializer(payment)
            return Response(serializer.data)
        
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
