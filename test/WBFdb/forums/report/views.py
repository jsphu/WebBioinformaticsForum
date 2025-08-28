from django.shortcuts import render

# Create your views here.
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils import timezone
from django.db.models import Q, Count
from .models import ReportModel
from .serializers import ReportSerializer, ReportCreateSerializer, AdminReportSerializer

class ReportViewSet(ModelViewSet):
    queryset = ReportModel.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_value_regex = r"[0-9a-fA-F-]{32,36}"

    def get_serializer_class(self):
        """Return appropriate serializer based on action and user permissions"""
        if self.action == 'create':
            return ReportCreateSerializer
        elif self.request.user.is_staff:
            return AdminReportSerializer
        return ReportSerializer

    def get_queryset(self):
        """Filter queryset based on user permissions"""
        queryset = ReportModel.objects.select_related(
            'reported_by', 'content_type'
        ).prefetch_related('reported_content')

        user = self.request.user
        if user.is_staff or user.is_superuser or user.is_moderator:
            # Admins can see all reports
            return queryset
        else:
            # Regular users can only see their own reports
            return queryset.filter(reported_by=user)

    def get_object(self):
        """Get object by public_id"""
        obj = ReportModel.objects.get_object_by_public_id(self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def statistics(self, request):
        """Get report statistics for admins"""
        stats = {
            'total_reports': ReportModel.objects.count(),
            'unresolved_reports': ReportModel.objects.filter(is_resolved=False).count(),
            'resolved_reports': ReportModel.objects.filter(is_resolved=True).count(),
            'reports_by_type': dict(
                ReportModel.objects.values('report_type')
                .annotate(count=Count('id'))
                .values_list('report_type', 'count')
            ),
            'reports_by_tag': dict(
                ReportModel.objects.filter(report_tag__isnull=False)
                .values('report_tag')
                .annotate(count=Count('id'))
                .values_list('report_tag', 'count')
            )
        }
        return Response(stats)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def resolve(self, request, pk=None):
        """Mark a report as resolved"""
        report = self.get_object()
        report.is_resolved = True
        report.resolved_at = timezone.now()
        report.save()

        serializer = self.get_serializer(report)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def unresolve(self, request, pk=None):
        """Mark a report as unresolved"""
        report = self.get_object()
        report.is_resolved = False
        report.resolved_at = None
        report.save()

        serializer = self.get_serializer(report)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser])
    def set_tag(self, request, pk=None):
        """Set or update report tag"""
        report = self.get_object()
        tag = request.data.get('tag')

        if tag and tag in [choice[0] for choice in ReportModel.ReportTags.choices]:
            report.report_tag = tag
            report.save()
            serializer = self.get_serializer(report)
            return Response(serializer.data)
        else:
            return Response(
                {'error': 'Invalid tag value'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def my_reports(self, request):
        """Get current user's reports"""
        reports = self.get_queryset().filter(reported_by=request.user)
        page = self.paginate_queryset(reports)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(reports, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def pending(self, request):
        """Get unresolved reports for admins"""
        reports = self.get_queryset().filter(is_resolved=False)
        page = self.paginate_queryset(reports)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(reports, many=True)
        return Response(serializer.data)
