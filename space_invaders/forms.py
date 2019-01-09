from django.forms import ModelForm

from space_invaders.models import Ship


class ShipForm(ModelForm):

    class Meta:
        model = Ship
        fields = ['x_position', 'y_position']
