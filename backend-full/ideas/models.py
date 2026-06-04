from django.db import models
from django.contrib.auth.models import User


class Idea(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Vote(models.Model):

    class Choice(models.TextChoices):
        Yes = "Y"
        No = "N"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    idea = models.ForeignKey(Idea, related_name="votes", on_delete=models.CASCADE)
    choice = models.CharField(max_length=1, choices=Choice.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "idea")
