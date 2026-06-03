from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Idea, Vote
from .serializers import IdeaSerializer


class IdeaViewSet(ModelViewSet):
    queryset = Idea.objects.all().order_by("-created_at")
    serializer_class = IdeaSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["post"])
    def vote(self, request, pk=None):
        idea = self.get_object()
        choice = request.data.get("choice")
        if choice not in ["Y", "N"]:
            return Response({"error": "Invalid choice"}, status=400)

        vote, created = Vote.objects.get_or_create(
            user=request.user,
            idea=idea,
            defaults={"choice": choice},
        )

        if not created:
            vote.choice = choice
            vote.save()

        return Response({"status": "voted", "choice": choice})

    @action(detail=True, methods=["delete"])
    def unvote(self, request, pk=None):
        idea = self.get_object()
        Vote.objects.filter(user=request.user, idea=idea).delete()
        return Response({"status": "unvoted"})

    def get_serializer_context(self):
        return {"request": self.request}
