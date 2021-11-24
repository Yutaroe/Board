from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Profile, Post, Comment

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ('id','email','password')
        extra_kwargs= {'password': {'write_only': True}}

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=Profile
        fields = ('profile_id', 'nickname', 'profileUser', 'image')
        extra_kwargs = {'profileUser': {'read_only': True}}

class PostSerializer(serializers.ModelSerializer):
    created_on = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    class Meta:
        model = Post
        fields = ('post_id', 'title', 'contents', 'created_on', 'image','postUser')
        extra_kwargs = {'postUser': {'read_only': True}}

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('comment_id', 'contents', 'commentUser','post')
        extra_kwargs = {'commentUser': {'read_only': True}}