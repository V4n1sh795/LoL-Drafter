# forms.py
from django import forms

class ChampionSelectForm(forms.Form):
    champion = forms.ChoiceField(widget=forms.RadioSelect, choices=[])

    def __init__(self, champion_data, *args, **kwargs):
        # champion_data = [{'name': 'Akali', 'icon_url': '/static/...'}, ...]
        super().__init__(*args, **kwargs)
        self.champion_data = champion_data
        self.fields['champion'].choices = [(item['name'], item['name']) for item in champion_data]