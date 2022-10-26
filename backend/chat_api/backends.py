from django.contrib.auth.backends import ModelBackend
from .models import MyUser
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.contrib.auth import get_user_model

class MyBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        MyUser = get_user_model()
        if username is None:
            username = kwargs.get(MyUser.USERNAME_FIELD)
        if username is None or password is None:
            return None
        # determine whether user entered username or email
        try:
            validate_email(username)
            user = MyUser.objects.filter(email=username).first()
        except ValidationError as e:
            user = MyUser.objects.filter(username=username).first()
        finally:
            if not user:
                MyUser().set_password(password)
            else:
                if user.check_password(password) and self.user_can_authenticate(user):
                    return user
        

    def get_user(self, user_id):
        try:
            return MyUser.objects.get(pk=user_id)
        except MyUser.DoesNotExist:
            return None
        