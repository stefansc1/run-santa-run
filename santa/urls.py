from django.urls import path
from . import views


urlpatterns = [
    path("", views.lobby, name='lobby'),
    path("click/", views.connect, name="click"),
    path("watch/", views.watch, name='watch'),
    path("level1/", views.serve_xml_level, name='level1'),
    path("single_play/", views.single_play, name='single_play'),
]
websocket_urlpatterns = [
    path('ws/santa/', views.Consumer.as_asgi()),
    path('ws/', views.Consumer.as_asgi()),
]
