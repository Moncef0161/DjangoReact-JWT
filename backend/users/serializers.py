from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'avatar']
        extra_kwargs = {
            'password': {'write_only': True},  # Ensure the password is write-only
        }

    def create(self, validated_data):
        # Use create_user to handle password hashing
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        # Update password with proper hashing
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance
