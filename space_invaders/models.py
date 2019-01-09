from django.db import models


class Ship(models.Model):
    x_position = models.IntegerField(null=True)
    y_position = models.IntegerField(null=True)
    default = models.BooleanField(default=False)
