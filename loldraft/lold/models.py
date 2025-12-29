# models.py
from django.db import models
import uuid

class DraftRoom(models.Model):
    room_id = models.CharField(max_length=36, unique=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('waiting', 'Ожидание капитанов'),
            ('banning', 'Фаза банов'),
            ('picking', 'Фаза пиков'),
            ('finished', 'Завершено')
        ],
        default='waiting'
    )
    current_turn = models.CharField(
        max_length=10,
        choices=[('blue', 'Blue'), ('red', 'Red')],
        default='blue'
    )
    blue_captain = models.CharField(max_length=100, blank=True, default='')
    red_captain = models.CharField(max_length=100, blank=True, default='')

    def __str__(self):
        return f"Комната {self.room_id}"


class ChampionAction(models.Model):
    CHAMPION_ACTION_CHOICES = [
        ('ban', 'Ban'),
        ('pick', 'Pick'),
    ]

    room = models.ForeignKey(DraftRoom, on_delete=models.CASCADE, related_name='actions')
    champion_name = models.CharField(max_length=50)  # например, 'Ahri'
    action_type = models.CharField(max_length=10, choices=CHAMPION_ACTION_CHOICES)
    side = models.CharField(max_length=10, choices=[('blue', 'Blue'), ('red', 'Red')])
    timestamp = models.DateTimeField(auto_now_add=True)
    order = models.PositiveIntegerField()  # порядок действия (1-й бан, 2-й бан и т.д.)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.side} {self.action_type}s {self.champion_name}"