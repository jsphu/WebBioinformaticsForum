import pytest
from core.user.models import User

# Create your tests here.
data_user = {
    "username": "test_user",
    "email": "test@gmail.com",
    "firstname": "Test",
    "lastname": "User",
    "password": "test_password"
}
data_superuser = {
    "username": "test_superuser",
    "email": "testsuper@gmail.com",
    "firstname": "TestS",
    "lastname": "UserS",
    "password": "test_password",
}
@pytest.mark.django_db
def test_create_user():
    user = User.objects.create_user(**data_user)
    assert user.username == data_user["username"]
    assert user.email == data_user["email"]
    assert user.firstname == data_user["first_name"]
    assert user.lastname == data_user["last_name"]
    assert user.is_superuser == False

@pytest.mark.django_db
def test_create_superuser():
    user = User.objects.create_superuser(**data_superuser)
    assert user.username == data_superuser["username"]
    assert user.email == data_superuser["email"]
    assert user.firstname == data_superuser["first_name"]
    assert user.lastname == data_superuser["last_name"]
    assert user.is_superuser == True
    assert user.is_staff == True
