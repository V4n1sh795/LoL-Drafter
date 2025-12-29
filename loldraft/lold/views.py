# views.py
import json
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import DraftRoom



def CreateRoom(request):
    # Создаём комнату при любом запросе (чаще всего GET)
    room = DraftRoom.objects.create()
    return redirect('draft_room', room_id=room.room_id)
def main_page(request):
    return render(request, "main_page.html")
def draft_room(request, room_id):
    room = DraftRoom.objects.get(room_id=room_id)
    print("blue ", room.blue_captain,"red ", room.red_captain)
    if room.blue_captain != '' and room.red_captain != '':
        return render(request, "index.html")
    else:
        print("NotApproved")
        return render(request, 'draft_page.html')
def join_side(request, room_id):
    room = DraftRoom.objects.get(room_id=room_id)
    if request.method == "POST":
        data = json.loads(request.body)
        print(data)
        side = data.get("side")
        user_uid = data.get("user_uid")
        if side == 'blue':
            room.blue_captain = user_uid
            room.save()
            return redirect('draft_room', room_id=room_id)
        if side == 'red':
            room.red_captain = user_uid
            room.save()
            return redirect('draft_room', room_id=room_id)
        else:
            return JsonResponse({"error": "ok"})
def room_status(request, room_id):
    room = get_object_or_404(DraftRoom, room_id=room_id)
    ready = bool(room.blue_captain and room.red_captain)
    print({
        "ready": ready,
        "blue_captain": room.blue_captain,
        "red_captain": room.red_captain
    })
    return JsonResponse({
        "ready": ready,
        "blue_captain": room.blue_captain,
        "red_captain": room.red_captain
    })
        