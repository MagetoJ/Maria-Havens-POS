from django.db import models
import uuid

class Guest(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    room_number = models.CharField(max_length=20)
    check_in = models.DateTimeField()
    check_out = models.DateTimeField()
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'guests'
        ordering = ['room_number']

    def __str__(self):
        return f"{self.name} - Room {self.room_number}"
