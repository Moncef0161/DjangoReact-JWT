from users.views import UserViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from django.urls import path, include

# Register the UserViewSet with the router
router = DefaultRouter()
router.register(r"user", UserViewSet, basename="user")

urlpatterns = [
    # Include the router-generated URLs
    path('', include(router.urls)),

    # JWT token authentication endpoints
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),

    # Django REST Framework's login/logout views
    path("auth/", include("rest_framework.urls")),
]
