# views.py
import json
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import DraftRoom
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
        return render(request, "index.html")
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
def process_draft(request, room_id):
    room = get_object_or_404(DraftRoom, room_id=room_id)
@require_http_methods(["POST"])
@csrf_exempt
def handle_draft_action(request, room_id):
    try:
        data = json.loads(request.body)
    except (ValueError, TypeError):
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    room_id = data.get("room_id")
    user_uid = data.get("user_uuid")
    champion_name = data.get("champion")
    action_type = data.get("action")  # 'ban' или 'pick'

    if not all([room_id, user_uid, champion_name, action_type]):
        return JsonResponse({"error": "Missing required fields"}, status=400)

    if action_type not in ['ban', 'pick']:
        return JsonResponse({"error": "Action must be 'ban' or 'pick'"}, status=400)

    room = get_object_or_404(DraftRoom, room_id=room_id)

    # Определяем, за какую сторону играет пользователь
    if user_uid == room.blue_captain:
        user_side = 'blue'
    elif user_uid == room.red_captain:
        user_side = 'red'
    else:
        return JsonResponse({"error": "User is not a captain in this room"}, status=403)

    # Проверка, что сейчас ход пользователя
    if room.current_turn != user_side:
        return JsonResponse({"error": "Not your turn"}, status=403)

    # Определяем текущую фазу по количеству действий
    total_actions = room.actions.count()
    expected_action_type = None

    # Пример логики: первые 6 действий — баны (3 на команду), затем пики
    # Это упрощённая модель. Вы можете адаптировать под правила LoL (например, 5 банов на команду и т.д.)
    if total_actions < 6:
        expected_action_type = 'ban'
        next_phase = 'banning'
    else:
        expected_action_type = 'pick'
        next_phase = 'picking'

    if action_type != expected_action_type:
        return JsonResponse({"error": f"Current phase is {expected_action_type}, not {action_type}"}, status=400)

    # Сохраняем действие
    ChampionAction.objects.create(
        room=room,
        champion_name=champion_name,
        action_type=action_type,
        side=user_side,
        order=total_actions + 1
    )

    # Переключаем ход
    room.current_turn = 'red' if user_side == 'blue' else 'blue'
    room.status = next_phase
    room.save()

    # Простая логика завершения (например, после 10 пиков — 5 на команду)
    if total_actions + 1 >= 16:  # 6 банов + 10 пиков
        room.status = 'finished'
        room.save()

    return JsonResponse({"status": "success", "action_order": total_actions + 1})
def room_status(request, room_id):
    room = get_object_or_404(DraftRoom, room_id=room_id)

    # Собираем действия (баны/пики) в сериализуемый формат
    actions = [
        {
            "champion_name": action.champion_name,
            "action_type": action.action_type,
            "side": action.side,
            "order": action.order
        }
        for action in room.actions.all()
    ]

    response_data = {
        "room_id": room.room_id,
        "status": room.status,
        "current_turn": room.current_turn,
        "blue_captain": room.blue_captain or None,
        "red_captain": room.red_captain or None,
        "ready": bool(room.blue_captain and room.red_captain),
        "actions": actions,
    }

    return JsonResponse(response_data)
@require_http_methods(["POST"])
@csrf_exempt
def perform_action(request, room_id):
    data = json.loads(request.body) #{'user_uuid': 'user_0816ea31', 'champion': 'Ahri', 'action': 'ban'}
    
# views.py
import json
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from .models import DraftRoom, ChampionAction
import uuid

def main_page(request):
    return render(request, "main_page.html")

def create_room(request):
    room = DraftRoom.objects.create()
    return JsonResponse({"room_id": room.room_id})

def draft_room(request, room_id):
    room = get_object_or_404(DraftRoom, room_id=room_id)
    if room.blue_captain and room.red_captain:
        return render(request, "index.html")  # ваш HTML-файл с драфтом
    else:
        return render(request, "draft_page.html")  # страница выбора стороны

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

    if side not in ("blue", "red") or not user_uid:
        return JsonResponse({"error": "Invalid side or missing user_uid"}, status=400)

    if side == "blue":
        room.blue_captain = user_uid
    else:
        room.red_captain = user_uid
    room.save()

    return JsonResponse({"status": "success", "side": side, "user": user_uid})

@require_http_methods(["GET"])
def room_status(request, room_id):
    room = get_object_or_404(DraftRoom, room_id=room_id)

    actions = [
        {
            "champion_name": a.champion_name,
            "action_type": a.action_type,
            "side": a.side,
            "order": a.order
        }
        for a in room.actions.all()
    ]

    # Определяем текущую фазу по количеству действий
    total_bans = sum(1 for a in actions if a["action_type"] == "ban")
    total_picks = sum(1 for a in actions if a["action_type"] == "pick")

    # Пример: 5 банов на команду → 10 банов всего
    if total_bans < 10:
        phase = "banning"
    elif total_picks < 10:
        phase = "picking"
    else:
        phase = "finished"

    return JsonResponse({
        "room_id": room.room_id,
        "status": room.status,
        "phase": phase,
        "current_turn": room.current_turn,
        "blue_captain": room.blue_captain or None,
        "red_captain": room.red_captain or None,
        "ready": bool(room.blue_captain and room.red_captain),
        "actions": actions,
    })

@require_http_methods(["POST"])
@csrf_exempt
def handle_draft_action(request, room_id):
    room = get_object_or_404(DraftRoom, room_id=room_id)

    try:
        data = json.loads(request.body)
    except (ValueError, TypeError):
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    user_uid = data.get("user_uuid")
    champion = data.get("champion")
    action = data.get("action")  # 'ban' or 'pick'

    if not user_uid or not champion or action not in ("ban", "pick"):
        return JsonResponse({"error": "Missing required fields"}, status=400)

    # Определяем, за кого играет пользователь
    if user_uid == room.blue_captain:
        user_side = "blue"
    elif user_uid == room.red_captain:
        user_side = "red"
    else:
        return JsonResponse({"error": "User not in this room"}, status=403)

    # Проверка: сейчас ход этого игрока?
    if room.current_turn != user_side:
        return JsonResponse({"error": "Not your turn"}, status=403)

    # Проверка: не выбран ли чемпион уже?
    if room.actions.filter(champion_name=champion).exists():
        return JsonResponse({"error": "Champion already banned or picked"}, status=400)

    # Сохраняем действие
    order = room.actions.count() + 1
    ChampionAction.objects.create(
        room=room,
        champion_name=champion,
        action_type=action,
        side=user_side,
        order=order
    )

    # Переключаем ход
    room.current_turn = "red" if user_side == "blue" else "blue"
    room.save()

    return JsonResponse({"status": "success", "order": order})