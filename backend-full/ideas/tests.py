from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from .models import Idea, Vote


class VoteRuleTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="voter", password="pass1234")
        self.idea = Idea.objects.create(
            title="Example idea",
            description="An idea for single vote testing.",
            created_by=self.user,
        )
        self.client = APIClient()
        token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

    def test_single_vote_per_user_for_an_idea(self):
        print("\n🧪 Testing single vote per user per idea")

        vote_url = f"/api/ideas/{self.idea.id}/vote/"

        print("-> Sending first vote: Y")
        first_response = self.client.post(vote_url, {"choice": "Y"}, format="json")
        print(f"   first_response.status_code={first_response.status_code}")
        print(f"   first_response.data={first_response.data}")
        self.assertEqual(first_response.status_code, 200)

        vote_count_after_first = Vote.objects.filter(
            user=self.user, idea=self.idea
        ).count()
        print(f"   vote_count_after_first={vote_count_after_first}")
        self.assertEqual(vote_count_after_first, 1)

        print("-> Sending second vote: N")
        second_response = self.client.post(vote_url, {"choice": "N"}, format="json")
        print(f"   second_response.status_code={second_response.status_code}")
        print(f"   second_response.data={second_response.data}")
        self.assertEqual(second_response.status_code, 200)

        vote_count_after_second = Vote.objects.filter(
            user=self.user, idea=self.idea
        ).count()
        print(f"   vote_count_after_second={vote_count_after_second}")
        self.assertEqual(vote_count_after_second, 1)

        vote = Vote.objects.get(user=self.user, idea=self.idea)
        print(f"   stored_choice={vote.choice}")
        self.assertEqual(vote.choice, "N")
