from django.db import models
import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings
from django.db.models.deletion import CASCADE
from django.db.models.expressions import Case
from django.db.models.fields import related

def upload_avater(instance, filename):
    ext = filename.split('.')[-1]
    return '/'.join(['avatars', str(instance.profileUser.id)+str(instance.nickname)+str(".")+str(ext)])

def upload_post(instance, filename):
    ext = filename.split('.')[-1]
    return '/'.join(['posts', str(instance.postUser.id)+str(instance.title)+str(".")+str(ext)])


class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('email is must')

        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using= self._db)

        return user

class User(AbstractBaseUser, PermissionsMixin):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email

class Profile(models.Model):
    profile_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profileUser = models.OneToOneField(User,related_name='profileUser', on_delete=CASCADE)
    nickname = models.CharField(max_length=20)
    image = models.ImageField(upload_to=upload_avater,blank=True, null=True)

    def __str__(self):
        return self.nickname

class Post(models.Model):
    post_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=50)
    contents = models.TextField()
    postUser = models.ForeignKey(User, related_name='postUser', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=upload_post,blank=True, null=True)
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Comment(models.Model):
    comment_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    contents = models.TextField()
    commentUser = models.ForeignKey(User, related_name='commentUser', on_delete=CASCADE)
    post = models.ForeignKey(Post, related_name='post', on_delete=CASCADE)

    def __str__(self):
        return self.contents
