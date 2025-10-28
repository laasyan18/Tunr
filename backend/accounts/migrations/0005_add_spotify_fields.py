# Generated migration to add spotify fields to CustomUser
from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_dailyaggregate_moderationqueue_userevent'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='spotify_id',
            field=models.CharField(max_length=128, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='spotify_display_name',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='spotify_access_token',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='spotify_refresh_token',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='spotify_token_expires',
            field=models.DateTimeField(null=True, blank=True),
        ),
    ]
