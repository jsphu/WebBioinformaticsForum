from test1 import models
from rest_framework import serializers
from drf_extra_fields.fields import Base64FileField
from django import forms
import base64

class ManualBase64FileField(serializers.Field):
    def to_representation(self, value):
        if not value:
            return None
        with value.open('rb') as f:
            encoded = base64.b64encode(f.read()).decode('utf-8')
        return encoded

    def to_internal_value(self, data):
        # Implement decoding if you want upload support via base64 string
        raise NotImplementedError("Uploading via base64 not supported yet")


class Test1Serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Test1
        fields = ['first_thing', 'last_thing']

class FileForm(forms.ModelForm):
    class Meta:
        model = models.FileModel
        fields = '__all__'

class FileSerializer(serializers.ModelSerializer):
    file = ManualBase64FileField()
    class Meta:
        model = models.FileModel
        fields = ['id', 'title', 'file']

class ImageSerializer(serializers.ModelSerializer):
    img = serializers.ImageField()
    class Meta:
        model = models.ImageModel
        fields = ['id', 'img']
