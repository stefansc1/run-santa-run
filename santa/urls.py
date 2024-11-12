from django.urls import path
from . import views

urlpatterns = [
    path("", views.connect),
    path("lobby", views.lobby),
    path("run", views.run, name='run'),
]

websocket_urlpatterns = [
    path('ws/santa/', views.Consumer.as_asgi()),
    path('ws/', views.Consumer.as_asgi()),
]
