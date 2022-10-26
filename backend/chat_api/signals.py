from django.db.models.signals import post_save, m2m_changed
from .models import ChatRoom
from .serializers import ChatRoomSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# when chat has been created, send message to all users in group (chat) 
# in order to notify them of creation of chat. this will trigger frontend to make
# call to api to fetch info about new chat
def notify_user(sender, instance, **kwargs):
    chat = instance
    channel_layer = get_channel_layer()
    # user_group_name is a group containing only the user whose username is contained in it
    # by sending a message to this group, only that one user will receive it 
    user_group_name = f'user_{chat.user.username}'

    # on the frontend, in Conversations.js, this message will trigger an API call to fetch the new chat
    async_to_sync(channel_layer.group_send)(
        user_group_name,
        {
            'type': 'new_chat_message'
        }
    )
# states that this signal should be executed after a new ChatRoom instance has been saved to the database   
post_save.connect(notify_user, sender=ChatRoom)
# m2m_changed.connect(notify_user)


