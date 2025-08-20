from django.db import models
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

from forums.abstract.models import WBFAbstractModel, WBFAbstractManager


class ReportManager(WBFAbstractManager):
    pass

class ReportModel(WBFAbstractModel):
    """Reports from users"""

    class ReportTypes(models.TextChoices):
        BUG = "bug", "Bug Report"
        SPAM = "spam", "Spam"
        SCAM = "scam", "Scam"
        HARM = "harm", "Harmful Content"
        GRAPHIC = "graphic", "Inappropriate Content"
        PRIVACY = "privacy", "Privacy Violation"
        COPYRIGHT = "copyright", "Copyright Issues"
        DUPLICATE = "duplicate", "Duplicate Content"
        PLAGIARISM = "plagiarism", "Plagiarized Research"

    class ReportTags(models.TextChoices):
        REVIEWED = "reviewed", "Reviewed"
        DUPLICATE = "duplicate", "Duplicate Report"
        ESCALATED = "escalated", "Escalated"
        LEGAL_REVIEW = "legal_review", "Legal Review"
        HIGH_PRIORITY = "high_priority", "High Priority"
        FALSE_POSITIVE = "false_positive", "False Positive"
        PENDING_ACTION = "pending_action", "Pending Action"

    report_tag = models.CharField(
        max_length=30,
        choices=ReportTags.choices,
        blank=True,
        help_text="Moderation categorization tag"
    )

    reported_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="reports_user"
    )

    report_type = models.CharField(
        max_length=35,
        choices=ReportTypes.choices,
        help_text="Type of issue to report"
    )

    report_title = models.CharField(max_length=256)

    reason = models.TextField(max_length=8000)

    # """UNIMPLEMENTED"""
    # attachments = models.FileField(upload_to="reports", blank=True)

    is_resolved = models.BooleanField(default=False)

    resolved_at = models.DateTimeField(null=True, blank=True)

    content_type = models.ForeignKey(ContentType, models.PROTECT)
    object_id = models.UUIDField()
    reported_content = GenericForeignKey('content_type', 'object_id')
