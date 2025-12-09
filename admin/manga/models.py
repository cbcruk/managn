from django.db import models


class Author(models.Model):
    id = models.AutoField(primary_key=True)
    name_ko = models.TextField(blank=True, null=True, verbose_name="이름 (한국어)")
    name_ja = models.TextField(blank=True, null=True, verbose_name="이름 (일본어)")

    class Meta:
        managed = False
        db_table = "authors"
        verbose_name = "작가"
        verbose_name_plural = "작가"

    def __str__(self):
        return self.name_ko or self.name_ja or f"Author {self.id}"


class Book(models.Model):
    id = models.AutoField(primary_key=True)
    status = models.TextField(blank=True, null=True, verbose_name="상태")
    link = models.TextField(blank=True, null=True, verbose_name="링크")
    title_ko = models.TextField(blank=True, null=True, verbose_name="제목 (한국어)")
    title_ja = models.TextField(blank=True, null=True, verbose_name="제목 (일본어)")
    authors = models.ManyToManyField(
        Author, through="BookAuthor", related_name="books", verbose_name="작가"
    )

    class Meta:
        managed = False
        db_table = "books"
        verbose_name = "책"
        verbose_name_plural = "책"

    def __str__(self):
        return self.title_ko or self.title_ja or f"Book {self.id}"


class BookAuthor(models.Model):
    book = models.ForeignKey(
        Book, on_delete=models.CASCADE, db_column="book_id", primary_key=True
    )
    author = models.ForeignKey(Author, on_delete=models.CASCADE, db_column="author_id")

    class Meta:
        managed = False
        db_table = "book_authors"
        unique_together = (("book", "author"),)
        verbose_name = "책-작가 관계"
        verbose_name_plural = "책-작가 관계"
