import json

from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from django.views.generic import TemplateView
from django.views.generic import UpdateView

from space_invaders.models import Ship

from space_invaders.forms import ShipForm


class ServeGameTemplateView(TemplateView):
    template_name = 'space_invaders/index.html'

    def get_context_data(self, **kwargs):
        context = super(ServeGameTemplateView, self).get_context_data(**kwargs)
        context['ship'] = Ship.objects.filter(default=True).first()
        return context


class SaveShipStateView(UpdateView):
    model = Ship

    def get_object(self, queryset=None):
        ship, created = Ship.objects.get_or_create(default=True)
        return ship

    def post(self, request, *args, **kwargs):
        ship = self.get_object()
        data = json.loads(request.body)
        ship.x_position = data['x']
        ship.y_position = data['y']
        ship.save()
        return HttpResponse(status=200, content="everything works")
