from rest_framework import serializers
from .models import Idea


class IdeaSerializer(serializers.ModelSerializer):
    vote_count = serializers.SerializerMethodField()
    has_voted = serializers.SerializerMethodField()
    yes_votes = serializers.SerializerMethodField()
    no_votes = serializers.SerializerMethodField()

    class Meta:
        model = Idea
        fields = [
            "id",
            "title",
            "description",
            "created_at",
            "vote_count",
            "has_voted",
            "yes_votes",
            "no_votes",
        ]

    def get_vote_count(self, obj):
        return obj.votes.count()

    def get_has_voted(self, obj):
        user = self.context["request"].user
        return obj.votes.filter(user=user).exists()

    def get_yes_votes(self, obj):
        return obj.votes.filter(choice="Y").count()

    def get_no_votes(self, obj):
        return obj.votes.filter(choice="N").count()
