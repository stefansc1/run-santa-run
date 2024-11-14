from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render

from channels.generic.websocket import AsyncWebsocketConsumer
import json
import socket

def connect(request):
    return render(request, "client.html")

def lobby(request):
    if not settings.IP:
        # get own IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0)
        # doesn't even have to be reachable
        s.connect(('213.61.198.13', 1))  # RLI
        ip = s.getsockname()[0]
        s.close()
    else:
        ip = settings.IP
    return render(request, 'lobby.html', {'ip': ip, 'port': settings.PORT})

def run(request):
    return render(request, "santa.html")


players = dict()  # ip -> player is jumping

class Consumer(AsyncWebsocketConsumer):

    async def connect(self):
        # join room group
        self.is_santa = "santa" in self.scope["path"]
        if self.is_santa:
            await self.channel_layer.group_add("santa", self.channel_name)
        else:
            players[self] = False
            await self.channel_layer.group_add("players", self.channel_name)
            # player joined: send message to santa
            await self.channel_layer.group_send("santa", {"type": "msg", "message": {
                "players": len(players),
                "jumping": sum(players.values()),
            }})
        await self.accept()

    async def disconnect(self, close_code):
        # leave room group
        if self.is_santa:
            await self.channel_layer.group_discard('santa', self.channel_name)
        else:
            players.pop(self, None)
            await self.channel_layer.group_discard('players', self.channel_name)
            await self.channel_layer.group_send("santa", {"type": "msg", "message": {
                "players": len(players),
                "jumping": sum(players.values()),
            }})

    async def receive(self, text_data):
        # receive message from websocket
        players[self] = json.loads(text_data)["action"] == "jump"  # "jump" or ""
        await self.channel_layer.group_send("santa", {"type": "msg", "message": {
            "players": len(players),
            "jumping": sum(players.values()),
        }})
        # await self.channel_layer.group_send("santa", {"type": "jump"})

    # async def jump(self, event):
        # await self.send(text_data="jump")

    async def msg(self, message):
        await self.send(text_data=json.dumps(message["message"]))
