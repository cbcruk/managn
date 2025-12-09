from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.views.static import serve
from pathlib import Path

# public/books/ 경로
BOOKS_DIR = Path(settings.BASE_DIR).parent / 'public' / 'books'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('books/<path:path>', serve, {'document_root': BOOKS_DIR}),
]
