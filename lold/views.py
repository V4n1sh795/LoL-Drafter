# views.py
import json
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
import os
import requests
from django.core.management.base import BaseCommand
from django.conf import settings
import time
from django.utils import timezone
from datetime import timedelta
from .timer2 import SimpleRoomTimer
from .forms import ChampionSelectForm
def champ_data():
    icons_dir = os.path.join(settings.BASE_DIR, 'static', 'icons')
    champion_data = []

    if os.path.exists(icons_dir):
        for filename in os.listdir(icons_dir):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.svg')):
                name = os.path.splitext(filename)[0]
                icon_url = static(f'icons/{filename}')
                champion_data.append({'name': name, 'icon_url': icon_url})
        champion_data.sort(key=lambda x: x['name'])
    return champion_data

def get_champs(request):
    icons_dir = os.path.join(settings.STATIC_ROOT or settings.BASE_DIR, 'icons')
    champions = []
    
    if os.path.exists(icons_dir):
        for filename in os.listdir(icons_dir):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.svg')):
                name = os.path.splitext(filename)[0]
                icon_url = f"/static/icons/" + filename
                champions.append({
                    'name': name,
                    'icon_url': icon_url
                })
        champions.sort(key=lambda x: x['name'])
    print(champions)
    return JsonResponse({'data': champions})  # ← список объектов
def CreateRoom(request):
    room = DraftRoom.objects.create()
    return redirect('draft_room', room_id=room.room_id)

def main_page(request):
    return render(request, "main_page.html")

def draft_room(request, room_id):
    room = DraftRoom.objects.get(room_id=room_id)
    print("blue ", room.blue_captain,"red ", room.red_captain)
    if room.blue_captain != '' and room.red_captain != '':
        room.status = 'ban_phase'
        SimpleRoomTimer.start_timer(room_id=room_id, duration_seconds=30.0)
        room.cur_turn = 'blue'
        room.turn_index = 1
        room.save()
        champion_data = champ_data()
        
        form = ChampionSelectForm(champion_data)
        return render(request, 'index_test.html', {
        'form': form,
        'champion_data': champion_data,  # ← передаём отдельно для шаблона
        'room_id': room_id,
    })
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
def update(_, room_id):
    room = DraftRoom.objects.get(room_id=room_id)
    bans, _ = BanPhase.objects.get_or_create(room=room)
    picks, _ = PickPhase.objects.get_or_create(room=room)
    cur_Turn = room.blue_captain if room.cur_turn == 'blue'  else room.red_captain
    data = {
        't_ind': room.turn_index,
        'time': SimpleRoomTimer.get_time_left(room_id=room_id),
        'cur_Turn': cur_Turn,
        'status': room.status,
        'red_bans': bans.champions_Red_team,
        'blue_bans': bans.champions_Blue_team,
        'red_picks': picks.champions_Red_team,
        'blue_piks': picks.champions_Blue_team
    }
    if len(picks.champions_Blue_team) == 5 and len(picks.champions_Red_team) == 5:
        room.status = 'end'
        room.save()
    return JsonResponse(data=data)
@require_http_methods(["POST"])
@csrf_exempt
def action(request, room_id):
    
    data = json.loads(request.body)
    try:
        room = DraftRoom.objects.get(room_id=room_id)
    except DraftRoom.DoesNotExist:
        return JsonResponse({"error": "Room not found"}, status=404)
    room.turn_index += 1
    bans, _ = BanPhase.objects.get_or_create(room=room)
    picks, _ = PickPhase.objects.get_or_create(room=room)
    
    user_uid = data.get('user_uid')
    champName = data.get('champName')
    
    if not champName:
        return JsonResponse({"error": "champName is required"}, status=400)
    
    
    if room.turn_index == 0:
        return JsonResponse({"status": 'error'}, status=500)
    if room.status == 'end':
        pass
    else:
        if room.turn_index in (1, 2, 3, 4, 5, 6, 7, 13, 14, 15, 16, 17):
            room.status = 'ban_phase'
        if room.turn_index in (8, 9, 10, 11, 12, 13, 18, 19, 20):
                room.status = 'pick_phase'
    
    match (room.turn_index):
        case 1:
            room.cur_turn = 'blue'  # ban
        case 2:
            room.cur_turn = 'red'   # ban
        case 3:
            room.cur_turn = 'blue'   # ban
        case 4:
            room.cur_turn = 'red'   # ban
        case 5:
            room.cur_turn = 'blue'  # ban
        case 6:
            room.cur_turn = 'red'   # ban
        case 7:
            room.cur_turn = 'blue'  # pick
        case 8:
            room.cur_turn = 'red'   # pick
        case 9:
            room.cur_turn = 'red'   # pick
        case 10:
            room.cur_turn = 'blue'  # pick
        case 11:
            room.cur_turn = 'blue'  # pick
        case 12:
            room.cur_turn = 'red'   # pick
        case 13:
            room.cur_turn = 'blue'  # ban
        case 14:
            room.cur_turn = 'red'   # ban
        case 15:
            room.cur_turn = 'blue'  # ban
        case 16:
            room.cur_turn = 'red'   # ban
        case 17:
            room.cur_turn = 'red'   # pick
        case 18:
            room.cur_turn = 'blue'  # pick
        case 19:
            room.cur_turn = 'blue'  # pick
        case 20:
            room.cur_turn = 'red'   # pick
        
    room.save()
    response_data = {"status": room.status}
    if room.status == 'ban_phase':
        if room.blue_captain == user_uid:
            # Добавляем в синюю команду (более безопасный способ)
            bans.champions_Blue_team = bans.champions_Blue_team or []
            bans.champions_Blue_team.append(champName)
            SimpleRoomTimer.reset_timer(room_id=room_id)
            bans.save()
            room.save()
            response_data["bans"] = (bans.champions_Blue_team or []) + (bans.champions_Red_team or [])
            
        elif room.red_captain == user_uid:
            bans.champions_Red_team = bans.champions_Red_team or []
            bans.champions_Red_team.append(champName)
            SimpleRoomTimer.reset_timer(room_id=room_id)
            bans.save()
            room.save()
            response_data["bans"] = (bans.champions_Blue_team or []) + (bans.champions_Red_team or [])
        else:
            return JsonResponse({"error": "Not authorized"}, status=403)
            
        return JsonResponse(response_data)
    
    elif room.status == 'pick_phase':
        if room.blue_captain == user_uid:
            picks.champions_Blue_team = picks.champions_Blue_team or []
            picks.champions_Blue_team.append(champName)
            picks.save()
            SimpleRoomTimer.reset_timer(room_id=room_id)
            room.save()
            response_data["picks"] = (picks.champions_Blue_team or []) + (picks.champions_Red_team or [])
            
        elif room.red_captain == user_uid:
            # ВАЖНО: здесь была ошибка - добавляли в синюю команду вместо красной
            picks.champions_Red_team = picks.champions_Red_team or []
            picks.champions_Red_team.append(champName)
            SimpleRoomTimer.reset_timer(room_id=room_id)
            picks.save()
            room.save()
            response_data["picks"] = (picks.champions_Blue_team or []) + (picks.champions_Red_team or [])
        else:
            return JsonResponse({"error": "Not authorized"}, status=403)
            
        return JsonResponse(response_data)
    
    else:
        return JsonResponse({"status": room.status, "message": "Room is not in active phase"})
