from rest_framework import serializers
from .models import Idea


class IdeaSerializer(serializers.ModelSerializer):
    vote_count = serializers.SerializerMethodField()

    class Meta:
        model = Idea
        fields = ["id", "title", "description", "created_at", "vote_count"]

    def get_vote_count(self, obj):
        return obj.votes.count()

    def get_has_voted(self, obj):
        user = self.context["request"].user
        return obj.votes.filter(user=user).exists()
