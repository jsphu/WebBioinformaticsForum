from rest_framework import serializers

class PIPESerializer(serializers.ModelSerializer):

    id = serializers.UUIDField(
        source='public_id',
        read_only=True,
        format='hex'
    )
