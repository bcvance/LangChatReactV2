# Generated by Django 4.0.6 on 2022-10-20 23:23

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat_api', '0009_contact'),
    ]

    operations = [
        migrations.AddField(
            model_name='chatroom',
            name='last_saved',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
    ]
