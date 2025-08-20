from django.db import models
from django.conf import settings
from forums.abstract.models import WBFAbstractModel, WBFAbstractManager

class AnnounceManager(WBFAbstractManager):
    pass

class AnnounceModel(WBFAbstractModel):

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="announce_authored",
        null=True,
    )
    content = models.TextField(max_length=8000)

    _tracked_fields = ['content']

    # """UNIMPLEMENTED"""
    # tag = models.ManyToManyField(
    #   TagModel,
    #   on_delete=models.SET_NULL,
    #   null=True,
    #   blank=True,
    # )

    objects = AnnounceManager()

    def __str__(self):
        return f"{self.author.username if self.author else 'Deleted User'}"

    class Meta:
        db_table = "forums_announce"
