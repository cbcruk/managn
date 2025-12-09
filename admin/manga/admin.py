from pathlib import Path

from django import forms
from django.contrib import admin
from django.utils.html import format_html
from PIL import Image

from .models import Author, Book, BookAuthor


BOOKS_IMAGE_DIR = Path(__file__).resolve().parent.parent.parent / "public" / "books"


class BookAuthorInline(admin.TabularInline):
    model = BookAuthor
    extra = 1
    autocomplete_fields = ["author"]


class BookAdminForm(forms.ModelForm):
    cover_image = forms.ImageField(
        required=False,
        label="표지 이미지",
        help_text="업로드 시 자동으로 WebP로 변환되어 저장됩니다.",
    )

    class Meta:
        model = Book
        fields = "__all__"


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ["id", "name_ko", "name_ja"]
    search_fields = ["name_ko", "name_ja"]
    ordering = ["id"]


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    form = BookAdminForm
    list_display = ["id", "title_ko", "title_ja", "status", "get_authors", "has_cover"]
    list_filter = ["status"]
    search_fields = ["title_ko", "title_ja"]
    ordering = ["-id"]
    inlines = [BookAuthorInline]
    readonly_fields = ["cover_preview"]

    fieldsets = (
        (None, {"fields": ("title_ko", "title_ja", "status", "link")}),
        (
            "표지 이미지",
            {
                "fields": ("cover_preview", "cover_image"),
            },
        ),
    )

    @admin.display(description="작가")
    def get_authors(self, obj):
        return ", ".join([a.name_ko or a.name_ja for a in obj.authors.all()])

    @admin.display(description="표지", boolean=True)
    def has_cover(self, obj):
        image_path = BOOKS_IMAGE_DIR / f"{obj.id}.webp"

        return image_path.exists()

    @admin.display(description="현재 표지")
    def cover_preview(self, obj):
        if not obj.id:
            return "(저장 후 표시됩니다)"

        image_path = BOOKS_IMAGE_DIR / f"{obj.id}.webp"

        if image_path.exists():
            return format_html(
                '<img src="/books/{}.webp" style="max-height: 200px; border: 1px solid #ddd;" />',
                obj.id,
            )

        return "(이미지 없음)"

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

        cover_image = form.cleaned_data.get("cover_image")

        if cover_image:
            BOOKS_IMAGE_DIR.mkdir(parents=True, exist_ok=True)

            output_path = BOOKS_IMAGE_DIR / f"{obj.id}.webp"

            img = Image.open(cover_image)

            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            img.save(output_path, "WEBP", quality=85)
