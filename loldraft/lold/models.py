# models.py
from django.db import models
import uuid
from django.db.models import JSONField
from enum import Enum

class Stage(Enum):
    waiting = 'waiting'
    select_side = 'select_side'
    ban_phase = 'ban_phase'
    pick_phase = 'pick_phase'

class DraftRoom(models.Model):
    room_id = models.CharField(max_length=36, unique=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    blue_captain = models.CharField(max_length=100, blank=True, default='')
    red_captain = models.CharField(max_length=100, blank=True, default='')
    status = models.CharField(max_length=10, blank=True, default='waiting')
    cur_turn = models.CharField(max_length=10, blank=True, default='waiting')
    turn_index = models.IntegerField(default=0) 
    def __str__(self):
        return f"Комната {self.room_id}"
    
class BanPhase(models.Model):
    room = models.OneToOneField(DraftRoom, on_delete=models.CASCADE, primary_key=True)
    champions_Red_team = models.JSONField(
        models.CharField(max_length=100),
        default=list,
        blank=True
    )
    champions_Blue_team = models.JSONField(
        models.CharField(max_length=100),
        default=list,
        blank=True
    )
class PickPhase(models.Model):
    room = models.OneToOneField(DraftRoom, on_delete=models.CASCADE, primary_key=True)
    champions_Red_team = models.JSONField(
        models.CharField(max_length=100),
        default=list,
        blank=True
    )
    champions_Blue_team = models.JSONField(
        models.CharField(max_length=100),
        default=list,
        blank=True
    )

