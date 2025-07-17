from rest_framework import status

from core.fixtures.user import user

class TestCommentViewSet:

    endpoint = '/api/user/'

    def test_list(self, client, user):
        client.force_authenticate(user=user)
        response = client.get(
            self.endpoint
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1

    def test_retrieve(self, client, user):
        client.force_authenticate(user=user)
        response = client.get(
            self.endpoint +
            f"{user.public_id}/"
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == user.public_id.hex
        assert response.data['username'] == user.username
        assert response.data['email'] == user.email
        assert response.data['firstname'] == user.firstname
        assert response.data['lastname'] == user.lastname

    def test_create(self, client, user):
        client.force_authenticate(user=user)
        data = {
            "username": "test_user",
            "email": "test@gmail.com",
            "firstname": "Test",
            "lastname": "User",
            "password": "test_password"
        }
        response = client.post(
            self.endpoint,
            data
        )
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_update(self, client, user):
        client.force_authenticate(user=user)
        data = {
            "username": "test_superuser",
            "email": "testsuper@gmail.com",
            "firstname": "TestS",
            "lastname": "UserS",
            "password": "test_password",
        }
        response = client.patch(
            self.endpoint +
            f'{user.public_id}/',
            data
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == data['username']
        assert response.data['email'] == data['email']
        assert response.data['firstname'] == data['firstname']
        assert response.data['lastname'] == data['lastname']
