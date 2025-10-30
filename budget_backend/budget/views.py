from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Sum, Q
from datetime import datetime
from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer, UserSerializer

# Import Token model correctly
try:
    from rest_framework.authtoken.models import Token
except ImportError:
    Token = None


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })
    
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({'message': 'Logged out successfully'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):
    user = request.user
    month = request.query_params.get('month', datetime.now().month)
    year = request.query_params.get('year', datetime.now().year)
    
    # Get transactions for the month
    transactions = Transaction.objects.filter(
        user=user,
        date__month=month,
        date__year=year
    )
    
    # Calculate totals
    total_income = transactions.filter(type='income').aggregate(Sum('amount'))['amount__sum'] or 0
    total_expense = transactions.filter(type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
    balance = total_income - total_expense
    
    # Get budget
    try:
        budget = Budget.objects.get(user=user, month=month, year=year)
        budget_amount = budget.amount
    except Budget.DoesNotExist:
        budget_amount = 0
    
    # Category-wise breakdown
    category_expenses = transactions.filter(type='expense').values(
        'category__name'
    ).annotate(total=Sum('amount'))
    
    category_income = transactions.filter(type='income').values(
        'category__name'
    ).annotate(total=Sum('amount'))
    
    return Response({
        'total_income': float(total_income),
        'total_expense': float(total_expense),
        'balance': float(balance),
        'budget': float(budget_amount),
        'budget_remaining': float(budget_amount - total_expense) if budget_amount else 0,
        'category_expenses': list(category_expenses),
        'category_income': list(category_income),
        'month': month,
        'year': year
    })


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user)
        
        # Filtering
        category = self.request.query_params.get('category')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        min_amount = self.request.query_params.get('min_amount')
        max_amount = self.request.query_params.get('max_amount')
        transaction_type = self.request.query_params.get('type')
        
        if category:
            queryset = queryset.filter(category_id=category)
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        if min_amount:
            queryset = queryset.filter(amount__gte=min_amount)
        if max_amount:
            queryset = queryset.filter(amount__lte=max_amount)
        if transaction_type:
            queryset = queryset.filter(type=transaction_type)
        
        return queryset


class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def current_month(self, request):
        month = request.query_params.get('month', datetime.now().month)
        year = request.query_params.get('year', datetime.now().year)
        
        try:
            budget = Budget.objects.get(user=request.user, month=month, year=year)
            return Response(BudgetSerializer(budget).data)
        except Budget.DoesNotExist:
            return Response({'detail': 'No budget set for this month'}, status=status.HTTP_404_NOT_FOUND)