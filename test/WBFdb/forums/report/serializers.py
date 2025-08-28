from rest_framework import serializers
from rest_framework.serializers import SerializerMethodField
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from forums.abstract.serializers import AbstractSerializer
from .models import ReportModel
from ..user.serializers import WBFUserSerializer

class ReportSerializer(AbstractSerializer):
    reported_by = WBFUserSerializer(read_only=True)
    reported_content_info = SerializerMethodField()
    report_type_display = SerializerMethodField()
    report_tag_display = SerializerMethodField()
    days_since_report = SerializerMethodField()

    class Meta:
        model = ReportModel
        fields = [
            'id',
            'report_type',
            'report_type_display',
            'report_tag',
            'report_tag_display',
            'report_title',
            'reason',
            'reported_by',
            'reported_content_info',
            'is_resolved',
            'resolved_at',
            'days_since_report',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'public_id',
            'reported_by',
            'is_resolved',
            'resolved_at',
            'created_at',
            'updated_at',
        ]

    def get_reported_content_info(self, obj):
        """Get information about the reported content"""
        if not obj.reported_content:
            return {
                'type': obj.content_type.model,
                'id': obj.object_id,
                'exists': False,
                'title': 'Content no longer available',
                'content_preview': None,
                'author': None,
                'created_at': None
            }

        reported_obj = obj.reported_content
        content_info = {
            'type': obj.content_type.model,
            'id': getattr(reported_obj, 'public_id', None) or str(obj.object_id),
            'exists': True,
            'created_at': getattr(reported_obj, 'created_at', None) or getattr(reported_obj, 'created', None)
        }

        # Get title/name based on content type
        if hasattr(reported_obj, 'title'):
            content_info['title'] = reported_obj.title
        elif hasattr(reported_obj, 'name'):
            content_info['title'] = reported_obj.name
        else:
            content_info['title'] = f"{obj.content_type.model.title()} Content"

        # Get content preview
        if hasattr(reported_obj, 'content'):
            content = reported_obj.content
            content_info['content_preview'] = content[:200] + '...' if len(content) > 200 else content
        else:
            content_info['content_preview'] = str(reported_obj)[:200]

        # Get author information
        if hasattr(reported_obj, 'author'):
            content_info['author'] = WBFUserSerializer(reported_obj.author, read_only=True).data
        elif hasattr(reported_obj, 'amplified_by'):  # For shares/amplifies
            content_info['author'] = WBFUserSerializer(reported_obj.amplified_by, read_only=True).data
        elif hasattr(reported_obj, 'created_by'):
            content_info['author'] = WBFUserSerializer(reported_obj.created_by, read_only=True).data
        else:
            content_info['author'] = None

        return content_info

    def get_report_type_display(self, obj):
        """Get human readable report type"""
        return obj.get_report_type_display()

    def get_report_tag_display(self, obj):
        """Get human readable report tag"""
        return obj.get_report_tag_display() if obj.report_tag else None

    def get_days_since_report(self, obj):
        """Calculate days since report was created"""
        if obj.created_at:
            delta = timezone.now() - obj.created_at
            return delta.days
        return 0

    def valiadate(self, attrs):
        """Validate the report data"""
        # Ensure required fields are present
        required_fields = ['report_type', 'report_title', 'reason']
        for field in required_fields:
            if not attrs.get(field):
                raise serializers.ValidationError(f"{field} is required")

        # Validate reason length
        if len(attrs.get('reason', '')) < 10:
            raise serializers.ValidationError("Reason must be at least 10 characters long")

        return attrs

class ReportCreateSerializer(serializers.ModelSerializer):
    """Simplified serializer for creating reports"""
    content_type_name = serializers.CharField(write_only=True)
    content_id = serializers.CharField(write_only=True)

    class Meta:
        model = ReportModel
        fields = [
            'report_type',
            'report_title',
            'reason',
            'content_type_name',
            'content_id'
        ]

    def validate_content_type_name(self, value):
        """Validate that the content type exists"""
        valid_types = ['announcemodel', 'amplifymodel', 'opinemodel', 'pipelinemodel', 'processmodel', 'parametermodel']
        if value.lower() not in valid_types:
            raise serializers.ValidationError(f"Invalid content type. Must be one of: {valid_types}")
        return value.lower()

    def validate_content_id(self, value):
        """Validate that the content ID is a valid UUID format"""
        import re
        uuid_pattern = r'^[0-9a-fA-F]{32}$|^[0-9a-fA-F-]{36}$'
        if not re.match(uuid_pattern, str(value)):
            raise serializers.ValidationError("Invalid content ID format")
        return value

    def create(self, validated_data):
        """Create a report with the provided data"""
        content_type_name = validated_data.pop('content_type_name')
        content_id = validated_data.pop('content_id')

        # Get the content type
        try:
            content_type = ContentType.objects.get(model=content_type_name)
        except ContentType.DoesNotExist:
            raise serializers.ValidationError(f"Content type '{content_type_name}' not found")

        # Create the report
        report = ReportModel.objects.create(
            content_type=content_type,
            object_id=content_id,
            reported_by=self.context['request'].user,
            **validated_data
        )

        return report

class AdminReportSerializer(ReportSerializer):
    """Extended serializer for admin use with additional fields"""
    class Meta(ReportSerializer.Meta):
        fields = ReportSerializer.Meta.fields + ['report_tag']
        read_only_fields = [
            'id',
            'public_id',
            'reported_by',
            'created_at',
            'updated_at',
        ]
