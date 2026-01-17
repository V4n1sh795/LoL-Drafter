# views.py
import json
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
import os
import requests
from django.core.management.base import BaseCommand
from django.conf import settings



def CreateRoom(request):
    room = DraftRoom.objects.create()
    return redirect('draft_room', room_id=room.room_id)

def main_page(request):
    return render(request, "main_page.html")

def draft_room(request, room_id):
    room = DraftRoom.objects.get(room_id=room_id)
    print("blue ", room.blue_captain,"red ", room.red_captain)
    if room.blue_captain != '' and room.red_captain != '':
        return render(request, "index_test.html")
    else:
        print("NotApproved")
        return render(request, 'draft_page.html')

@require_http_methods(["POST"])
@csrf_exempt  
def join_side(request, room_id):
    room = get_object_or_404(DraftRoom, room_id=room_id)
    
    try:
        data = json.loads(request.body)
    except (ValueError, TypeError):
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    side = data.get("side")
    user_uid = data.get("user_uid")

    if not side or not user_uid:
        return JsonResponse({"error": "Missing 'side' or 'user_uid'"}, status=400)

    if side == 'blue':
        room.blue_captain = user_uid
        room.save()
        return JsonResponse({"status": "success", "side": "blue", "user": user_uid})
    elif side == 'red':
        room.red_captain = user_uid
        room.save()
        return JsonResponse({"status": "success", "side": "red", "user": user_uid})
    else:
        return JsonResponse({"error": "Invalid side. Use 'blue' or 'red'"}, status=400)

def status(_, room_id):
    room = DraftRoom.objects.get(room_id=room_id)
    if room.blue_captain and room.red_captain:
        ready = True
    else:
        ready = False
    return JsonResponse({
        'state': room.status,
        'ready': ready
        })
def loop(request, room_id):
    room = DraftRoom.objects.get(room_id=room_id)

@require_http_methods(["POST"])
@csrf_exempt
def action(request, room_id):
    data = json.loads(request.body)
    room = DraftRoom.objects.get(room_id=room_id)
    user_uid = data.get('user_uid')
    champName = data.get('champName')
    
    


    
