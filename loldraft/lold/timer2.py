import time
from django.core.cache import cache

class SimpleRoomTimer:
    """
    Простой менеджер таймеров для комнат
    Предоставляет 3 базовых метода
    """
    
    # Префикс для ключей кэша
    CACHE_PREFIX = 'room_timer_'
    
    @classmethod
    def _get_cache_key(cls, room_id):
        """Генерирует ключ кэша"""
        return f"{cls.CACHE_PREFIX}{room_id}"
    
    @classmethod
    def _get_current_timestamp(cls):
        """Получает текущее время в секундах"""
        return int(time.time())
    
    @classmethod
    def start_timer(cls, room_id, duration_seconds):
        """
        Запускает таймер для комнаты на указанное время
        
        Args:
            room_id: идентификатор комнаты
            duration_seconds: время в секундах, на которое запустить таймер
            
        Returns:
            dict: данные запущенного таймера
        """
        cache_key = cls._get_cache_key(room_id)
        current_time = cls._get_current_timestamp()
        
        timer_data = {
            'room_id': str(room_id),
            'start_time': current_time,
            'end_time': current_time + duration_seconds,
            'duration': duration_seconds,
            'is_active': True,
            'created_at': current_time
        }
        
        # Сохраняем в кэш с запасом в 5 минут
        cache.set(cache_key, timer_data, timeout=duration_seconds + 300)
        
        return timer_data
    
    @classmethod
    def stop_timer(cls, room_id):
        """
        Останавливает таймер комнаты
        
        Args:
            room_id: идентификатор комнаты
            
        Returns:
            dict: данные остановленного таймера или None если таймера не было
        """
        cache_key = cls._get_cache_key(room_id)
        timer_data = cache.get(cache_key)
        
        if timer_data:
            # Помечаем таймер как неактивный
            timer_data['is_active'] = False
            timer_data['stopped_at'] = cls._get_current_timestamp()
            
            # Обновляем в кэше
            cache.set(cache_key, timer_data, timeout=3600)  # Храним еще час
            
            return timer_data
        
        return None
    
    @classmethod
    def reset_timer(cls, room_id):
        """
        Перезапускает таймер комнаты с тем же временем (если он существовал)
        
        Args:
            room_id: идентификатор комнаты
            
        Returns:
            dict: данные нового таймера или None, если предыдущего таймера не было
        """
        cache_key = cls._get_cache_key(room_id)
        timer_data = cache.get(cache_key)
        
        if not timer_data:
            return None  # Нет таймера для сброса
        
        duration = timer_data.get('duration')
        if duration is None:
            return None
        
        # Перезапускаем таймер с тем же duration
        return cls.start_timer(room_id, duration)
    
    # Дополнительные полезные методы (опционально)
    
    @classmethod
    def get_time_left(cls, room_id):
        """
        Получает оставшееся время таймера
        
        Args:
            room_id: идентификатор комнаты
            
        Returns:
            int: оставшееся время в секундах, 0 если таймера нет или время вышло
        """
        cache_key = cls._get_cache_key(room_id)
        timer_data = cache.get(cache_key)
        
        if not timer_data or not timer_data.get('is_active', True):
            return 0
        
        current_time = cls._get_current_timestamp()
        end_time = timer_data.get('end_time', 0)
        
        return max(0, end_time - current_time)
    
    @classmethod
    def is_timer_running(cls, room_id):
        """
        Проверяет, запущен ли таймер
        
        Args:
            room_id: идентификатор комнаты
            
        Returns:
            bool: True если таймер запущен и активен
        """
        time_left = cls.get_time_left(room_id)
        return time_left > 0
    
    @classmethod
    def get_timer_info(cls, room_id):
        """
        Получает информацию о таймере
        
        Args:
            room_id: идентификатор комнаты
            
        Returns:
            dict: информация о таймере или None если его нет
        """
        cache_key = cls._get_cache_key(room_id)
        timer_data = cache.get(cache_key)
        
        if timer_data:
            timer_data['time_left'] = cls.get_time_left(room_id)
            timer_data['is_running'] = cls.is_timer_running(room_id)
            return timer_data
        
        return None