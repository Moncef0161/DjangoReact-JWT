from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},  # Ensure the password is write-only
        }

    def create(self, validated_data):
        # Use `create_user` to handle password hashing
        user = User.objects.create_user(**validated_data)
        return user
