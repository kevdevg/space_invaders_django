# Generated by Django 2.1 on 2019-01-09 00:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('space_invaders', '0002_auto_20190109_0009'),
    ]

    operations = [
        migrations.AddField(
            model_name='ship',
            name='default',
            field=models.BooleanField(default=False),
        ),
    ]