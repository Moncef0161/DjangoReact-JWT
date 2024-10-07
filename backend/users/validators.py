from rest_framework import serializers


def validate_email_domain(value):
    valid_base_domains = ['gmail', 'yahoo', 'hotmail', 'outlook']
    email_domain = value.split('@')[-1]
    if not any(email_domain.split('.')[-2] == domain for domain in valid_base_domains):
        raise serializers.ValidationError(f"Le domaine de l'email doit être l'un des suivants : {', '.join(valid_base_domains)}")