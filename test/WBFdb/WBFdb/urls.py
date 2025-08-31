"""
URL configuration for WBFdb project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from itertools import chain

from django.contrib import admin
from django.urls import path, include, re_path
from django.http import HttpResponsePermanentRedirect
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter

from forums.urls import (
    WBFUserViewSet, AnnounceViewSet, OpineViewSet,
    TokenWithUserRefreshView, AmplifyViewSet, ReportViewSet,
    TokenWithUserDataView, WBFUserRegisterView, VersionView
)
from pipelines.urls import PipelineViewSet, ProcessViewSet, ParameterViewSet

router = DefaultRouter()
router.register(r'users', WBFUserViewSet, basename="users")
router.register(r'reports', ReportViewSet, basename="reports")
router.register(r'posts', AnnounceViewSet, basename="posts")
router.register(r'shares', AmplifyViewSet, basename="shares")
router.register(r'pipelines', PipelineViewSet, basename="pipelines")
router.register(r'processes', ProcessViewSet, basename="processes")
router.register(r'parameters', ParameterViewSet, basename="parameters")

commentable_models = [
    # ("prefix", "lookup")
    ("posts", "post"),
    ("shares", "share"),
    ("pipelines", "pipeline"),
    ("processes", "process"),
    ("parameters", "parameter"),
]

shareable_models = [
    # ("prefix", "lookup")
    ("posts", "post"),
    ("pipelines", "pipeline"),
    ("processes", "process"),
    ("parameters", "parameter"),
]

def generate_redirect_patterns():
    """Generate redirect patterns for all shareable models"""
    uuid_pattern = r'[0-9a-fA-F]{32}|[0-9a-fA-F-]{36}'

    redirect_patterns = []
    for model_prefix, lookup in shareable_models:
        redirect_patterns.extend([
# /api/{model}/<parent_pk>/shares/<share_pk>/comments/ -> /api/shares/<share_pk>/comments/
re_path(
    rf'^{model_prefix}/(?P<parent_pk>{uuid_pattern})/shares/(?P<item_pk>{uuid_pattern})/comments/$',
    lambda request, parent_pk, item_pk: HttpResponsePermanentRedirect(f"/api/shares/{item_pk}/comments/"),
    name=f'redirect-{model_prefix}-shares-comments'
),

# /api/{model}/<parent_pk>/shares/<share_pk>/comments/<comment_pk>/ -> /api/shares/<share_pk>/comments/<comment_pk>/
re_path(
    rf'^{model_prefix}/(?P<parent_pk>{uuid_pattern})/shares/(?P<item_pk>{uuid_pattern})/comments/(?P<comment_pk>{uuid_pattern})/$',
    lambda request, parent_pk, item_pk, comment_pk: HttpResponsePermanentRedirect(f"/api/shares/{item_pk}/comments/{comment_pk}/"),
    name=f'redirect-{model_prefix}-shares-comment-detail'
),

# /api/{model}/<parent_pk>/shares/<share_pk>/comments/<comment_pk>/likes/ -> /api/shares/<share_pk>/comments/<comment_pk>/likes/
re_path(
    rf'^{model_prefix}/(?P<parent_pk>{uuid_pattern})/shares/(?P<item_pk>{uuid_pattern})/comments/(?P<comment_pk>{uuid_pattern})/likes/$',
    lambda request, parent_pk, item_pk, comment_pk: HttpResponsePermanentRedirect(f"/api/shares/{item_pk}/comments/{comment_pk}/likes/"),
    name=f'redirect-{model_prefix}-shares-comment-likes'
),

# /api/{model}/<parent_pk>/shares/<share_pk>/likes/ -> /api/shares/<share_pk>/likes/
re_path(
    rf'^{model_prefix}/(?P<parent_pk>{uuid_pattern})/shares/(?P<item_pk>{uuid_pattern})/likes/$',
    lambda request, parent_pk, item_pk: HttpResponsePermanentRedirect(f"/api/shares/{item_pk}/likes/"),
    name=f'redirect-{model_prefix}-shares-likes'
),

# /api/{model}/<parent_pk>/shares/<share_pk>/ -> /api/shares/<share_pk>/
re_path(
    rf'^{model_prefix}/(?P<parent_pk>{uuid_pattern})/shares/(?P<item_pk>{uuid_pattern})/$',
    lambda request, parent_pk, item_pk: HttpResponsePermanentRedirect(f"/api/shares/{item_pk}/"),
    name=f'redirect-{model_prefix}-shares-detail'
),
        ])

    return redirect_patterns

nested_urls = []
for prefix, lookup in commentable_models:
    comments_router = NestedDefaultRouter(router, prefix, lookup=lookup)
    comments_router.register(r'comments', OpineViewSet, basename=f"{prefix}-comments")
    nested_urls += [comments_router.urls]
for prefix, lookup in shareable_models:
    shares_router = NestedDefaultRouter(router, prefix, lookup=lookup)
    shares_router.register(r'shares', AmplifyViewSet, basename=f"{prefix}-shares")
    nested_urls += [shares_router.urls]

redirected_urls = generate_redirect_patterns()
# /api/{model}/<pk>/shares/<pk>/comments/           -> /api/shares/<pk>/comments/
# /api/{model}/<pk>/shares/<pk>/comments/<pk>/      -> /api/shares/<pk>/comments/<pk>/
# /api/{model}/<pk>/shares/<pk>/comments/<pk>/likes/-> /api/shares/<pk>/comments/<pk>/likes/
# /api/{model}/<pk>/shares/<pk>/likes/              -> /api/shares/<pk>/likes/
# /api/{model}/<pk>/shares/<pk>/                    -> /api/shares/<pk>/

# Combine all URLs - put redirecteds 'FIRST' so they catch before nested routes
all_urls = list(chain(redirected_urls, router.urls, *nested_urls))

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(all_urls)),
    path('api/auth/login/', TokenWithUserDataView.as_view(), name="token-obtain"),
    path('api/auth/register/', WBFUserRegisterView.as_view(), name="register"),
    path('api/auth/refresh/', TokenWithUserRefreshView.as_view(), name="token-refresh"),
    path('api/version/', VersionView.as_view(), name="version")
]
