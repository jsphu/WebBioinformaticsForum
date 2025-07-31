from test1 import models
from rest_framework import serializers

class Test1Serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Test1
        fields = ['first_thing', 'last_thing']
