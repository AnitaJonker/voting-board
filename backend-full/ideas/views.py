from django.db.models import Count, Q, Exists, OuterRef, Value, BooleanField
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Idea, Vote
from .serializers import IdeaSerializer


class IdeaViewSet(ModelViewSet):
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = (
            Idea.objects.all()
            .order_by("-created_at")
            .annotate(
                vote_count=Count("votes", distinct=True),
                yes_votes=Count("votes", filter=Q(votes__choice="Y"), distinct=True),
                no_votes=Count("votes", filter=Q(votes__choice="N"), distinct=True),
            )
        )

        if self.request.user and self.request.user.is_authenticated:
            queryset = queryset.annotate(
                has_voted=Exists(
                    Vote.objects.filter(
                        user=self.request.user,
                        idea=OuterRef("pk"),
                    )
                )
            )
        else:
            queryset = queryset.annotate(
                has_voted=Value(False, output_field=BooleanField())
            )

        return queryset

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
