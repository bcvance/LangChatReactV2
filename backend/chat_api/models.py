from email.policy import default
from tokenize import blank_re
from django.db import models
from datetime import datetime

from unittest.util import _MAX_LENGTH
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

from django.db import models

# Create your models here.

# model used for matching users. users are deleted from this table once they are matched
class TempUser(models.Model):
    username = models.CharField(max_length=20)
    knows = models.CharField(max_length=20)
    learning = models.CharField(max_length=20)
    room_name = models.ForeignKey('ChatRoom', on_delete=models.CASCADE, blank=True, null=True)

class MyUser(AbstractUser):
    email = models.EmailField(unique=True)
    default_knows_language = models.CharField(max_length=200, blank=True, null=True)
    default_learning_language = models.CharField(max_length=200, blank=True, null=True)


class ChatRoom(models.Model):
    user = models.ForeignKey(MyUser, related_name = 'chats', on_delete = models.CASCADE, blank=True, null=True)
    other_users = models.ManyToManyField(MyUser, blank=True, null=True)
    websocket_url = models.URLField(blank=True, null=True)
    shared_id = models.CharField(max_length=200, blank=True, null=True)
    last_saved = models.DateTimeField(default=datetime.now)

    def save(self, *args, **kwargs):
        '''On save, update timestamps'''
        print('timestamp updated')
        self.last_saved = timezone.now()
        return super(ChatRoom, self).save(*args, **kwargs)

class Message(models.Model):
    content = models.CharField(max_length=5000)
    sender = models.ForeignKey('MyUser', on_delete = models.SET_NULL, null=True, related_name='sender')
    chats = models.ManyToManyField('ChatRoom', related_name='messages')
    send_time = models.DateTimeField(default=datetime.now)

    def save(self, *args, **kwargs):
        '''On save, update timestamps'''
        if not self.id:
            self.send_time = timezone.now()
            return super(Message, self).save(*args, **kwargs)

class Contact(models.Model):
    user = models.ForeignKey('MyUser', on_delete = models.CASCADE, related_name = 'contacts')
    contact = models.ForeignKey('MyUser', on_delete = models.CASCADE)



